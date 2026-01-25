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
  GraduationCap,
  Loader2,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock as ClockIcon,
  Mail
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
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  email?: string;
  created_at: string;
  lesson_count: number;
  is_admin?: boolean;
  is_verified?: boolean;
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

      // Fetch admin roles to exclude from deletion
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (rolesError) throw rolesError;

      const adminUserIds = new Set(adminRoles?.map(r => r.user_id) || []);

      // Count lessons per user
      const lessonCounts: Record<string, number> = {};
      bookings?.forEach(b => {
        lessonCounts[b.user_id] = (lessonCounts[b.user_id] || 0) + 1;
      });

      // Get auth users' verification status using edge function or check from session
      // Since we can't access auth.users directly, we'll use a workaround
      // We check if user has email_confirmed_at through profiles timestamps
      // Users who verified their email will have updated_at different from created_at
      // More reliable: check if user has any successful bookings (means they logged in = verified)
      
      // Combine data - mark as verified if they have bookings OR their updated_at differs from created_at
      const usersWithCounts = (profiles || []).map(p => {
        const hasBookings = (lessonCounts[p.user_id] || 0) > 0;
        const profileUpdated = new Date(p.updated_at).getTime() !== new Date(p.created_at).getTime();
        
        return {
          ...p,
          lesson_count: lessonCounts[p.user_id] || 0,
          is_admin: adminUserIds.has(p.user_id),
          // Consider verified if they have bookings or profile was updated (which means they logged in)
          is_verified: hasBookings || profileUpdated
        };
      });

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

  // Separate verified and unverified users
  const verifiedUsers = filteredUsers.filter(u => u.is_verified);
  const unverifiedUsers = filteredUsers.filter(u => !u.is_verified);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const UserCard = ({ user, index }: { user: UserProfile; index: number }) => (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      className="p-5 hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center relative">
            <GraduationCap className="w-6 h-6 text-primary" />
            {user.is_verified ? (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                <ClockIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-foreground">
                {user.full_name || "Brak nazwy"}
              </h3>
              {!user.is_verified && (
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">
                  <Mail className="w-3 h-3 mr-1" />
                  Oczekuje na weryfikację
                </Badge>
              )}
            </div>
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
          
          {user.is_admin ? (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              Admin
            </span>
          ) : (
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
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Unverified users section */}
      {unverifiedUsers.length > 0 && (
        <div className="bg-amber-500/5 backdrop-blur-sm rounded-3xl border border-amber-500/20 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-amber-500/20 bg-amber-500/10">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <ClockIcon className="w-5 h-5" />
              Oczekujące na weryfikację email ({unverifiedUsers.length})
            </h2>
            <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">
              Te konta nie zostały jeszcze zweryfikowane przez użytkownika
            </p>
          </div>
          <div className="divide-y divide-amber-500/10">
            <AnimatePresence>
              {unverifiedUsers.map((user, i) => (
                <UserCard key={user.id} user={user} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Verified users section */}
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Zweryfikowane konta ({verifiedUsers.length})
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
            {verifiedUsers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center"
              >
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "Nie znaleziono użytkowników" : "Brak zweryfikowanych użytkowników"}
                </p>
              </motion.div>
            ) : (
              verifiedUsers.map((user, i) => (
                <UserCard key={user.id} user={user} index={i} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;