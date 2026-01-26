import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  LogOut, 
  Calendar, 
  Clock, 
  Atom,
  BookOpen,
  Loader2,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Timer,
  FlaskConical,
  Beaker,
  XCircle,
  AlertTriangle
} from "lucide-react";
import BookingDialog from "@/components/BookingDialog";
import StudentNotes from "@/components/StudentNotes";
import StudentMessaging from "@/components/dashboard/StudentMessaging";
import ThemeToggle from "@/components/ThemeToggle";
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

interface Booking {
  id: string;
  lesson_type: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
}

interface Profile {
  full_name: string;
  phone: string | null;
}

// Floating molecules background
const FloatingMolecules = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, Math.random() * 15 - 7, 0],
          rotate: [0, 360],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          delay: i * 0.5,
        }}
      >
        <svg width={25 + Math.random() * 20} height={25 + Math.random() * 20} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="6" className="fill-primary/15" />
          <circle cx="12" cy="18" r="4" className="fill-secondary/15" />
          <circle cx="38" cy="18" r="4" className="fill-secondary/15" />
          <line x1="25" y1="25" x2="12" y2="18" className="stroke-primary/10" strokeWidth="2" />
          <line x1="25" y1="25" x2="38" y2="18" className="stroke-primary/10" strokeWidth="2" />
        </svg>
      </motion.div>
    ))}
    
    {/* Glowing orbs */}
    <motion.div 
      className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.35, 0.2]
      }}
      transition={{ duration: 6, repeat: Infinity }}
    />
    <motion.div 
      className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"
      animate={{ 
        scale: [1, 1.15, 1],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{ duration: 8, repeat: Infinity, delay: 2 }}
    />
  </div>
);

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
      
      // Set up real-time subscription for bookings
      const bookingsChannel = supabase
        .channel('student-bookings-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Booking change detected:', payload.eventType);
            fetchData(); // Refresh data on any change
          }
        )
        .subscribe();

      // Set up real-time subscription for profile changes
      const profileChannel = supabase
        .channel('student-profile-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Profile change detected:', payload.eventType);
            fetchData();
          }
        )
        .subscribe();

      // Auto-refresh every 2 minutes as fallback
      const refreshInterval = setInterval(() => {
        fetchData();
      }, 120000);

      return () => {
        supabase.removeChannel(bookingsChannel);
        supabase.removeChannel(profileChannel);
        clearInterval(refreshInterval);
      };
    }
  }, [user]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user!.id)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData as Profile);
      }

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user!.id)
        .order("booking_date", { ascending: true });
      
      if (bookingsData) {
        setBookings(bookingsData as Booking[]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);
      
      if (error) throw error;
      
      toast.success("Rezerwacja anulowana", {
        description: "Lekcja została pomyślnie anulowana."
      });
      
      fetchData();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Błąd", {
        description: "Nie udało się anulować rezerwacji. Spróbuj ponownie."
      });
    }
  };

  if (loading || !user) {
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

  // Filter bookings: 
  // - Upcoming: future bookings that are not cancelled
  // - Past: completed bookings (max 7 days old), cancelled bookings (max 10 days old)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.booking_date) >= now && b.status !== 'cancelled'
  );
  
  // Past bookings filtering:
  // - Completed (confirmed/pending): show up to 7 days after lesson
  // - Cancelled: show up to 10 days after lesson date (for tracking late cancellation fees)
  const pastBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.booking_date);
    const isInPast = bookingDate < now;
    
    if (!isInPast) return false;
    
    if (b.status === 'cancelled') {
      // Cancelled bookings: keep for 10 days
      return bookingDate >= tenDaysAgo;
    }
    
    // Completed bookings: keep for 7 days
    return bookingDate >= sevenDaysAgo;
  });

  const nextLesson = upcomingBookings[0];
  const daysUntilNext = nextLesson 
    ? differenceInDays(new Date(nextLesson.booking_date), new Date()) 
    : null;

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingMolecules />
      
      {/* Header */}
      <motion.header 
        className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Strona główna</span>
              </Button>
            </motion.div>
            <motion.a 
              href="/" 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Atom className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="font-display text-xl font-bold text-foreground hidden sm:block">Aneta</span>
            </motion.a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-muted-foreground font-body text-sm hidden md:block">
              {user.email}
            </span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Wyloguj</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-secondary" />
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Cześć, {profile?.full_name?.split(' ')[0] || "Uczniu"}! 👋
            </h1>
          </div>
          <p className="text-muted-foreground font-body text-lg">
            Zarządzaj swoimi lekcjami z chemii i fizyki
          </p>
        </motion.div>

        {loadingData ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Atom className="w-10 h-10 text-primary" />
            </motion.div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className="p-4 md:p-6 rounded-2xl bg-card border border-border shadow-soft"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-hero flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                </div>
                <p className="text-2xl md:text-3xl font-display font-bold text-foreground">{upcomingBookings.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Nadchodzące</p>
              </motion.div>
              
              <motion.div 
                className="p-4 md:p-6 rounded-2xl bg-card border border-border shadow-soft"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-secondary-foreground" />
                </div>
                <p className="text-2xl md:text-3xl font-display font-bold text-foreground">{pastBookings.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Ukończone</p>
              </motion.div>
              
              <motion.div 
                className="p-4 md:p-6 rounded-2xl bg-card border border-border shadow-soft"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-3">
                  <Timer className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {daysUntilNext !== null ? (daysUntilNext === 0 ? "Dziś!" : `${daysUntilNext} dni`) : "-"}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Do następnej</p>
              </motion.div>
              
              <motion.div 
                className="p-4 md:p-6 rounded-2xl bg-card border border-border shadow-soft"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-3">
                  <FlaskConical className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-display font-bold text-foreground">{bookings.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Łącznie lekcji</p>
              </motion.div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left column - Book + Notes */}
              <div className="lg:col-span-1 space-y-6">
                {/* Book New Lesson */}
                <motion.div 
                  className="p-6 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary/70 text-primary-foreground shadow-xl relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                          width: 60 + Math.random() * 60,
                          height: 60 + Math.random() * 60,
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
                  </div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Beaker className="w-7 h-7 text-white" />
                    </motion.div>
                    <h2 className="font-display text-2xl font-bold mb-2">
                      Umów nową lekcję
                    </h2>
                    <p className="text-white/80 font-body text-sm mb-5">
                      Wybierz termin na najbliższy weekend
                    </p>
                    <BookingDialog lessonType="Lekcja" onSuccess={fetchData}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="accent" size="lg" className="w-full font-semibold">
                          <Calendar className="w-5 h-5 mr-2" />
                          Zarezerwuj termin
                        </Button>
                      </motion.div>
                    </BookingDialog>
                  </div>
                </motion.div>

                {/* Notes from Aneta */}
                <StudentNotes />
                
                {/* Messaging with Aneta */}
                <StudentMessaging />
              </div>

              {/* Upcoming Lessons */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Nadchodzące lekcje
                </h2>
                
                <AnimatePresence mode="popLayout">
                  {upcomingBookings.length === 0 ? (
                    <motion.div 
                      className="p-8 rounded-3xl bg-card border border-border text-center shadow-soft"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      </motion.div>
                      <p className="text-muted-foreground font-body text-lg">
                        Brak zaplanowanych lekcji
                      </p>
                      <p className="text-muted-foreground/70 font-body text-sm mt-2">
                        Zarezerwuj swoją pierwszą lekcję!
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking, index) => {
                        const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
                        const hoursUntil = differenceInHours(bookingDateTime, new Date());
                        const canCancel = hoursUntil >= 24;
                        
                        return (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            className="p-5 rounded-2xl bg-card border border-border shadow-soft group"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <motion.div 
                                  className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"
                                  whileHover={{ rotate: 10 }}
                                >
                                  <BookOpen className="w-7 h-7 text-primary" />
                                </motion.div>
                                <div>
                                  <h3 className="font-display font-semibold text-lg text-foreground">
                                    {booking.lesson_type}
                                  </h3>
                                  <p className="text-sm text-muted-foreground font-body flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(booking.booking_date), "EEEE, d MMMM yyyy", { locale: pl })}
                                  </p>
                                  <p className="text-sm text-muted-foreground font-body flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {booking.booking_time}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3 flex-wrap">
                                <motion.span 
                                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    booking.status === 'confirmed' 
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {booking.status === 'confirmed' ? '✓ Potwierdzona' : '⏳ Oczekuje'}
                                </motion.span>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                        disabled={!canCancel}
                                      >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Anuluj
                                      </Button>
                                    </motion.div>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="font-display flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-destructive" />
                                        Anulować rezerwację?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="font-body">
                                        Czy na pewno chcesz anulować lekcję na{" "}
                                        <strong>{format(new Date(booking.booking_date), "d MMMM yyyy", { locale: pl })}</strong>{" "}
                                        o godzinie <strong>{booking.booking_time}</strong>?
                                        <br /><br />
                                        <strong className="text-amber-600">Uwaga:</strong> W przypadku anulowania mniej niż 24h przed lekcją, 
                                        obowiązuje opłata 50% wartości lekcji.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Nie, zostaw</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleCancelBooking(booking.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Tak, anuluj lekcję
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                
                                {!canCancel && (
                                  <span className="text-xs text-muted-foreground">
                                    (za mniej niż 24h)
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>

                {/* Past Lessons */}
                {pastBookings.length > 0 && (
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      Historia lekcji
                    </h2>
                    <div className="space-y-3">
                      {pastBookings.slice(0, 5).map((booking, index) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          whileHover={{ x: 5 }}
                          className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-display font-medium text-sm text-foreground/80">
                                {booking.lesson_type}
                              </h3>
                              <p className="text-xs text-muted-foreground font-body">
                                {format(new Date(booking.booking_date), "d MMMM yyyy", { locale: pl })}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {booking.booking_time}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
