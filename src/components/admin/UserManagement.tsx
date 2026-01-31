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
  Mail,
  Pencil,
  Save,
  X,
  FileText,
  Ban,
  ShieldOff
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
import SendNoteDialog from "./SendNoteDialog";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  email?: string;
  created_at: string;
  updated_at: string;
  lesson_count: number;
  is_admin?: boolean;
  is_verified?: boolean;
  is_banned?: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [banningId, setBanningId] = useState<string | null>(null);
  const [editingPhone, setEditingPhone] = useState<string | null>(null);
  const [editPhoneValue, setEditPhoneValue] = useState("");

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

      // Fetch email verification status from edge function
      let verificationStatus: Record<string, { email: string; is_verified: boolean }> = {};
      try {
        const { data: verificationData, error: verificationError } = await supabase.functions.invoke(
          "get-users-verification-status"
        );
        
        if (!verificationError && verificationData?.users) {
          verificationStatus = verificationData.users;
        }
      } catch (e) {
        console.error("Error fetching verification status:", e);
      }

      // Fetch banned users
      const { data: bannedUsers, error: bannedError } = await supabase
        .from("banned_users")
        .select("user_id");
      
      if (bannedError) console.error("Error fetching banned users:", bannedError);
      const bannedUserIds = new Set(bannedUsers?.map(b => b.user_id) || []);

      // Combine data
      const usersWithCounts = (profiles || []).map(p => {
        const isAdminAccount = adminUserIds.has(p.user_id);
        const userVerification = verificationStatus[p.user_id];
        
        return {
          ...p,
          email: userVerification?.email || "",
          lesson_count: lessonCounts[p.user_id] || 0,
          is_admin: isAdminAccount,
          // Use actual email verification status
          is_verified: isAdminAccount || (userVerification?.is_verified ?? false),
          is_banned: bannedUserIds.has(p.user_id)
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
      // Call edge function to delete user from auth.users (this cascades to all related data)
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      if (!token) {
        throw new Error("No auth session");
      }

      const response = await supabase.functions.invoke("delete-user", {
        body: { userId },
      });

      if (response.error) {
        console.error("Edge function error:", response.error);
        throw new Error(response.error.message || "Failed to delete user");
      }

      // Also clean up related tables (in case cascade didn't work)
      await supabase.from("bookings").delete().eq("user_id", userId);
      await supabase.from("student_notes").delete().eq("student_user_id", userId);
      await supabase.from("user_roles").delete().eq("user_id", userId);
      await supabase.from("profiles").delete().eq("user_id", userId);

      toast.success("Konto użytkownika zostało usunięte");
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Błąd podczas usuwania konta");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBanUser = async (userId: string, userName: string) => {
    setBanningId(userId);
    try {
      const { error } = await supabase
        .from("banned_users")
        .insert({ user_id: userId });

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(u => 
        u.user_id === userId ? { ...u, is_banned: true } : u
      ));
      
      toast.success(`Użytkownik ${userName} został zbanowany`);
    } catch (error: any) {
      console.error("Error banning user:", error);
      toast.error(error.message || "Błąd podczas banowania użytkownika");
    } finally {
      setBanningId(null);
    }
  };

  const handleUnbanUser = async (userId: string, userName: string) => {
    setBanningId(userId);
    try {
      const { error } = await supabase
        .from("banned_users")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(u => 
        u.user_id === userId ? { ...u, is_banned: false } : u
      ));
      
      toast.success(`Użytkownik ${userName} został odbanowany`);
    } catch (error: any) {
      console.error("Error unbanning user:", error);
      toast.error(error.message || "Błąd podczas odbanowywania użytkownika");
    } finally {
      setBanningId(null);
    }
  };

  const handleUpdatePhone = async (userId: string) => {
    try {
      // Normalize phone number - strip non-digits
      let cleanedPhone = editPhoneValue.replace(/\D/g, '');
      
      // Remove leading 48 if present (user might paste full number)
      if (cleanedPhone.startsWith('48') && cleanedPhone.length > 9) {
        cleanedPhone = cleanedPhone.substring(2);
      }
      
      // Format with +48 prefix
      const formattedPhone = cleanedPhone ? `+48${cleanedPhone}` : null;
      
      const { error } = await supabase
        .from("profiles")
        .update({ phone: formattedPhone })
        .eq("user_id", userId);

      if (error) throw error;
      
      // Update local state immediately
      setUsers(prev => prev.map(u => 
        u.user_id === userId ? { ...u, phone: formattedPhone } : u
      ));
      
      toast.success("Numer telefonu zaktualizowany");
      setEditingPhone(null);
      setEditPhoneValue("");
    } catch (error) {
      console.error("Error updating phone:", error);
      toast.error("Błąd podczas aktualizacji telefonu");
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
      className={`p-5 hover:bg-muted/30 transition-colors ${user.is_banned ? 'bg-red-500/5' : ''}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center relative">
            <GraduationCap className="w-6 h-6 text-primary" />
            {user.is_banned ? (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                <Ban className="w-3 h-3 text-white" />
              </div>
            ) : user.is_verified ? (
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
              <h3 className={`font-display font-semibold ${user.is_banned ? 'text-red-600' : 'text-foreground'}`}>
                {user.full_name || "Brak nazwy"}
              </h3>
              {user.is_banned && (
                <Badge variant="destructive" className="text-xs">
                  <Ban className="w-3 h-3 mr-1" />
                  Zbanowany
                </Badge>
              )}
              {!user.is_verified && !user.is_banned && (
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">
                  <Mail className="w-3 h-3 mr-1" />
                  Oczekuje na weryfikację
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {user.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </span>
              )}
              {editingPhone === user.id ? (
                <form 
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdatePhone(user.user_id);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1.5 rounded-l-md border border-r-0 border-input">+48</span>
                    <Input
                      value={editPhoneValue}
                      onChange={(e) => {
                        // Only allow digits and spaces
                        const value = e.target.value.replace(/[^\d\s]/g, '');
                        setEditPhoneValue(value);
                      }}
                      placeholder="XXX XXX XXX"
                      className="h-7 w-28 text-xs rounded-l-none"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" size="icon" variant="ghost" className="h-6 w-6">
                    <Save className="w-3 h-3 text-green-600" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditingPhone(null)}>
                    <X className="w-3 h-3" />
                  </Button>
                </form>
              ) : (
                <span 
                  className="flex items-center gap-1 cursor-pointer hover:text-primary"
                  onClick={() => { 
                    setEditingPhone(user.id); 
                    // Strip +48 prefix for editing
                    const phoneValue = user.phone?.replace(/^\+?48\s?/, '') || '';
                    setEditPhoneValue(phoneValue); 
                  }}
                >
                  <Phone className="w-3 h-3" />
                  {user.phone || "Brak telefonu"}
                  <Pencil className="w-3 h-3 ml-1 opacity-50" />
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
          
          {!user.is_admin && (
            <SendNoteDialog
              studentUserId={user.user_id}
              studentName={user.full_name || "Uczeń"}
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Notatka</span>
              </Button>
            </SendNoteDialog>
          )}
          
          {user.is_admin ? (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              Admin
            </span>
          ) : (
            <>
              {/* Ban/Unban button */}
              {user.is_banned ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600/30 hover:bg-green-600/10"
                      disabled={banningId === user.user_id}
                    >
                      {banningId === user.user_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShieldOff className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display flex items-center gap-2">
                        <ShieldOff className="w-5 h-5 text-green-600" />
                        Odbanować użytkownika?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-body">
                        Czy na pewno chcesz odbanować użytkownika{" "}
                        <strong>{user.full_name}</strong>?
                        <br /><br />
                        Użytkownik będzie mógł ponownie korzystać z serwisu.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anuluj</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleUnbanUser(user.user_id, user.full_name)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Odbanuj
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-600/30 hover:bg-orange-600/10"
                      disabled={banningId === user.user_id}
                    >
                      {banningId === user.user_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Ban className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display flex items-center gap-2">
                        <Ban className="w-5 h-5 text-orange-600" />
                        Zbanować użytkownika?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-body">
                        Czy na pewno chcesz zbanować użytkownika{" "}
                        <strong>{user.full_name}</strong>?
                        <br /><br />
                        Zbanowany użytkownik nie będzie mógł się zalogować ani korzystać z serwisu.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anuluj</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleBanUser(user.user_id, user.full_name)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Zbanuj
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              {/* Delete button */}
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
            </>
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