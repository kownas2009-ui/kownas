import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Loader2,
  User,
  Clock,
  Paperclip,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp
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

interface StudentNote {
  id: string;
  title: string;
  body: string;
  file_url: string | null;
  created_at: string;
  student_user_id: string;
  profiles?: {
    full_name: string;
  };
}

const SentNotesTab = () => {
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNotes();

    // Realtime subscription
    const channel = supabase
      .channel('admin-notes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_notes'
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("student_notes")
        .select(`
          *,
          profiles!student_notes_student_user_id_fkey (
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Błąd podczas ładowania notatek");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from("student_notes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Notatka usunięta");
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Błąd podczas usuwania notatki");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Wysłane notatki
            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              {notes.length}
            </span>
          </h2>
        </div>

        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {notes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center"
              >
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Brak wysłanych notatek</p>
              </motion.div>
            ) : (
              notes.map((note, i) => {
                const isExpanded = expandedNotes.has(note.id);
                
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-foreground">
                            {note.profiles?.full_name || "Uczeń"}
                          </span>
                          {note.file_url && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              <Paperclip className="w-3 h-3" />
                              Załącznik
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-medium text-foreground mb-1">{note.title}</h3>
                        
                        <div className={`text-sm text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {note.body}
                        </div>
                        
                        {note.body.length > 150 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-auto py-1 px-2 text-xs"
                            onClick={() => toggleExpand(note.id)}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3 h-3 mr-1" />
                                Zwiń
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                Rozwiń
                              </>
                            )}
                          </Button>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(note.created_at), "d MMM yyyy, HH:mm", { locale: pl })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {note.file_url && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(note.file_url!, '_blank')}
                            title="Pobierz załącznik"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Usunąć notatkę?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Czy na pewno chcesz usunąć notatkę "{note.title}" wysłaną do {note.profiles?.full_name || "ucznia"}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Anuluj</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNote(note.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Usuń
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SentNotesTab;
