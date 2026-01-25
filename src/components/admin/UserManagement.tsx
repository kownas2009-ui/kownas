import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Trash2, 
  Phone, 
  Mail, 
  GraduationCap,
  Loader2,
  AlertTriangle,
  BookOpen
} from "lucide-react";
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
import { toast } from "sonner";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  email?: string;
  created_at: string;
  lesson_count: number;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch booking counts per user
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("user_id")
        .in("status", ["confirmed", "pending"]);

      if (bookingsError) throw bookingsError;

      // Count lessons per user
      const lessonCounts: Record<string, number> = {};
      bookings?.forEach(b => {
        lessonCounts[b.user_id] = (lessonCounts[b.user_id] || 0) + 1;
      });

      // Combine data
      const usersWithCounts = (profiles || []).map(p => ({
        ...p,
        lesson_count: lessonCounts[p.user_id] || 0
      }));

      setUsers(usersWithCounts);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Błąd podczas ładowania użytkowników");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, profileId: string) => {
    setDeletingId(profileId);
    try {
      // Delete all bookings for this user
      const { error: bookingsError } = await supabase
        .from("bookings")
        .delete()
        .eq("user_id", userId);

      if (bookingsError) throw bookingsError;

      // Delete student notes
      const { error: notesError } = await supabase
        .from("student_notes")
        .delete()
        .eq("student_user_id", userId);

      if (notesError) throw notesError;

      // Delete user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (roleError) throw roleError;

      // Delete profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);

      if (profileError) throw profileError;

      toast.success("Konto użytkownika zostało usunięte");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Błąd podczas usuwania konta");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      u => 
        u.full_name.toLowerCase().includes(query) ||
        u.phone?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-soft overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Zarządzanie kontami ({users.length})
          </h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj użytkownika..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        <AnimatePresence>
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "Nie znaleziono użytkowników" : "Brak zarejestrowanych użytkowników"}
              </p>
            </motion.div>
          ) : (
            filteredUsers.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.03 }}
                className="p-5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">
                        {user.full_name || "Brak nazwy"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {user.lesson_count} lekcji
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Dołączył: {new Date(user.created_at).toLocaleDateString("pl-PL")}
                    </span>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          disabled={deletingId === user.id}
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                            Usunąć konto?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-body">
                            Czy na pewno chcesz usunąć konto użytkownika{" "}
                            <strong>{user.full_name}</strong>?
                            <br /><br />
                            Zostaną usunięte wszystkie dane: rezerwacje, notatki i profil.
                            <strong className="text-destructive block mt-2">Tej akcji nie można cofnąć!</strong>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anuluj</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.user_id, user.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Usuń konto
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserManagement;
