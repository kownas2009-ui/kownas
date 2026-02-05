import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  X, 
  Users, 
  GraduationCap, 
  Phone, 
  Calendar,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Booking {
  id: string;
  user_id: string;
  booking_date: string;
  status: string;
  profiles?: {
    full_name: string;
    phone: string | null;
  };
}

interface AllStudentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

interface StudentInfo {
  user_id: string;
  full_name: string;
  phone: string | null;
  totalBookings: number;
  firstBooking: string;
  lastBooking: string;
}

const AllStudentsDialog = ({ isOpen, onClose, bookings }: AllStudentsDialogProps) => {
  const students = useMemo(() => {
    const studentMap = new Map<string, StudentInfo>();
    
    bookings.forEach(booking => {
      const existing = studentMap.get(booking.user_id);
      const bookingDate = booking.booking_date;
      
      if (existing) {
        existing.totalBookings++;
        if (bookingDate < existing.firstBooking) {
          existing.firstBooking = bookingDate;
        }
        if (bookingDate > existing.lastBooking) {
          existing.lastBooking = bookingDate;
        }
      } else {
        studentMap.set(booking.user_id, {
          user_id: booking.user_id,
          full_name: booking.profiles?.full_name || "Nieznany uczeń",
          phone: booking.profiles?.phone || null,
          totalBookings: 1,
          firstBooking: bookingDate,
          lastBooking: bookingDate,
        });
      }
    });
    
    return Array.from(studentMap.values()).sort((a, b) => 
      b.totalBookings - a.totalBookings
    );
  }, [bookings]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-card rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-border max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Wszyscy uczniowie</h3>
                <p className="text-sm text-muted-foreground">
                  {students.length} {students.length === 1 ? "uczeń" : students.length < 5 ? "uczniów" : "uczniów"} którzy kiedykolwiek zamówili lekcje
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 -mx-2 px-2">
            <div className="space-y-3">
              {students.map((student, index) => (
                <motion.div
                  key={student.user_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-muted/30 rounded-2xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                        {student.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{student.full_name}</p>
                        {student.phone && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {student.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{student.totalBookings}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.totalBookings === 1 ? "lekcja" : student.totalBookings < 5 ? "lekcje" : "lekcji"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Pierwsza: {format(new Date(student.firstBooking), "d MMM yyyy", { locale: pl })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Ostatnia: {format(new Date(student.lastBooking), "d MMM yyyy", { locale: pl })}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {students.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Brak uczniów</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AllStudentsDialog;
