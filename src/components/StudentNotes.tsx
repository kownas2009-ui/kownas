import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Calendar, Loader2, Sparkles, Download, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface StudentNote {
  id: string;
  title: string;
  body: string;
  created_at: string;
  file_url?: string | null;
}

const StudentNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotes();
      
      // Set up real-time subscription for notes
      const channel = supabase
        .channel('student-notes-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'student_notes',
            filter: `student_user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Note change detected:', payload.eventType);
            fetchNotes(); // Refresh notes on any change
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("student_notes")
        .select("id, title, body, created_at, file_url")
        .eq("student_user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFileName = (url: string) => {
    try {
      const parts = url.split('/');
      const fileName = parts[parts.length - 1];
      // Remove timestamp prefix if present
      const match = fileName.match(/^\d+\.(.+)$/);
      return match ? match[1] : fileName;
    } catch {
      return "plik";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">
            Notatki od Pani Anety
          </h2>
          <p className="text-sm text-muted-foreground">
            Wiadomości i materiały do nauki
          </p>
        </div>
      </div>

      {notes.length === 0 ? (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Brak notatek</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {note.title}
                      </h3>
                      {note.file_url && (
                        <Paperclip className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(note.created_at), "d MMMM yyyy, HH:mm", { locale: pl })}
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedNote === note.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border space-y-4">
                        <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                          {note.body}
                        </p>
                        
                        {note.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(note.file_url!, '_blank');
                            }}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Pobierz: {getFileName(note.file_url)}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default StudentNotes;
