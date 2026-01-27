import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, isWithinInterval, addMonths, subMonths } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Calendar as CalendarIcon,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  lesson_type: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
  user_id: string;
  is_paid: boolean;
  school_type?: string;
  profiles?: {
    full_name: string;
    phone: string | null;
  };
}

interface MonthlyStatsProps {
  bookings: Booking[];
}

// Pricing based on school type
const getPriceForBooking = (booking: Booking): number => {
  if (booking.school_type === "podstawowa") {
    return 100;
  }
  // liceum or technikum = 120
  return 120;
};

const MonthlyStats = ({ bookings }: MonthlyStatsProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const stats = useMemo(() => {
    const currentMonthStart = startOfMonth(selectedMonth);
    const currentMonthEnd = endOfMonth(selectedMonth);
    
    const lastMonth = subMonths(selectedMonth, 1);
    const lastMonthStart = startOfMonth(lastMonth);
    const lastMonthEnd = endOfMonth(lastMonth);

    // Filter confirmed bookings for selected month
    const currentMonthBookings = bookings.filter(b => {
      const date = new Date(b.booking_date);
      return b.status === "confirmed" && isWithinInterval(date, {
        start: currentMonthStart,
        end: currentMonthEnd
      });
    });

    // Filter confirmed bookings for previous month (for comparison)
    const lastMonthBookings = bookings.filter(b => {
      const date = new Date(b.booking_date);
      return b.status === "confirmed" && isWithinInterval(date, {
        start: lastMonthStart,
        end: lastMonthEnd
      });
    });

    // Filter PAID bookings for earnings calculation
    const currentMonthPaidBookings = currentMonthBookings.filter(b => b.is_paid);
    const lastMonthPaidBookings = lastMonthBookings.filter(b => b.is_paid);

    // Unique students this month (from paid bookings only)
    const currentMonthStudents = new Set(currentMonthPaidBookings.map(b => b.user_id)).size;
    const lastMonthStudents = new Set(lastMonthPaidBookings.map(b => b.user_id)).size;

    // Lessons count (only paid lessons)
    const currentMonthLessons = currentMonthPaidBookings.length;
    const lastMonthLessons = lastMonthPaidBookings.length;

    // Earnings (based on school type - podstawowa = 100, liceum/technikum = 120)
    const currentMonthEarnings = currentMonthPaidBookings.reduce(
      (sum, booking) => sum + getPriceForBooking(booking), 
      0
    );
    const lastMonthEarnings = lastMonthPaidBookings.reduce(
      (sum, booking) => sum + getPriceForBooking(booking), 
      0
    );

    // Calculate percentage changes
    const studentChange = lastMonthStudents > 0 
      ? Math.round(((currentMonthStudents - lastMonthStudents) / lastMonthStudents) * 100)
      : currentMonthStudents > 0 ? 100 : 0;

    const lessonsChange = lastMonthLessons > 0
      ? Math.round(((currentMonthLessons - lastMonthLessons) / lastMonthLessons) * 100)
      : currentMonthLessons > 0 ? 100 : 0;

    const earningsChange = lastMonthEarnings > 0
      ? Math.round(((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100)
      : currentMonthEarnings > 0 ? 100 : 0;

    // Check if selected month is current month
    const now = new Date();
    const isCurrentMonth = selectedMonth.getMonth() === now.getMonth() && 
                          selectedMonth.getFullYear() === now.getFullYear();

    return {
      currentMonth: format(selectedMonth, "LLLL yyyy", { locale: pl }),
      students: currentMonthStudents,
      studentChange,
      lessons: currentMonthLessons,
      lessonsChange,
      earnings: currentMonthEarnings,
      earningsChange,
      isCurrentMonth,
    };
  }, [bookings, selectedMonth]);

  const goToPreviousMonth = () => setSelectedMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setSelectedMonth(prev => addMonths(prev, 1));
  const goToCurrentMonth = () => setSelectedMonth(new Date());

  const statCards = [
    {
      label: "Uczniów w tym miesiącu",
      value: stats.students,
      change: stats.studentChange,
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      format: (v: number) => v.toString(),
    },
    {
      label: "Lekcji w tym miesiącu",
      value: stats.lessons,
      change: stats.lessonsChange,
      icon: CalendarIcon,
      color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
      format: (v: number) => v.toString(),
    },
    {
      label: "Zarobki w tym miesiącu",
      value: stats.earnings,
      change: stats.earningsChange,
      icon: Wallet,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      format: (v: number) => `${v.toLocaleString("pl-PL")} zł`,
    },
  ];

  return (
    <div className="mb-8">
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-semibold text-foreground">
            Statystyki: {stats.currentMonth}
          </h2>
          {!stats.isCurrentMonth && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToCurrentMonth}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              (wróć do bieżącego)
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        key={stats.currentMonth}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {statCards.map((card, index) => (
          <motion.div
            key={`${stats.currentMonth}-${card.label}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="relative p-6 rounded-3xl bg-card border border-border shadow-soft overflow-hidden group"
          >
            {/* Background gradient on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <motion.div 
                  className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <card.icon className="w-6 h-6" />
                </motion.div>
                
                {card.change !== 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      card.change > 0 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {card.change > 0 ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {Math.abs(card.change)}%
                  </motion.div>
                )}
              </div>

              <motion.div 
                className="text-3xl font-display font-bold text-foreground mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              >
                {card.format(card.value)}
              </motion.div>
              <div className="text-sm text-muted-foreground font-body">{card.label}</div>
            </div>

            {/* Decorative icon */}
            <motion.div
              className="absolute -right-4 -bottom-4 opacity-5"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp className="w-24 h-24" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MonthlyStats;
