import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Calendar as CalendarIcon,
  ArrowUp,
  ArrowDown,
  Sparkles
} from "lucide-react";

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

interface MonthlyStatsProps {
  bookings: Booking[];
  pricePerLesson?: number;
}

const MonthlyStats = ({ bookings, pricePerLesson = 80 }: MonthlyStatsProps) => {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStart = startOfMonth(lastMonth);
    const lastMonthEnd = endOfMonth(lastMonth);

    // Filter confirmed bookings for current month
    const currentMonthBookings = bookings.filter(b => {
      const date = new Date(b.booking_date);
      return b.status === "confirmed" && isWithinInterval(date, {
        start: currentMonthStart,
        end: currentMonthEnd
      });
    });

    // Filter confirmed bookings for last month
    const lastMonthBookings = bookings.filter(b => {
      const date = new Date(b.booking_date);
      return b.status === "confirmed" && isWithinInterval(date, {
        start: lastMonthStart,
        end: lastMonthEnd
      });
    });

    // Unique students this month
    const currentMonthStudents = new Set(currentMonthBookings.map(b => b.user_id)).size;
    const lastMonthStudents = new Set(lastMonthBookings.map(b => b.user_id)).size;

    // Lessons count
    const currentMonthLessons = currentMonthBookings.length;
    const lastMonthLessons = lastMonthBookings.length;

    // Earnings
    const currentMonthEarnings = currentMonthLessons * pricePerLesson;
    const lastMonthEarnings = lastMonthLessons * pricePerLesson;

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

    return {
      currentMonth: format(now, "LLLL yyyy", { locale: pl }),
      students: currentMonthStudents,
      studentChange,
      lessons: currentMonthLessons,
      lessonsChange,
      earnings: currentMonthEarnings,
      earningsChange,
    };
  }, [bookings, pricePerLesson]);

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
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-semibold text-foreground">
          Statystyki: {stats.currentMonth}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
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
      </div>
    </div>
  );
};

export default MonthlyStats;
