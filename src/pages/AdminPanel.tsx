import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  LogOut, 
  Calendar, 
  Users, 
  Clock, 
  Atom,
  Check,
  X,
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  lesson_type: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    phone: string | null;
  };
}

interface Stats {
  totalStudents: number;
  pendingBookings: number;
  confirmedBookings: number;
  thisWeekBookings: number;
}

const AdminPanel = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    thisWeekBookings: 0
  });
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate("/");
        return;
      }
      if (!isAdmin) {
        toast.error("Brak dostępu do panelu administratora");
        navigate("/panel");
        return;
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Fetch all bookings with profiles
      const { data: bookingsData, error: bookingsError } = await (supabase as any)
        .from("bookings")
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone
          )
        `)
        .order("booking_date", { ascending: true });

      if (bookingsError) throw bookingsError;

      // Fetch stats
      const { count: studentsCount } = await (supabase as any)
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const today = new Date();
      const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const pendingCount = bookingsData?.filter((b: Booking) => b.status === "pending").length || 0;
      const confirmedCount = bookingsData?.filter((b: Booking) => b.status === "confirmed").length || 0;
      const thisWeekCount = bookingsData?.filter((b: Booking) => {
        const date = new Date(b.booking_date);
        return date >= today && date <= weekLater;
      }).length || 0;

      setBookings(bookingsData || []);
      setStats({
        totalStudents: studentsCount || 0,
        pendingBookings: pendingCount,
        confirmedBookings: confirmedCount,
        thisWeekBookings: thisWeekCount
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Błąd podczas ładowania danych");
    } finally {
      setLoadingData(false);
    }
  };

  const updateBookingStatus = async (id: string, status: "confirmed" | "cancelled") => {
    try {
      const { error } = await (supabase as any)
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast.success(status === "confirmed" ? "Lekcja potwierdzona!" : "Lekcja anulowana");
      fetchData();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Błąd podczas aktualizacji");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || roleLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredBookings = bookings.filter(b => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const upcomingBookings = filteredBookings.filter(
    b => new Date(b.booking_date) >= new Date()
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Strona główna
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Atom className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Panel Administratora
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Wyloguj
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Uczniów", value: stats.totalStudents, color: "bg-primary/10 text-primary" },
            { icon: Clock, label: "Oczekujących", value: stats.pendingBookings, color: "bg-amber-100 text-amber-700" },
            { icon: CheckCircle, label: "Potwierdzonych", value: stats.confirmedBookings, color: "bg-green-100 text-green-700" },
            { icon: Calendar, label: "Ten tydzień", value: stats.thisWeekBookings, color: "bg-secondary/20 text-secondary-foreground" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-body">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "all", label: "Wszystkie" },
            { id: "pending", label: "Oczekujące" },
            { id: "confirmed", label: "Potwierdzone" }
          ].map((f) => (
            <Button
              key={f.id}
              variant={filter === f.id ? "hero" : "outline"}
              size="sm"
              onClick={() => setFilter(f.id as typeof filter)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Nadchodzące rezerwacje ({upcomingBookings.length})
            </h2>
          </div>

          {loadingData ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Brak rezerwacji</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {upcomingBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold">
                          {booking.profiles?.full_name || "Uczeń"}
                        </h3>
                        <p className="text-sm text-muted-foreground font-body">
                          {booking.lesson_type} • {booking.profiles?.phone || "Brak telefonu"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">
                          {format(new Date(booking.booking_date), "d MMMM yyyy", { locale: pl })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          godz. {booking.booking_time}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => updateBookingStatus(booking.id, "confirmed")}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {booking.status === "confirmed" 
                              ? "Potwierdzona" 
                              : booking.status === "cancelled"
                              ? "Anulowana"
                              : "Oczekuje"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminPanel;
