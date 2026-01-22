import { useState } from "react";
import { format } from "date-fns";
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

interface BookingDialogProps {
  children: React.ReactNode;
  lessonType?: string;
}

const timeSlots = [
  "9:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const BookingDialog = ({ children, lessonType = "Lekcja próbna" }: BookingDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!date || !selectedTime || !name || !phone) {
      toast({
        title: "Uzupełnij wszystkie pola",
        description: "Wybierz datę, godzinę i podaj swoje dane kontaktowe.",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally send to backend
    setIsSubmitted(true);
    toast({
      title: "Lekcja umówiona! ✓",
      description: `${format(date, "d MMMM yyyy", { locale: pl })} o ${selectedTime}`,
    });
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{lessonType}</DialogTitle>
          <DialogDescription className="font-body">
            Wybierz dogodny termin i zostaw swoje dane kontaktowe.
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
                Wybierz datę
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
                    onSelect={setDate}
                    disabled={(date) =>
                      date < new Date() || date.getDay() === 0
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
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "hero" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="font-body"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            {selectedTime && (
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
              >
                Umów lekcję
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
