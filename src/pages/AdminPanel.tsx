import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
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
  Sparkles,
  ChevronRight,
  Phone,
  GraduationCap,
  Zap,
  FlaskConical,
  Timer,
  CalendarDays,
  ListChecks,
  FileText,
  Send,
  CreditCard,
  Banknote,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import AdminCalendar from "@/components/admin/AdminCalendar";
import StudentPDFGenerator from "@/components/admin/StudentPDFGenerator";
import MonthlyStats from "@/components/admin/MonthlyStats";
import { FloatingFormulas, DNAHelixAdmin, BubblingFlask } from "@/components/admin/AdvancedAnimations";
import SendNoteDialog from "@/components/admin/SendNoteDialog";
import UserManagement from "@/components/admin/UserManagement";
import MessagesTab from "@/components/admin/MessagesTab";
import BlockedDaysManager from "@/components/admin/BlockedDaysManager";

interface Booking {
  id: string;
  lesson_type: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
  user_id: string;
  is_paid: boolean;
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

// Animated molecule background component
const FloatingMolecules = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          rotate: [0, 360],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          delay: i * 0.5,
        }}
      >
        <svg width={30 + Math.random() * 30} height={30 + Math.random() * 30} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="8" className="fill-primary/20" />
          <circle cx="10" cy="15" r="5" className="fill-secondary/20" />
          <circle cx="40" cy="15" r="5" className="fill-secondary/20" />
          <circle cx="25" cy="45" r="5" className="fill-primary/15" />
          <line x1="25" y1="25" x2="10" y2="15" className="stroke-primary/10" strokeWidth="2" />
          <line x1="25" y1="25" x2="40" y2="15" className="stroke-primary/10" strokeWidth="2" />
          <line x1="25" y1="25" x2="25" y2="45" className="stroke-secondary/10" strokeWidth="2" />
        </svg>
      </motion.div>
    ))}
    
    {/* Floating bubbles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={`bubble-${i}`}
        className="absolute rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          bottom: -20,
          width: 8 + Math.random() * 12,
          height: 8 + Math.random() * 12,
          background: i % 2 === 0 
            ? "hsl(var(--primary) / 0.15)" 
            : "hsl(var(--secondary) / 0.15)",
        }}
        animate={{
          y: [0, -window.innerHeight - 100],
          x: [0, Math.sin(i) * 50],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 10 + Math.random() * 5,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

// Next student card with beautiful animations
const NextStudentCard = ({ booking, onClose }: { booking: Booking | null; onClose: () => void }) => {
  if (!booking) return null;

  const lessonDate = new Date(`${booking.booking_date}T${booking.booking_time}`);
  const now = new Date();
  const minutesUntil = differenceInMinutes(lessonDate, now);
  const hoursUntil = differenceInHours(lessonDate, now);
  const daysUntil = differenceInDays(lessonDate, now);

  let timeUntilText = "";
  if (daysUntil > 0) {
    timeUntilText = `za ${daysUntil} ${daysUntil === 1 ? "dzień" : "dni"}`;
  } else if (hoursUntil > 0) {
    timeUntilText = `za ${hoursUntil} ${hoursUntil === 1 ? "godzinę" : "godzin"}`;
  } else if (minutesUntil > 0) {
    timeUntilText = `za ${minutesUntil} minut`;
  } else {
    timeUntilText = "Teraz!";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary/70 p-8 text-primary-foreground shadow-2xl"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: 100 + Math.random() * 100,
              height: 100 + Math.random() * 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
        
        {/* Floating atoms */}
        <motion.div
          className="absolute top-4 right-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Atom className="w-16 h-16 text-white/20" />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <motion.div
              className="flex items-center gap-2 mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider opacity-80">
                Najbliższa lekcja
              </span>
            </motion.div>
            <h3 className="text-3xl font-display font-bold">
              {booking.profiles?.full_name || "Uczeń"}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Data</span>
            </div>
            <p className="font-semibold text-lg">
              {format(new Date(booking.booking_date), "d MMMM", { locale: pl })}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Godzina</span>
            </div>
            <p className="font-semibold text-lg">{booking.booking_time}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <FlaskConical className="w-4 h-4" />
            <span className="text-sm">{booking.lesson_type}</span>
          </div>
          {booking.profiles?.phone && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{booking.profiles.phone}</span>
            </div>
          )}
        </div>

        <motion.div 
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Timer className="w-6 h-6" />
            </motion.div>
            <span className="font-medium">Rozpoczęcie</span>
          </div>
          <span className="text-xl font-bold">{timeUntilText}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Stat card with chemistry animation
