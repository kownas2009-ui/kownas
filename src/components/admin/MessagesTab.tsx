import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  User,
  Loader2,
  Send,
  Check,
  Trash2,
  Clock,
  Reply
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const MessagesTab = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Błąd podczas ładowania wiadomości");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleSelectMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText(""); // Always start with empty input for new reply
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setReplying(true);
    try {
      // Append new reply to existing replies (chat format)
      const timestamp = new Date().toISOString();
      const newReplyEntry = `[${timestamp}] ${replyText.trim()}`;
      
      // If there are existing replies, append with separator
      const existingReplies = selectedMessage.admin_reply || "";
      const updatedReply = existingReplies 
        ? `${existingReplies}\n---\n${newReplyEntry}`
        : newReplyEntry;

      const { error } = await supabase
        .from("contact_messages")
        .update({ 
          admin_reply: updatedReply,
          replied_at: timestamp
        })
        .eq("id", selectedMessage.id);

      if (error) throw error;

      toast.success("Odpowiedź wysłana!");
      setMessages(prev => prev.map(m => 
        m.id === selectedMessage.id 
          ? { ...m, admin_reply: updatedReply, replied_at: timestamp }
          : m
      ));
      setSelectedMessage(prev => prev ? { ...prev, admin_reply: updatedReply, replied_at: timestamp } : null);
      setReplyText(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Błąd podczas wysyłania odpowiedzi");
    } finally {
      setReplying(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Wiadomość usunięta");
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Błąd podczas usuwania wiadomości");
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Messages List */}
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Wiadomości od uczniów
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {unreadCount} nowe
              </span>
            )}
          </h2>
        </div>

        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center"
              >
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Brak wiadomości</p>
              </motion.div>
            ) : (
              messages.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id ? "bg-primary/10" : "hover:bg-muted/30"
                  } ${!message.is_read ? "bg-primary/5" : ""}`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold truncate ${!message.is_read ? "text-primary" : "text-foreground"}`}>
                          {message.sender_name}
                        </h3>
                        {!message.is_read && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                        {message.admin_reply && (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(message.created_at), "d MMM yyyy, HH:mm", { locale: pl })}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Usunąć wiadomość?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Czy na pewno chcesz usunąć tę wiadomość od {message.sender_name}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anuluj</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMessage(message.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Usuń
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Message Detail & Reply */}
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-soft overflow-hidden">
        {selectedMessage ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-border">
              <h3 className="font-display text-xl font-semibold mb-4">
                {selectedMessage.sender_name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${selectedMessage.sender_email}`} className="hover:text-primary">
                    {selectedMessage.sender_email}
                  </a>
                </div>
                {selectedMessage.sender_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${selectedMessage.sender_phone}`} className="hover:text-primary">
                      {selectedMessage.sender_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Original message */}
              <div className="bg-muted/30 rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-2">
                  {format(new Date(selectedMessage.created_at), "d MMMM yyyy, HH:mm", { locale: pl })}
                </p>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Admin replies - parse multiple replies */}
              {selectedMessage.admin_reply && selectedMessage.admin_reply.split('\n---\n').map((reply, index) => {
                // Parse timestamp from reply format: [timestamp] message
                const timestampMatch = reply.match(/^\[(.+?)\]\s/);
                const timestamp = timestampMatch ? timestampMatch[1] : null;
                const messageContent = timestampMatch ? reply.replace(/^\[.+?\]\s/, '') : reply;
                
                return (
                  <div key={index} className="bg-primary/10 rounded-2xl p-4 ml-8">
                    <p className="text-xs text-primary mb-2 flex items-center gap-1">
                      <Reply className="w-3 h-3" />
                      Twoja odpowiedź {timestamp && `• ${format(new Date(timestamp), "d MMM, HH:mm", { locale: pl })}`}
                    </p>
                    <p className="whitespace-pre-wrap">{messageContent}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply input */}
            <div className="p-6 border-t border-border">
              <Textarea
                placeholder="Napisz odpowiedź..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[100px] mb-3"
              />
              <div className="flex gap-2">
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleSendReply}
                  disabled={replying || !replyText.trim()}
                >
                  {replying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Wyślij odpowiedź
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedMessage.sender_email}?subject=Re: Wiadomość od ${selectedMessage.sender_name}&body=${encodeURIComponent(`\n\n---\nW odpowiedzi na:\n${selectedMessage.message}`)}`)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Wyślij email
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-12">
            <div className="text-center text-muted-foreground">
              <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Wybierz wiadomość z listy</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesTab;
