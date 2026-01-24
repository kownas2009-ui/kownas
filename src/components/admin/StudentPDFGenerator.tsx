import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Mail, Loader2, FlaskConical, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface Booking {
  id: string;
  lesson_type: string;
  booking_date: string;
  booking_time: string;
  status: string;
  profiles?: {
    full_name: string;
    phone: string | null;
  };
}

interface StudentPDFGeneratorProps {
  bookings: Booking[];
}

const StudentPDFGenerator = ({ bookings }: StudentPDFGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState("Materiały do lekcji chemii");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleBooking = (id: string) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBookings(newSelected);
  };

  const selectAll = () => {
    if (selectedBookings.size === bookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(new Set(bookings.map(b => b.id)));
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    // Create PDF content
    const selectedList = bookings.filter(b => selectedBookings.has(b.id));
    
    // Create a printable HTML document
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Materiały do lekcji chemii</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #0ea5e9; border-bottom: 3px solid #0ea5e9; padding-bottom: 10px; }
          h2 { color: #334155; margin-top: 30px; }
          .student-card { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 15px 0; border-left: 4px solid #0ea5e9; }
          .student-name { font-size: 18px; font-weight: bold; color: #1e293b; }
          .lesson-info { color: #64748b; margin-top: 8px; }
          .message-box { background: #e0f2fe; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; text-align: center; }
          .molecule { position: absolute; right: 40px; top: 40px; opacity: 0.1; }
        </style>
      </head>
      <body>
        <h1>🧪 Materiały do lekcji chemii</h1>
        <p><strong>Temat:</strong> ${subject}</p>
        <p><strong>Data wygenerowania:</strong> ${format(new Date(), "d MMMM yyyy, HH:mm", { locale: pl })}</p>
        
        ${message ? `
        <div class="message-box">
          <h3>📝 Wiadomość od nauczyciela:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
        
        <h2>👥 Lista uczniów (${selectedList.length})</h2>
        ${selectedList.map(b => `
          <div class="student-card">
            <div class="student-name">${b.profiles?.full_name || 'Uczeń'}</div>
            <div class="lesson-info">
              📅 ${format(new Date(b.booking_date), "d MMMM yyyy", { locale: pl })} 
              🕐 ${b.booking_time} 
              🧪 ${b.lesson_type}
            </div>
          </div>
        `).join('')}
        
        <div class="footer">
          <p>Wygenerowano przez ChemiAnetka - Korepetycje z chemii</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      
      // Trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }

    setIsGenerating(false);
    toast.success("PDF wygenerowany! Zapisz przez drukowanie.");
    setIsOpen(false);
  };

  const confirmedBookings = bookings.filter(b => b.status !== "cancelled");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Generuj PDF
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FileText className="w-6 h-6 text-primary" />
            </motion.div>
            Generator PDF dla uczniów
          </DialogTitle>
          <DialogDescription>
            Wybierz uczniów i dodaj wiadomość, aby wygenerować dokument PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-2">Temat dokumentu</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="np. Materiały do lekcji chemii"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-2">Wiadomość (opcjonalna)</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Napisz wiadomość do uczniów..."
              rows={4}
            />
          </div>

          {/* Student selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Wybierz uczniów</label>
              <Button variant="ghost" size="sm" onClick={selectAll}>
                {selectedBookings.size === confirmedBookings.length ? "Odznacz wszystkich" : "Zaznacz wszystkich"}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {confirmedBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => toggleBooking(booking.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${
                    selectedBookings.has(booking.id)
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedBookings.has(booking.id)
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/30"
                    }`}>
                      {selectedBookings.has(booking.id) && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{booking.profiles?.full_name || "Uczeń"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(booking.booking_date), "d MMM", { locale: pl })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.booking_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <FlaskConical className="w-3 h-3" />
                          {booking.lesson_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full gap-2"
              onClick={generatePDF}
              disabled={selectedBookings.size === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generowanie...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generuj PDF ({selectedBookings.size} {selectedBookings.size === 1 ? "uczeń" : "uczniów"})
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentPDFGenerator;
