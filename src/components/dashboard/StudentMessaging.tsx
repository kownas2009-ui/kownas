import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Send,
  Loader2,
  Clock,
  Reply,
  Plus,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

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

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchProfile();
    }
  }, [user]);

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
      // Fetch messages sent by this user's email
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
          message: newMessage.trim()
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

  const unreadReplies = messages.filter(m => m.admin_reply && !m.is_read).length;

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              Wiadomości do Anety
              {unreadReplies > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
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
              <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
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
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      {/* Student's message */}
                      <div className="bg-primary/10 rounded-2xl p-4 ml-8">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Clock className="w-3 h-3" />
                          {format(new Date(msg.created_at), "d MMM yyyy, HH:mm", { locale: pl })}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>

                      {/* Admin replies - parse multiple replies */}
                      {msg.admin_reply && msg.admin_reply.split('\n---\n').map((reply, index) => {
                        // Parse timestamp from reply format: [timestamp] message
                        const timestampMatch = reply.match(/^\[(.+?)\]\s/);
                        const timestamp = timestampMatch ? timestampMatch[1] : null;
                        const messageContent = timestampMatch ? reply.replace(/^\[.+?\]\s/, '') : reply;
                        
                        return (
                          <div key={index} className="bg-muted/50 rounded-2xl p-4 mr-8">
                            <div className="flex items-center gap-2 text-xs text-primary mb-2">
                              <Reply className="w-3 h-3" />
                              Odpowiedź od Anety {timestamp && `• ${format(new Date(timestamp), "d MMM, HH:mm", { locale: pl })}`}
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{messageContent}</p>
                          </div>
                        );
                      })}
                    </motion.div>
                  ))
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
