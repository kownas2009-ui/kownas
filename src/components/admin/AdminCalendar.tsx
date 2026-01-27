import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { pl } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, User, FlaskConical, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  lesson_type: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
  user_id: string;
  is_paid: boolean;
  school_type?: string | null;
  subject?: string | null;
  level?: string | null;
  class_number?: number | null;
  topic?: string | null;
  profiles?: {
    full_name: string;
    phone: string | null;
  };
}

interface AdminCalendarProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

const AdminCalendar = ({ bookings, onSelectBooking }: AdminCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get bookings for a specific date - show only pending and confirmed
  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return bookings
      .filter(b => b.booking_date === dateStr && (b.status === "pending" || b.status === "confirmed"))
      .sort((a, b) => a.booking_time.localeCompare(b.booking_time));
  };

  // Day cell component with animations
  const DayCell = ({ date }: { date: Date }) => {
    const dayBookings = getBookingsForDate(date);
    const hasBookings = dayBookings.length > 0;
    const isToday = isSameDay(date, new Date());
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSelectedDate(date)}
        className={cn(
          "relative p-2 min-h-[80px] rounded-xl cursor-pointer transition-all border",
          isCurrentMonth ? "bg-card" : "bg-muted/30",
          isSelected && "ring-2 ring-primary shadow-lg",
          isToday && "border-primary",
          !isToday && "border-transparent"
        )}
      >
        <span className={cn(
          "text-sm font-medium",
          !isCurrentMonth && "text-muted-foreground/50",
          isToday && "text-primary font-bold"
        )}>
          {format(date, "d")}
        </span>
        
        {hasBookings && (
          <div className="mt-1 space-y-1">
            {dayBookings.slice(0, 3).map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBooking(booking);
                }}
                className={cn(
                  "text-xs px-2 py-1 rounded-md truncate cursor-pointer transition-all hover:scale-105",
                  booking.status === "confirmed" && "bg-green-500/20 text-green-700 dark:text-green-400",
                  booking.status === "pending" && "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
                  booking.status === "cancelled" && "bg-red-500/20 text-red-700 dark:text-red-400 line-through"
                )}
                title={`${booking.school_type || ''} ${booking.subject || ''} ${booking.level || ''} kl.${booking.class_number || ''}${booking.topic ? ' | ' + booking.topic : ''}`}
              >
                {booking.booking_time} - {booking.profiles?.full_name?.split(" ")[0] || "Uczeń"}
              </motion.div>
            ))}
            {dayBookings.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{dayBookings.length - 3} więcej
              </span>
            )}
          </div>
        )}
        
      </motion.div>
    );
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header with cosmic styling */}
      <div className="flex items-center justify-between">
        <motion.h3 
          className="text-2xl font-display font-bold text-foreground flex items-center gap-3"
          key={format(currentMonth, "MMMM yyyy")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-secondary" />
          </motion.div>
          {format(currentMonth, "LLLL yyyy", { locale: pl })}
        </motion.h3>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="cosmic-card"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="cosmic-card"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Calendar Grid with cosmic styling */}
      <div className="cosmic-card rounded-2xl p-4 border border-border relative overflow-hidden">
        {/* Subtle background effect */}
        <div className="absolute inset-0 plasma-effect opacity-30 pointer-events-none" />
        
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 relative z-10">
          {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"].map((day, i) => (
            <motion.div 
              key={day} 
              className={cn(
                "text-center text-sm font-medium py-2",
                i >= 5 ? "text-secondary" : "text-muted-foreground"
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {day}
            </motion.div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2 relative z-10">
          {/* Empty cells for days before month start */}
          {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px]" />
          ))}
          
          {days.map((date) => (
            <DayCell key={date.toISOString()} date={date} />
          ))}
        </div>
      </div>

      {/* Selected date details with cosmic styling */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="cosmic-card rounded-2xl border border-border p-6 overflow-hidden relative"
          >
            {/* Cosmic glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <h4 className="font-display font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-5 h-5 text-secondary" />
              </motion.div>
              <Clock className="w-5 h-5 text-primary" />
              {format(selectedDate, "d MMMM yyyy", { locale: pl })}
            </h4>

            {selectedDateBookings.length > 0 ? (
              <div className="space-y-3">
                {selectedDateBookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => onSelectBooking(booking)}
                    className={cn(
                      "p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] border",
                      booking.status === "confirmed" && "bg-green-500/10 border-green-500/30",
                      booking.status === "pending" && "bg-yellow-500/10 border-yellow-500/30",
                      booking.status === "cancelled" && "bg-red-500/10 border-red-500/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          booking.status === "confirmed" && "bg-green-500/20",
                          booking.status === "pending" && "bg-yellow-500/20",
                          booking.status === "cancelled" && "bg-red-500/20"
                        )}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{booking.profiles?.full_name || "Uczeń"}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {booking.booking_time}
                            <FlaskConical className="w-3 h-3 ml-2" />
                            {booking.lesson_type}
                          </p>
                          {booking.school_type && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {booking.school_type === "podstawowa" && "Szkoła podstawowa"}
                              {booking.school_type === "liceum" && "Liceum"}
                              {booking.school_type === "technikum" && "Technikum"}
                              {" • "}
                              {booking.subject === "chemia" ? "Chemia" : booking.subject === "fizyka" ? "Fizyka" : "Chemia"}
                              {booking.level && ` • ${booking.level === "podstawowy" ? "Podst." : "Rozsz."}`}
                              {booking.class_number && ` • Kl. ${booking.class_number}`}
                            </p>
                          )}
                          {booking.topic && (
                            <p className="text-xs text-secondary mt-1 truncate max-w-[200px]" title={booking.topic}>
                              📚 {booking.topic}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs px-3 py-1 rounded-full font-medium",
                        booking.status === "confirmed" && "bg-green-500/20 text-green-700 dark:text-green-400",
                        booking.status === "pending" && "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
                        booking.status === "cancelled" && "bg-red-500/20 text-red-700 dark:text-red-400"
                      )}>
                        {booking.status === "confirmed" ? "Potwierdzona" :
                         booking.status === "pending" ? "Oczekująca" : "Anulowana"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Brak rezerwacji w tym dniu
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCalendar;
