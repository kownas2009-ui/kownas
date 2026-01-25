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
  CalendarX
} from "lucide-react";
import { toast } from "sonner";
import { format, isSaturday, isSunday } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BlockedDay {
  id: string;
  blocked_date: string;
  reason: string | null;
  created_at: string;
}

const BlockedDaysManager = () => {
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [adding, setAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchBlockedDays();
  }, []);

  const fetchBlockedDays = async () => {
    setLoading(true);
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
      setSelectedDate(undefined);
      setReason("");
      setIsOpen(false);
      fetchBlockedDays();
    } catch (error) {
      console.error("Error adding blocked day:", error);
      toast.error("Błąd podczas blokowania dnia");
    } finally {
      setAdding(false);
    }
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

  // Only allow weekends
  const isWeekend = (date: Date) => isSaturday(date) || isSunday(date);

  // Check if date is already blocked
  const isBlocked = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDays.some(d => d.blocked_date === dateStr);
  };

  // Get upcoming blocked days only
  const upcomingBlockedDays = blockedDays.filter(d => new Date(d.blocked_date) >= new Date());

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
          Zablokowane dni
        </h3>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Zablokuj dzień
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="end">
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) =>
                  date < new Date() || !isWeekend(date) || isBlocked(date)
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
                  <Input
                    placeholder="Powód (opcjonalnie)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={handleAddBlockedDay}
                    disabled={adding}
                  >
                    {adding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CalendarX className="w-4 h-4 mr-2" />
                        Zablokuj
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

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
    </div>
  );
};

export default BlockedDaysManager;