const StatCard = ({ icon: Icon, label, value, color, index }: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative p-6 rounded-3xl bg-card border border-border shadow-soft overflow-hidden group"
  >
    {/* Hover glow effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"
    />
    
    {/* Bubbles on hover */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{
            left: `${20 + i * 15}%`,
            bottom: 0,
          }}
          initial={{ y: 0, opacity: 0 }}
          whileHover={{
            y: -40,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>

    <div className="relative z-10">
      <motion.div 
        className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-4`}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-7 h-7" />
      </motion.div>
      <motion.div 
        className="text-4xl font-display font-bold text-foreground mb-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-muted-foreground font-body">{label}</div>
    </div>
  </motion.div>
);

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
  const [showNextStudent, setShowNextStudent] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "calendar" | "users" | "messages">("list");
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);

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
      // Now that FK exists, use proper join
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles (
            full_name,
            phone
          )
        `)
        .order("booking_date", { ascending: true });

      if (bookingsError) throw bookingsError;

      // Count unique students from bookings (excluding cancelled)
      const activeBookings = (bookingsData || []).filter((b) => b.status !== "cancelled");
      const uniqueStudentIds = new Set(activeBookings.map((b) => b.user_id));
      const studentsCount = uniqueStudentIds.size;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const pendingCount = (bookingsData || []).filter((b) => b.status === "pending").length;
      const confirmedCount = (bookingsData || []).filter((b) => b.status === "confirmed").length;
      const thisWeekCount = (bookingsData || []).filter((b) => {
        const date = new Date(b.booking_date);
        return date >= today && date <= weekLater;
      }).length;

      setBookings(bookingsData || []);
      setStats({
        totalStudents: studentsCount,
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
      const { error } = await supabase
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

  const updatePaymentStatus = async (id: string, isPaid: boolean) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ is_paid: isPaid })
        .eq("id", id);

      if (error) throw error;

      toast.success(isPaid ? "Oznaczono jako opłacone!" : "Cofnięto potwierdzenie opłaty");
      fetchData();
      
      // Update selected booking details if open
      if (selectedBookingDetails?.id === id) {
        setSelectedBookingDetails(prev => prev ? { ...prev, is_paid: isPaid } : null);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Błąd podczas aktualizacji płatności");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Get next upcoming booking
  const nextBooking = useMemo(() => {
    const now = new Date();
    return bookings
      .filter(b => new Date(b.booking_date) >= now && b.status !== "cancelled")
      .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())[0] || null;
  }, [bookings]);

  if (authLoading || roleLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Atom className="w-12 h-12 text-primary" />
        </motion.div>
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
    <div className="min-h-screen bg-background relative">
      <FloatingMolecules />
      <FloatingFormulas />
      <DNAHelixAdmin />
      <BubblingFlask />
      
      {/* Header */}
      <motion.header
        className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Strona główna
              </Button>
            </motion.div>
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Atom className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <span className="font-display text-xl font-bold text-foreground block">
                  Panel Administratora
                </span>
                <span className="text-xs text-muted-foreground">Witaj, Aneta! 👋</span>
              </div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Next Student Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <motion.button
            onClick={() => setShowNextStudent(!showNextStudent)}
            className="w-full p-6 rounded-3xl bg-gradient-to-r from-secondary/20 via-primary/10 to-secondary/20 border border-border hover:border-primary/30 transition-all flex items-center justify-between group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-7 h-7 text-secondary" />
              </motion.div>
              <div className="text-left">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Najbliższy uczeń
                </h3>
                <p className="text-sm text-muted-foreground">
                  {nextBooking ? `${nextBooking.profiles?.full_name || "Uczeń"} - ${format(new Date(nextBooking.booking_date), "d MMM", { locale: pl })}` : "Brak nadchodzących lekcji"}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Next Student Card */}
        <AnimatePresence>
          {showNextStudent && nextBooking && (
            <motion.div className="mb-8">
              <NextStudentCard booking={nextBooking} onClose={() => setShowNextStudent(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monthly Statistics */}
        <MonthlyStats bookings={bookings} pricePerLesson={80} />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={Users} 
            label="Uczniów" 
            value={stats.totalStudents} 
            color="bg-primary/10 text-primary" 
            index={0} 
          />
          <StatCard 
            icon={Clock} 
            label="Oczekujących" 
            value={stats.pendingBookings} 
            color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
            index={1} 
          />
          <StatCard 
            icon={CheckCircle} 
            label="Potwierdzonych" 
            value={stats.confirmedBookings} 
            color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
            index={2} 
          />
          <StatCard 
            icon={Calendar} 
            label="Ten tydzień" 
            value={stats.thisWeekBookings} 
            color="bg-secondary/20 text-secondary-foreground" 
            index={3} 
          />
        </div>

        {/* View Toggle + PDF Generator */}
        <motion.div 
          className="flex items-center justify-between mb-6 flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "list" | "calendar" | "users" | "messages")} className="w-auto">
            <TabsList className="bg-card/80 backdrop-blur-sm">
              <TabsTrigger value="list" className="gap-2">
                <ListChecks className="w-4 h-4" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                Kalendarz
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                Konta
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Wiadomości
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <StudentPDFGenerator bookings={bookings} />
            
            {/* Filters */}
            <div className="flex gap-2">
              {[
                { id: "all", label: "Wszystkie", icon: Calendar },
                { id: "pending", label: "Oczekujące", icon: Clock },
                { id: "confirmed", label: "Potwierdzone", icon: CheckCircle }
              ].map((f) => (
                <motion.div key={f.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={filter === f.id ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setFilter(f.id as typeof filter)}
                    className="gap-2"
                  >
                    <f.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{f.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Selected Booking Details Modal */}
        <AnimatePresence>
          {selectedBookingDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedBookingDetails(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-2xl font-bold">Szczegóły lekcji</h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedBookingDetails(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center">
                      <GraduationCap className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedBookingDetails.profiles?.full_name || "Uczeń"}</p>
                      {selectedBookingDetails.profiles?.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedBookingDetails.profiles.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Data</p>
                      <p className="font-semibold">
                        {format(new Date(selectedBookingDetails.booking_date), "d MMMM yyyy", { locale: pl })}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Godzina</p>
                      <p className="font-semibold">{selectedBookingDetails.booking_time}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Typ lekcji</p>
                      <p className="font-semibold">{selectedBookingDetails.lesson_type}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <p className={`font-semibold ${
                        selectedBookingDetails.status === "confirmed" ? "text-green-600" :
                        selectedBookingDetails.status === "cancelled" ? "text-red-600" : "text-amber-600"
                      }`}>
                        {selectedBookingDetails.status === "confirmed" ? "Potwierdzona" :
                         selectedBookingDetails.status === "cancelled" ? "Anulowana" : "Oczekująca"}
                      </p>
                    </div>
                  </div>

                  {/* Payment status */}
                  <div className={`p-4 rounded-xl flex items-center justify-between ${
                    selectedBookingDetails.is_paid 
                      ? "bg-green-500/10 border border-green-500/30" 
                      : "bg-amber-500/10 border border-amber-500/30"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedBookingDetails.is_paid ? "bg-green-500/20" : "bg-amber-500/20"
                      }`}>
                        <Banknote className={`w-5 h-5 ${
                          selectedBookingDetails.is_paid ? "text-green-600" : "text-amber-600"
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {selectedBookingDetails.is_paid ? "Opłacone" : "Nieopłacone"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Status płatności za lekcję
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={selectedBookingDetails.is_paid ? "outline" : "default"}
                      size="sm"
                      onClick={() => updatePaymentStatus(selectedBookingDetails.id, !selectedBookingDetails.is_paid)}
                      className={selectedBookingDetails.is_paid 
                        ? "text-amber-600 border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" 
                        : "bg-green-600 hover:bg-green-700"
                      }
                    >
                      {selectedBookingDetails.is_paid ? (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Cofnij
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Potwierdź opłatę
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {selectedBookingDetails.status === "pending" && (
                      <>
                        <Button
                          className="flex-1 gap-2"
                          onClick={() => {
                            updateBookingStatus(selectedBookingDetails.id, "confirmed");
                            setSelectedBookingDetails(null);
                          }}
                        >
                          <Check className="w-4 h-4" />
                          Potwierdź
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 gap-2 text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => {
                            updateBookingStatus(selectedBookingDetails.id, "cancelled");
                            setSelectedBookingDetails(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                          Anuluj
                        </Button>
                      </>
                    )}
                    {/* Send note button */}
                    <SendNoteDialog
                      studentUserId={selectedBookingDetails.user_id}
                      studentName={selectedBookingDetails.profiles?.full_name || "Uczeń"}
                    >
                      <Button variant="outline" className="flex-1 gap-2">
                        <Send className="w-4 h-4" />
                        Wyślij notatkę
                      </Button>
                    </SendNoteDialog>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "messages" ? (
            <motion.div
              key="messages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <MessagesTab />
            </motion.div>
          ) : activeTab === "users" ? (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <BlockedDaysManager />
              <UserManagement />
            </motion.div>
          ) : activeTab === "calendar" ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminCalendar 
                bookings={filteredBookings} 
                onSelectBooking={(booking) => setSelectedBookingDetails(booking)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-soft overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <FlaskConical className="w-5 h-5 text-primary" />
                  </motion.div>
                  Nadchodzące lekcje ({upcomingBookings.length})
                </h2>
              </div>

              {loadingData ? (
                <div className="flex justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Atom className="w-10 h-10 text-primary" />
                  </motion.div>
                </div>
              ) : upcomingBookings.length === 0 ? (
                <motion.div 
                  className="p-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  </motion.div>
                  <p className="text-muted-foreground text-lg">Brak zaplanowanych lekcji</p>
                </motion.div>
              ) : (
                <div className="divide-y divide-border">
                  {upcomingBookings.map((booking, i) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                      className="p-5 transition-colors cursor-pointer"
                      onClick={() => setSelectedBookingDetails(booking)}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center"
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <GraduationCap className="w-7 h-7 text-primary" />
                          </motion.div>
                          <div>
                            <h3 className="font-display font-semibold text-lg">
                              {booking.profiles?.full_name || "Uczeń"}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground font-body">
                              <span className="flex items-center gap-1">
                                <FlaskConical className="w-3 h-3" />
                                {booking.lesson_type}
                              </span>
                              {booking.profiles?.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {booking.profiles.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Payment indicator */}
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              booking.is_paid 
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePaymentStatus(booking.id, !booking.is_paid);
                            }}
                          >
                            <Banknote className="w-3 h-3" />
                            {booking.is_paid ? "Opłacone" : "Nieopłacone"}
                          </motion.div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {format(new Date(booking.booking_date), "d MMMM yyyy", { locale: pl })}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                              <Clock className="w-3 h-3" />
                              {booking.booking_time}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {booking.status === "pending" ? (
                              <>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateBookingStatus(booking.id, "confirmed");
                                    }}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateBookingStatus(booking.id, "cancelled");
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </>
                            ) : (
                              <motion.span 
                                className={`px-4 py-2 rounded-full text-xs font-semibold ${
                                  booking.status === "confirmed"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {booking.status === "confirmed" 
                                  ? "✓ Potwierdzona" 
                                  : booking.status === "cancelled"
                                  ? "✗ Anulowana"
                                  : "Oczekuje"}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPanel;
