import { useState, useEffect } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon, Clock, CheckCircle, GraduationCap, FlaskConical, BookOpen, ChevronRight } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import BookingCelebration from "./BookingCelebration";

interface BookingDialogProps {
  children: React.ReactNode;
  lessonType?: string;
  onSuccess?: () => void;
}

const timeSlots = [
  "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

type SchoolType = "podstawowa" | "liceum" | "technikum";
type Subject = "chemia" | "fizyka";
type Level = "podstawowy" | "rozszerzony";

const BookingDialog = ({ children, lessonType = "Lekcja", onSuccess }: BookingDialogProps) => {
  const { user } = useAuth();
  
  // Step management
  const [step, setStep] = useState<"school" | "details" | "schedule">("school");
  
  // School selection
  const [schoolType, setSchoolType] = useState<SchoolType | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [classNumber, setClassNumber] = useState<number | null>(null);
  
  // Schedule
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  
  // Contact
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [blockedDays, setBlockedDays] = useState<string[]>([]);
  const [blockedTimeSlots, setBlockedTimeSlots] = useState<Record<string, string[]>>({});

  // Fetch blocked days and time slots on mount
  useEffect(() => {
    const fetchBlockedData = async () => {
      try {
        const { data: daysData, error: daysError } = await supabase
          .from("blocked_days")
          .select("blocked_date");
        
        if (daysError) throw daysError;
        setBlockedDays((daysData || []).map(d => d.blocked_date));

        const { data: slotsData, error: slotsError } = await supabase
          .from("blocked_time_slots")
          .select("blocked_date, blocked_time");
        
        if (slotsError) throw slotsError;
        
        const grouped = (slotsData || []).reduce((acc, slot) => {
          if (!acc[slot.blocked_date]) {
            acc[slot.blocked_date] = [];
          }
          acc[slot.blocked_date].push(slot.blocked_time);
          return acc;
        }, {} as Record<string, string[]>);
        
        setBlockedTimeSlots(grouped);
      } catch (error) {
        console.error("Error fetching blocked data:", error);
      }
    };
    fetchBlockedData();
  }, []);

  // Get available classes based on school type
  const getAvailableClasses = (): number[] => {
    switch (schoolType) {
      case "podstawowa":
        return [7, 8];
      case "liceum":
        return [1, 2, 3, 4];
      case "technikum":
        return [1, 2, 3, 4, 5];
      default:
        return [];
    }
  };

  // Check if details step is complete
  const isDetailsComplete = (): boolean => {
    if (!schoolType) return false;
    
    switch (schoolType) {
      case "podstawowa":
        return subject !== null && classNumber !== null;
      case "liceum":
        return level !== null && classNumber !== null;
      case "technikum":
        return classNumber !== null;
      default:
        return false;
    }
  };

  // Fetch booked slots for selected date
  const fetchBookedSlots = async (selectedDate: Date) => {
    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("booking_date", dateStr)
        .or("status.eq.pending,status.eq.confirmed");
      
      if (error) throw error;
      
      const activeSlots = (data || []).map(b => b.booking_time);
      setBookedSlots(activeSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTime(undefined);
    if (newDate) {
      fetchBookedSlots(newDate);
    } else {
      setBookedSlots([]);
    }
  };

  const handleSchoolSelect = (school: SchoolType) => {
    setSchoolType(school);
    // Reset dependent fields
    setSubject(school === "podstawowa" ? null : "chemia");
    setLevel(null);
    setClassNumber(null);
    setStep("details");
  };

  const handleSubmit = async () => {
    if (!date || !selectedTime || !schoolType || !classNumber) {
      toast({
        title: "Uzupełnij wszystkie pola",
        description: "Wybierz datę i godzinę.",
        variant: "destructive",
      });
      return;
    }

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
        const { error } = await supabase.from("bookings").insert({
          user_id: user.id,
          lesson_type: lessonType,
          booking_date: format(date, "yyyy-MM-dd"),
          booking_time: selectedTime,
          status: "pending",
          school_type: schoolType,
          subject: schoolType === "podstawowa" ? subject : "chemia",
          level: schoolType === "liceum" ? level : null,
          class_number: classNumber,
        });

        if (error) throw error;
      }

      setShowCelebration(true);
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
      setTimeout(() => {
        setIsSubmitted(false);
        setStep("school");
        setSchoolType(null);
        setSubject(null);
        setLevel(null);
        setClassNumber(null);
        setDate(undefined);
        setSelectedTime(undefined);
        setName("");
        setPhone("");
      }, 300);
    }
  };

  const isBlocked = (date: Date) => blockedDays.includes(format(date, "yyyy-MM-dd"));
  const isDateDisabled = (date: Date) => date < new Date() || isBlocked(date);

  // Get summary of selection
  const getSelectionSummary = (): string => {
    if (!schoolType) return "";
    
    const parts: string[] = [];
    
    switch (schoolType) {
      case "podstawowa":
        parts.push("Szkoła podstawowa");
        if (subject) parts.push(subject === "chemia" ? "Chemia" : "Fizyka");
        break;
      case "liceum":
        parts.push("Liceum");
        parts.push("Chemia");
        if (level) parts.push(level === "podstawowy" ? "Poziom podstawowy" : "Poziom rozszerzony");
        break;
      case "technikum":
        parts.push("Technikum");
        parts.push("Chemia");
        break;
    }
    
    if (classNumber) parts.push(`Klasa ${classNumber}`);
    
    return parts.join(" • ");
  };

  return (
    <>
      <BookingCelebration 
        isVisible={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{lessonType}</DialogTitle>
          <DialogDescription className="font-body">
            {step === "school" && "Wybierz typ szkoły"}
            {step === "details" && "Uzupełnij szczegóły"}
            {step === "schedule" && "Wybierz termin zajęć"}
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
            <p className="text-sm text-muted-foreground mt-2">
              {getSelectionSummary()}
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
            {/* Step 1: School Type Selection */}
            {step === "school" && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <button
                    onClick={() => handleSchoolSelect("podstawowa")}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">Szkoła Podstawowa</p>
                        <p className="text-sm text-muted-foreground">Klasa 7-8 • Chemia lub Fizyka</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>

                  <button
                    onClick={() => handleSchoolSelect("liceum")}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                        <GraduationCap className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">Liceum</p>
                        <p className="text-sm text-muted-foreground">Klasa 1-4 • Chemia podstawa/rozszerzenie</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>

                  <button
                    onClick={() => handleSchoolSelect("technikum")}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-accent transition-colors">
                        <FlaskConical className="w-6 h-6 text-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">Technikum</p>
                        <p className="text-sm text-muted-foreground">Klasa 1-5 • Chemia</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details based on school type */}
            {step === "details" && schoolType && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Back button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("school")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Zmień typ szkoły
                </Button>

                {/* School type badge */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
                  {schoolType === "podstawowa" && <BookOpen className="w-5 h-5 text-primary" />}
                  {schoolType === "liceum" && <GraduationCap className="w-5 h-5 text-primary" />}
                  {schoolType === "technikum" && <FlaskConical className="w-5 h-5 text-primary" />}
                  <span className="font-medium text-foreground">
                    {schoolType === "podstawowa" && "Szkoła Podstawowa"}
                    {schoolType === "liceum" && "Liceum"}
                    {schoolType === "technikum" && "Technikum"}
                  </span>
                </div>

                {/* Subject selection for primary school */}
                {schoolType === "podstawowa" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3 font-body">
                      Wybierz przedmiot
                    </label>
                    <RadioGroup 
                      value={subject || ""} 
                      onValueChange={(value) => setSubject(value as Subject)}
                      className="grid grid-cols-2 gap-3"
                    >
                      <div className="relative">
                        <RadioGroupItem value="chemia" id="chemia" className="peer sr-only" />
                        <Label
                          htmlFor="chemia"
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-border bg-card p-4 hover:bg-accent/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                        >
                          <FlaskConical className="w-8 h-8 mb-2 text-primary" />
                          <span className="font-semibold">Chemia</span>
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem value="fizyka" id="fizyka" className="peer sr-only" />
                        <Label
                          htmlFor="fizyka"
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-border bg-card p-4 hover:bg-accent/50 peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/10 cursor-pointer transition-all"
                        >
                          <svg className="w-8 h-8 mb-2 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                            <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                          </svg>
                          <span className="font-semibold">Fizyka</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Level selection for high school */}
                {schoolType === "liceum" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3 font-body">
                      Wybierz poziom (Chemia)
                    </label>
                    <RadioGroup 
                      value={level || ""} 
                      onValueChange={(value) => setLevel(value as Level)}
                      className="grid grid-cols-2 gap-3"
                    >
                      <div className="relative">
                        <RadioGroupItem value="podstawowy" id="podstawowy" className="peer sr-only" />
                        <Label
                          htmlFor="podstawowy"
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-border bg-card p-4 hover:bg-accent/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                        >
                          <span className="text-2xl mb-2">📘</span>
                          <span className="font-semibold">Podstawowy</span>
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem value="rozszerzony" id="rozszerzony" className="peer sr-only" />
                        <Label
                          htmlFor="rozszerzony"
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-border bg-card p-4 hover:bg-accent/50 peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/10 cursor-pointer transition-all"
                        >
                          <span className="text-2xl mb-2">📕</span>
                          <span className="font-semibold">Rozszerzony</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Technikum info */}
                {schoolType === "technikum" && (
                  <div className="p-4 rounded-xl bg-accent/30 border border-border">
                    <div className="flex items-center gap-2 text-foreground">
                      <FlaskConical className="w-5 h-5 text-primary" />
                      <span className="font-medium">Przedmiot: Chemia</span>
                    </div>
                  </div>
                )}

                {/* Class selection - always shown */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3 font-body">
                    Wybierz klasę
                  </label>
                  <RadioGroup 
                    value={classNumber?.toString() || ""} 
                    onValueChange={(value) => setClassNumber(parseInt(value))}
                    className="flex flex-wrap gap-2"
                  >
                    {getAvailableClasses().map((cls) => (
                      <div key={cls} className="relative">
                        <RadioGroupItem value={cls.toString()} id={`class-${cls}`} className="peer sr-only" />
                        <Label
                          htmlFor={`class-${cls}`}
                          className="flex items-center justify-center w-14 h-14 rounded-xl border-2 border-border bg-card hover:bg-accent/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all font-bold text-lg"
                        >
                          {cls}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Continue button */}
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={() => setStep("schedule")}
                  disabled={!isDetailsComplete()}
                >
                  Dalej - Wybierz termin
                </Button>
              </div>
            )}

            {/* Step 3: Schedule */}
            {step === "schedule" && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Back button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("details")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Zmień szczegóły
                </Button>

                {/* Selection summary */}
                <div className="p-3 rounded-lg bg-primary/10 text-sm">
                  <p className="font-medium text-foreground">{getSelectionSummary()}</p>
                </div>

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
                        onSelect={handleDateSelect}
                        disabled={isDateDisabled}
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
                          const dateStr = date ? format(date, "yyyy-MM-dd") : "";
                          const isBlockedTime = blockedTimeSlots[dateStr]?.includes(time) || false;
                          const isUnavailable = isBooked || isBlockedTime;
                          
                          return (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "hero" : "outline"}
                              size="sm"
                              onClick={() => !isUnavailable && setSelectedTime(time)}
                              className={cn(
                                "font-body relative",
                                isUnavailable && "opacity-50 cursor-not-allowed line-through"
                              )}
                              disabled={isUnavailable}
                            >
                              {time}
                              {isUnavailable && (
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
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default BookingDialog;