import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { 
  CalendarOff, 
  Loader2,
  Trash2,
  Plus,
  CalendarX,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface BlockedDay {
  id: string;
  blocked_date: string;
  reason: string | null;
  created_at: string;
}

interface BlockedTimeSlot {
  id: string;
  blocked_date: string;
  blocked_time: string;
  reason: string | null;
  created_at: string;
}

const TIME_SLOTS = [
  "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const BlockedDaysManager = () => {
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [blockedTimeSlots, setBlockedTimeSlots] = useState<BlockedTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [adding, setAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [blockType, setBlockType] = useState<"day" | "hours">("day");

  useEffect(() => {
    fetchBlockedDays();
    fetchBlockedTimeSlots();
  }, []);

  const fetchBlockedDays = async () => {
    try {
      const { data, error } = await supabase
        .from("blocked_days")
        .select("*")
        .order("blocked_date", { ascending: true });

      if (error) throw error;
      setBlockedDays(data || []);
    } catch (error) {
      console.error("Error fetching blocked days:", error);
      toast.error("Błąd podczas ładowania zablokowanych dni");
    }
  };

  const fetchBlockedTimeSlots = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blocked_time_slots")
        .select("*")
        .order("blocked_date", { ascending: true });

      if (error) throw error;
      setBlockedTimeSlots(data || []);
    } catch (error) {
      console.error("Error fetching blocked time slots:", error);
      toast.error("Błąd podczas ładowania zablokowanych godzin");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlockedDay = async () => {
    if (!selectedDate) return;

    setAdding(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      
      const { error } = await supabase
        .from("blocked_days")
        .insert({
          blocked_date: dateStr,
          reason: reason.trim() || null
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("Ten dzień jest już zablokowany");
          return;
        }
        throw error;
      }

      toast.success(`Zablokowano ${format(selectedDate, "d MMMM yyyy", { locale: pl })}`);
      resetForm();
      fetchBlockedDays();
    } catch (error) {
      console.error("Error adding blocked day:", error);
      toast.error("Błąd podczas blokowania dnia");
    } finally {
      setAdding(false);
    }
  };

  const handleAddBlockedTimeSlots = async () => {
    if (!selectedDate || selectedTimes.length === 0) return;

    setAdding(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      
      const inserts = selectedTimes.map(time => ({
        blocked_date: dateStr,
        blocked_time: time,
        reason: reason.trim() || null
      }));

      const { error } = await supabase
        .from("blocked_time_slots")
        .insert(inserts);

      if (error) {
        if (error.code === "23505") {
          toast.error("Niektóre godziny są już zablokowane");
          return;
        }
        throw error;
      }

      toast.success(`Zablokowano ${selectedTimes.length} godzin(y) w dniu ${format(selectedDate, "d MMMM", { locale: pl })}`);
      resetForm();
      fetchBlockedTimeSlots();
    } catch (error) {
      console.error("Error adding blocked time slots:", error);
      toast.error("Błąd podczas blokowania godzin");
    } finally {
      setAdding(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTimes([]);
    setReason("");
    setIsOpen(false);
  };

  const handleRemoveBlockedDay = async (id: string) => {
    try {
      const { error } = await supabase
        .from("blocked_days")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Dzień odblokowany");
      setBlockedDays(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error removing blocked day:", error);
      toast.error("Błąd podczas odblokowywania dnia");
    }
  };

  const handleRemoveBlockedTimeSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from("blocked_time_slots")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Godzina odblokowana");
      setBlockedTimeSlots(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error removing blocked time slot:", error);
      toast.error("Błąd podczas odblokowywania godziny");
    }
  };

  const toggleTimeSlot = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  // Allow all days

  // Check if date is already blocked as full day
  const isBlocked = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDays.some(d => d.blocked_date === dateStr);
  };

  // Get already blocked times for selected date
  const getBlockedTimesForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedTimeSlots
      .filter(t => t.blocked_date === dateStr)
      .map(t => t.blocked_time);
  };

  // Get upcoming blocked days only
  const upcomingBlockedDays = blockedDays.filter(d => new Date(d.blocked_date) >= new Date());
  
  // Get upcoming blocked time slots grouped by date
  const upcomingBlockedTimeSlots = blockedTimeSlots.filter(t => new Date(t.blocked_date) >= new Date());

  // Group time slots by date
  const groupedTimeSlots = upcomingBlockedTimeSlots.reduce((acc, slot) => {
    if (!acc[slot.blocked_date]) {
      acc[slot.blocked_date] = [];
    }
    acc[slot.blocked_date].push(slot);
    return acc;
  }, {} as Record<string, BlockedTimeSlot[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <CalendarOff className="w-5 h-5 text-destructive" />
          Blokowanie terminów
        </h3>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Zablokuj termin
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="end">
            <div className="space-y-4">
              <Tabs value={blockType} onValueChange={(v) => setBlockType(v as "day" | "hours")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="day" className="gap-2">
                    <CalendarX className="w-4 h-4" />
                    Cały dzień
                  </TabsTrigger>
                  <TabsTrigger value="hours" className="gap-2">
                    <Clock className="w-4 h-4" />
                    Godziny
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTimes([]);
                }}
                disabled={(date) =>
                  date < new Date() || (blockType === "day" && isBlocked(date))
                }
                className="rounded-md border"
              />

              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <div>
                    <p className="text-sm font-medium mb-1">Wybrany dzień:</p>
                    <p className="text-primary font-semibold">
                      {format(selectedDate, "EEEE, d MMMM yyyy", { locale: pl })}
                    </p>
                  </div>

                  {blockType === "hours" && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Wybierz godziny:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((time) => {
                          const alreadyBlocked = getBlockedTimesForDate(selectedDate).includes(time);
                          const isSelected = selectedTimes.includes(time);
                          
                          return (
                            <div
                              key={time}
                              className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                                alreadyBlocked 
                                  ? "bg-muted opacity-50 cursor-not-allowed"
                                  : isSelected
                                    ? "bg-destructive/10 border-destructive"
                                    : "hover:bg-muted cursor-pointer"
                              }`}
                              onClick={() => !alreadyBlocked && toggleTimeSlot(time)}
                            >
                              <Checkbox
                                checked={isSelected || alreadyBlocked}
                                disabled={alreadyBlocked}
                                className="pointer-events-none"
                              />
                              <span className={`text-sm ${alreadyBlocked ? "line-through" : ""}`}>
                                {time}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {selectedTimes.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Wybrano: {selectedTimes.sort().join(", ")}
                        </p>
                      )}
                    </div>
                  )}

                  <Input
                    placeholder="Powód (opcjonalnie)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />

                  <Button
                    className="w-full"
                    onClick={blockType === "day" ? handleAddBlockedDay : handleAddBlockedTimeSlots}
                    disabled={adding || (blockType === "hours" && selectedTimes.length === 0)}
                  >
                    {adding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {blockType === "day" ? (
                          <CalendarX className="w-4 h-4 mr-2" />
                        ) : (
                          <Clock className="w-4 h-4 mr-2" />
                        )}
                        {blockType === "day" ? "Zablokuj dzień" : `Zablokuj ${selectedTimes.length} godzin(y)`}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Tabs defaultValue="days" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="days" className="gap-2">
            <CalendarX className="w-4 h-4" />
            Zablokowane dni ({upcomingBlockedDays.length})
          </TabsTrigger>
          <TabsTrigger value="hours" className="gap-2">
            <Clock className="w-4 h-4" />
            Zablokowane godziny ({upcomingBlockedTimeSlots.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="days">
          <div className="space-y-2">
            <AnimatePresence>
              {upcomingBlockedDays.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8"
                >
                  Brak zablokowanych dni
                </motion.p>
              ) : (
                upcomingBlockedDays.map((day, i) => (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 bg-destructive/5 rounded-xl border border-destructive/20"
                  >
                    <div>
                      <p className="font-medium text-destructive">
                        {format(new Date(day.blocked_date), "EEEE, d MMMM yyyy", { locale: pl })}
                      </p>
                      {day.reason && (
                        <p className="text-sm text-muted-foreground">{day.reason}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBlockedDay(day.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="hours">
          <div className="space-y-4">
            <AnimatePresence>
              {Object.keys(groupedTimeSlots).length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8"
                >
                  Brak zablokowanych godzin
                </motion.p>
              ) : (
                Object.entries(groupedTimeSlots)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, slots], i) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/20"
                    >
                      <p className="font-medium text-amber-600 dark:text-amber-400 mb-2">
                        {format(new Date(date), "EEEE, d MMMM yyyy", { locale: pl })}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {slots
                          .sort((a, b) => a.blocked_time.localeCompare(b.blocked_time))
                          .map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded-lg text-sm"
                            >
                              <Clock className="w-3 h-3" />
                              {slot.blocked_time}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveBlockedTimeSlot(slot.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                      </div>
                      {slots[0]?.reason && (
                        <p className="text-xs text-muted-foreground mt-2">{slots[0].reason}</p>
                      )}
                    </motion.div>
                  ))
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockedDaysManager;