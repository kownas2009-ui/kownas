import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Send,
  Loader2,
  Clock,
  Reply,
  Plus,
  ChevronDown,
  ChevronUp,
  User
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import useNotificationSound from "@/hooks/useNotificationSound";

interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  message: string;
  is_read: boolean;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
  student_read_reply: boolean;
}

const StudentMessaging = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string; phone: string | null } | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const { playNotificationSound } = useNotificationSound();
  const lastMessageCountRef = useRef<number>(0);
  const lastAdminReplyRef = useRef<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchProfile();

      // Set up realtime subscription
      const channel = supabase
        .channel('student-messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'contact_messages',
            filter: `sender_email=eq.${user.email}`
          },
          (payload) => {
            console.log('Realtime message update:', payload);
            
            if (payload.eventType === 'INSERT') {
              const newMsg = payload.new as ContactMessage;
              setMessages(prev => [newMsg, ...prev]);
              // Only play sound if admin sent a new message (admin_reply exists)
              // and it's not the student's own message
              if (newMsg.admin_reply) {
                playNotificationSound();
                toast.info("Nowa odpowiedź od Anety!");
              }
              // Don't show notification for own messages
            } else if (payload.eventType === 'UPDATE') {
              const updatedMsg = payload.new as ContactMessage;
              const oldMsg = payload.old as Partial<ContactMessage>;
              
              setMessages(prev => prev.map(m => 
                m.id === updatedMsg.id ? updatedMsg : m
              ));
              
              // Only play sound if admin_reply was added or changed (not when student reads or updates)
              if (updatedMsg.admin_reply && updatedMsg.admin_reply !== oldMsg.admin_reply) {
                playNotificationSound();
                toast.info("Nowa odpowiedź od Anety!");
              }
              // Don't notify when student marks message as read or when student updates message
            } else if (payload.eventType === 'DELETE') {
              const deletedId = (payload.old as ContactMessage).id;
              setMessages(prev => prev.filter(m => m.id !== deletedId));
            }
          }
        )
        .subscribe();

      // Auto-refresh every 2 minutes as fallback
      const refreshInterval = setInterval(() => {
        fetchMessages();
      }, 120000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(refreshInterval);
      };
    }
  }, [user, playNotificationSound]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (data) setProfile(data);
  };

  const fetchMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("sender_email", user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim() || !profile) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          sender_name: profile.full_name,
          sender_email: user.email!,
          sender_phone: profile.phone,
          message: newMessage.trim(),
          student_read_reply: true
        });

      if (error) throw error;

      toast.success("Wiadomość wysłana!");
      setNewMessage("");
      setShowNewForm(false);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Błąd podczas wysyłania wiadomości");
    } finally {
      setSending(false);
    }
  };

  const handleReplyInThread = async (messageId: string, existingMessage: string) => {
    if (!replyText.trim()) return;

    setSending(true);
    try {
      const timestamp = new Date().toISOString();
      const newReply = `[${timestamp}] ${replyText.trim()}`;
      const updatedMessage = existingMessage 
        ? `${existingMessage}\n---\n${newReply}`
        : newReply;

      const { error } = await supabase
        .from("contact_messages")
        .update({ 
          message: updatedMessage,
          student_read_reply: true
        })
        .eq("id", messageId);

      if (error) throw error;

      toast.success("Odpowiedź wysłana!");
      setReplyText("");
      setReplyingTo(null);
      fetchMessages();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Błąd podczas wysyłania odpowiedzi");
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from("contact_messages")
        .update({ student_read_reply: true })
        .eq("id", messageId);
      
      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, student_read_reply: true } : m)
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const unreadReplies = messages.filter(m => m.admin_reply && !m.student_read_reply).length;

  // Parse all messages chronologically
  const parseAllMessagesChronologically = (msg: ContactMessage) => {
    const allMessages: { content: string; timestamp: string | null; sender: 'student' | 'admin' }[] = [];
    
    // Parse student messages (skip empty messages)
    if (msg.message && msg.message.trim()) {
      msg.message.split('\n---\n').forEach((part) => {
        if (!part.trim()) return;
        const timestampMatch = part.match(/^\[(.+?)\]\s/);
        const timestamp = timestampMatch ? timestampMatch[1] : null;
        const content = timestampMatch ? part.replace(/^\[.+?\]\s/, '') : part;
        if (content.trim()) {
          allMessages.push({ 
            content, 
            timestamp: timestamp || msg.created_at, 
            sender: 'student' 
          });
        }
      });
    }
    
    // Parse admin replies
    if (msg.admin_reply) {
      msg.admin_reply.split('\n---\n').forEach((reply) => {
        if (!reply.trim()) return;
        const timestampMatch = reply.match(/^\[(.+?)\]\s/);
        const timestamp = timestampMatch ? timestampMatch[1] : null;
        const content = timestampMatch ? reply.replace(/^\[.+?\]\s/, '') : reply;
        if (content.trim()) {
          allMessages.push({ 
            content, 
            timestamp: timestamp || msg.replied_at, 
            sender: 'admin' 
          });
        }
      });
    }
    
    // Sort by timestamp (oldest first)
    return allMessages.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateA - dateB;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-soft overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
            {unreadReplies > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              Wiadomości do Anety
              {unreadReplies > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadReplies} nowe
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              {messages.length > 0 ? `${messages.length} wiadomości` : "Napisz do swojej nauczycielki"}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            {loading ? (
              <div className="p-6 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {/* New message form */}
                {showNewForm ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted/30 rounded-2xl p-4 space-y-3"
                  >
                    <Textarea
                      placeholder="Napisz wiadomość do Anety..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="flex-1"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Wyślij
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setShowNewForm(false); setNewMessage(""); }}
                      >
                        Anuluj
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowNewForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nowa wiadomość
                  </Button>
                )}

                {/* Messages list */}
                {messages.length === 0 && !showNewForm ? (
                  <div className="text-center py-6">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Brak wiadomości. Napisz do Anety!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const hasUnreadReply = msg.admin_reply && !msg.student_read_reply;
                    
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`relative rounded-2xl border ${hasUnreadReply ? 'border-red-500/50 bg-red-500/5' : 'border-border bg-muted/20'} p-4 space-y-3`}
                        onClick={() => hasUnreadReply && markAsRead(msg.id)}
                      >
                        {/* Unread indicator */}
                        {hasUnreadReply && (
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                        )}

                        {/* Thread header */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pb-2 border-b border-border/50">
                          <Clock className="w-3 h-3" />
                          Rozpoczęto: {format(new Date(msg.created_at), "d MMM yyyy, HH:mm", { locale: pl })}
                        </div>

                        {/* All messages in thread - chronologically sorted */}
                        <div className="space-y-3">
                          {parseAllMessagesChronologically(msg).map((item, idx) => (
                            item.sender === 'student' ? (
                              <div key={`msg-${idx}`} className="bg-primary/10 rounded-xl p-3 ml-4">
                                <div className="flex items-center gap-2 text-xs text-primary mb-1">
                                  <User className="w-3 h-3" />
                                  Ty {item.timestamp && `• ${format(new Date(item.timestamp), "d MMM, HH:mm", { locale: pl })}`}
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                              </div>
                            ) : (
                              <div key={`msg-${idx}`} className="bg-muted/50 rounded-xl p-3 mr-4">
                                <div className="flex items-center gap-2 text-xs text-primary mb-1">
                                  <Reply className="w-3 h-3" />
                                  Aneta {item.timestamp && `• ${format(new Date(item.timestamp), "d MMM, HH:mm", { locale: pl })}`}
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                              </div>
                            )
                          ))}
                        </div>

                        {/* Reply/Continue form - always available */}
                        {replyingTo === msg.id ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2 pt-2 border-t border-border/50"
                          >
                            <Textarea
                              placeholder="Napisz wiadomość..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="hero"
                                size="sm"
                                onClick={() => handleReplyInThread(msg.id, msg.message)}
                                disabled={sending || !replyText.trim()}
                                className="flex-1"
                              >
                                {sending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Wyślij
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setReplyingTo(null); setReplyText(""); }}
                              >
                                Anuluj
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => setReplyingTo(msg.id)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Dodaj wiadomość
                          </Button>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentMessaging;
