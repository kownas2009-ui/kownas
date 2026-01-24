import { useState } from "react";
import { format, isSaturday, isSunday } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface BookingDialogProps {
  children: React.ReactNode;
  lessonType?: string;
  onSuccess?: () => void;
}

const timeSlots = [
  "9:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const BookingDialog = ({ children, lessonType = "Lekcja", onSuccess }: BookingDialogProps) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch booked slots for selected date
  const fetchBookedSlots = async (selectedDate: Date) => {
    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("booking_date", dateStr)
        .neq("status", "cancelled");
      
      if (error) throw error;
      setBookedSlots(data?.map(b => b.booking_time) || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTime(undefined);
    if (newDate) {
      fetchBookedSlots(newDate);
    } else {
      setBookedSlots([]);
    }
  };

  const handleSubmit = async () => {
    if (!date || !selectedTime) {
      toast({
        title: "Uzupełnij wszystkie pola",
        description: "Wybierz datę i godzinę.",
        variant: "destructive",
      });
      return;
    }

    // If not logged in, require name and phone
    if (!user && (!name || !phone)) {
      toast({
        title: "Uzupełnij wszystkie pola",
        description: "Podaj swoje dane kontaktowe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (user) {
        // Save to database - using type assertion for newly created tables
        const { error } = await (supabase as any).from("bookings").insert({
          user_id: user.id,
          lesson_type: lessonType,
          booking_date: format(date, "yyyy-MM-dd"),
          booking_time: selectedTime,
          status: "pending",
        });

        if (error) throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Lekcja umówiona! ✓",
        description: `${format(date, "d MMMM yyyy", { locale: pl })} o ${selectedTime}`,
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Wystąpił błąd",
        description: "Spróbuj ponownie później",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when closing
      setTimeout(() => {
        setIsSubmitted(false);
        setDate(undefined);
        setSelectedTime(undefined);
        setName("");
        setPhone("");
      }, 300);
    }
  };

  // Only allow weekends
  const isWeekend = (date: Date) => isSaturday(date) || isSunday(date);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{lessonType}</DialogTitle>
          <DialogDescription className="font-body">
            Wybierz termin w weekend (sobota lub niedziela).
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Dziękuję za zgłoszenie!
            </h3>
            <p className="text-muted-foreground font-body">
              Skontaktuję się z Tobą w ciągu 24 godzin, aby potwierdzić termin.
            </p>
            <p className="text-primary font-semibold mt-4">
              {date && format(date, "d MMMM yyyy", { locale: pl })} o {selectedTime}
            </p>
            <Button 
              variant="hero" 
              className="mt-6"
              onClick={() => handleOpenChange(false)}
            >
              Zamknij
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-body">
                Wybierz datę (tylko weekendy)
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "d MMMM yyyy", { locale: pl }) : "Wybierz datę"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      date < new Date() || !isWeekend(date)
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slots */}
            {date && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-body">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Wybierz godzinę
                </label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "hero" : "outline"}
                          size="sm"
                          onClick={() => !isBooked && setSelectedTime(time)}
                          className={cn(
                            "font-body relative",
                            isBooked && "opacity-50 cursor-not-allowed line-through"
                          )}
                          disabled={isBooked}
                        >
                          {time}
                          {isBooked && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                )}
                {bookedSlots.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Szare terminy są już zajęte
                  </p>
                )}
              </div>
            )}

            {/* Contact Info - only show if not logged in */}
            {selectedTime && !user && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    Imię i nazwisko
                  </label>
                  <Input
                    placeholder="Jan Kowalski"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-card"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    Numer telefonu
                  </label>
                  <Input
                    placeholder="+48 123 456 789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-card"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            {selectedTime && (
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full animate-fade-in-up"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Rezerwuję..." : "Umów lekcję"}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
