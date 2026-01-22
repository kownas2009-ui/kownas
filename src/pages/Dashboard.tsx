import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  LogOut, 
  Calendar, 
  User, 
  Clock, 
  Atom,
  BookOpen,
  Loader2
} from "lucide-react";
import BookingDialog from "@/components/BookingDialog";

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
    }
  }, [user]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Fetch profile - using type assertion for newly created tables
      const { data: profileData } = await (supabase as any)
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user!.id)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch bookings - using type assertion for newly created tables
      const { data: bookingsData } = await (supabase as any)
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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.booking_date) >= new Date()
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.booking_date) < new Date()
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Atom className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Aneta</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground font-body text-sm hidden sm:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Cześć, {profile?.full_name || "Uczniu"}! 👋
          </h1>
          <p className="text-muted-foreground font-body">
            Zarządzaj swoimi lekcjami z chemii i fizyki
          </p>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Book New Lesson */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl font-semibold mb-2">
                  Umów nową lekcję
                </h2>
                <p className="text-muted-foreground font-body text-sm mb-4">
                  Wybierz termin na najbliższy weekend
                </p>
                <BookingDialog lessonType="Lekcja" onSuccess={fetchData}>
                  <Button variant="hero" className="w-full">
                    <Calendar className="w-5 h-5 mr-2" />
                    Zarezerwuj termin
                  </Button>
                </BookingDialog>
              </div>
            </div>

            {/* Upcoming Lessons */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Nadchodzące lekcje
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="p-8 rounded-2xl bg-card border border-border text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-body">
                    Brak zaplanowanych lekcji
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl bg-card border border-border shadow-soft flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold">
                            {booking.lesson_type}
                          </h3>
                          <p className="text-sm text-muted-foreground font-body">
                            {format(new Date(booking.booking_date), "d MMMM yyyy", { locale: pl })} o {booking.booking_time}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status === 'confirmed' ? 'Potwierdzona' : 'Oczekuje'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Past Lessons */}
              {pastBookings.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    Historia lekcji
                  </h2>
                  <div className="space-y-3">
                    {pastBookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between opacity-75"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-display font-medium text-sm">
                              {booking.lesson_type}
                            </h3>
                            <p className="text-xs text-muted-foreground font-body">
                              {format(new Date(booking.booking_date), "d MMMM yyyy", { locale: pl })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
