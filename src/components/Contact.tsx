import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Calendar, Video, Send, Phone, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MoleculeDecoration from "./MoleculeDecoration";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const messageSchema = z.object({
  name: z.string().trim().min(2, "Imię jest wymagane").max(100, "Max 100 znaków"),
  email: z.string().trim().email("Nieprawidłowy email").max(255, "Max 255 znaków"),
  phone: z.string().trim().max(20, "Max 20 znaków").optional(),
  message: z.string().trim().min(10, "Wiadomość musi mieć min. 10 znaków").max(2000, "Max 2000 znaków"),
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = messageSchema.safeParse({ name, email, phone, message });
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          sender_name: name.trim(),
          sender_email: email.trim(),
          sender_phone: phone.trim() || null,
          message: message.trim(),
          is_read: false,
          admin_reply: null,
          replied_at: null,
        });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Wiadomość wysłana! ✓",
        description: "Odpowiem najszybciej jak to możliwe.",
      });
      
      // Reset form after delay
      setTimeout(() => {
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-card/50 relative overflow-hidden">
      {/* Background decoration */}
      <MoleculeDecoration className="absolute -bottom-20 -right-20 w-96 h-96 opacity-20" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Skontaktuj się</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Skontaktuj się ze mną
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Masz pytania? Chętnie odpowiem i pomogę dobrać odpowiedni plan zajęć.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Phone className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Telefon
                </h3>
                <a 
                  href="tel:+48507125569" 
                  className="text-muted-foreground font-body hover:text-primary transition-colors text-lg"
                >
                  +48 507 125 569
                </a>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Mail className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Email
                </h3>
                <a 
                  href="mailto:aneta.kownacka79@gmail.com"
                  className="text-muted-foreground font-body hover:text-primary transition-colors"
                >
                  aneta.kownacka79@gmail.com
                </a>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Video className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Forma zajęć
                </h3>
                <p className="text-muted-foreground font-body">
                  Tylko online (Zoom / Google Meet)
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Dostępność
                </h3>
                <p className="text-muted-foreground font-body">
                  Cały tydzień, godz. 8:00–20:00
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="p-6 rounded-2xl bg-background border border-border shadow-soft mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-display text-lg text-foreground italic">
                "Chemia to nie magia — to logika, którą można zrozumieć. Pozwól mi Ci to pokazać."
              </p>
              <p className="text-primary font-semibold mt-3">— Aneta</p>
            </motion.div>
          </div>

          {/* Contact form */}
          <motion.div 
            className="p-8 rounded-2xl bg-background border border-border shadow-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold mb-2">Wiadomość wysłana!</h3>
                  <p className="text-muted-foreground">
                    Dziękuję za kontakt. Odpowiem najszybciej jak to możliwe.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-foreground mb-2 font-body">
                        Imię *
                      </label>
                      <Input 
                        placeholder="Twoje imię" 
                        className="bg-card"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        maxLength={100}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">{errors.name}</p>
                      )}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-foreground mb-2 font-body">
                        Telefon
                      </label>
                      <Input 
                        placeholder="+48 ..." 
                        className="bg-card"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                        maxLength={20}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                      Email *
                    </label>
                    <Input 
                      type="email" 
                      placeholder="twoj@email.pl" 
                      className="bg-card"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      maxLength={255}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                      Wiadomość *
                    </label>
                    <Textarea
                      placeholder="Opisz swoje potrzeby, poziom nauki, dostępność..."
                      className="bg-card min-h-[120px]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isLoading}
                      maxLength={2000}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">{errors.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit"
                      variant="hero" 
                      size="lg" 
                      className="w-full group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                          Wyślij wiadomość
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
