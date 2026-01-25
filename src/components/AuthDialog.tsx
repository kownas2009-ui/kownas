import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, UserPlus, Loader2, ShieldAlert, KeyRound, ArrowLeft, Mail, Sparkles } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

interface AuthDialogProps {
  children: React.ReactNode;
}

const emailSchema = z.string().trim().email("Nieprawidłowy adres email").max(255);
const passwordSchema = z.string().min(6, "Hasło musi mieć min. 6 znaków").max(72, "Hasło max 72 znaki");
const fullNameSchema = z.string().trim().min(2, "Imię i nazwisko wymagane").max(100, "Max 100 znaków");

// Rate limiting configuration
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60000; // 1 minute

type AuthView = "login" | "register" | "forgot-password" | "reset-sent";

const AuthDialog = ({ children }: AuthDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  
  // Rate limiting state
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  
  const { signIn, signUp } = useAuth();

  // Lockout countdown timer
  useEffect(() => {
    if (lockedUntil) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, lockedUntil - Date.now());
        setLockoutRemaining(Math.ceil(remaining / 1000));
        if (remaining <= 0) {
          setLockedUntil(null);
          setAttempts(0);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockedUntil]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0]?.message;
    }

    if (view === "login" || view === "register") {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0]?.message;
      }
    }

    if (view === "register") {
      const nameResult = fullNameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.fullName = nameResult.error.errors[0]?.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0]?.message });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, trigger Supabase password reset to get the reset link
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      // Also send our beautiful custom email via edge function
      const response = await supabase.functions.invoke("send-password-reset", {
        body: {
          email: email.trim(),
          resetUrl: `${window.location.origin}/reset-password`,
        },
      });

      if (response.error) {
        console.warn("Custom email failed, using Supabase default:", response.error);
      }

      setView("reset-sent");
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się wysłać emaila",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if locked out
    if (lockedUntil && Date.now() < lockedUntil) {
      toast({
        title: "Zbyt wiele prób",
        description: `Spróbuj ponownie za ${lockoutRemaining} sekund`,
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (view === "login") {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          // Increment attempts on failed login
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          
          if (newAttempts >= MAX_ATTEMPTS) {
            setLockedUntil(Date.now() + LOCKOUT_DURATION_MS);
            toast({
              title: "Konto tymczasowo zablokowane",
              description: "Zbyt wiele nieudanych prób. Spróbuj za 60 sekund.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Błąd logowania",
              description: `Nieprawidłowy email lub hasło. Pozostało prób: ${MAX_ATTEMPTS - newAttempts}`,
              variant: "destructive",
            });
          }
        } else {
          setAttempts(0);
          toast({
            title: "Zalogowano pomyślnie! ✓",
            description: "Witaj ponownie!",
          });
          setIsOpen(false);
          resetForm();
        }
      } else if (view === "register") {
        const { error } = await signUp(email.trim(), password, fullName.trim());
        if (error) {
          toast({
            title: "Błąd rejestracji",
            description: error.message || "Nie udało się utworzyć konta",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Konto utworzone! ✓",
            description: "Możesz się teraz zalogować",
          });
          setIsOpen(false);
          resetForm();
        }
      }
    } catch {
      toast({
        title: "Wystąpił błąd",
        description: "Spróbuj ponownie później",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setErrors({});
    setView("login");
  };

  const isLockedOut = lockedUntil && Date.now() < lockedUntil;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px] bg-background overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "reset-sent" ? (
            <motion.div
              key="reset-sent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-8"
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Mail className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="font-display text-2xl font-bold mb-2">Sprawdź swoją skrzynkę!</h3>
              <p className="text-muted-foreground font-body mb-4">
                Wysłaliśmy link do resetowania hasła na adres:<br />
                <strong className="text-foreground">{email}</strong>
              </p>
              <motion.div
                className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-left"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                  ⚠️ <strong>Uwaga:</strong> Jeśli nie widzisz wiadomości, sprawdź folder <strong>SPAM</strong> lub <strong>Oferty</strong> w swojej skrzynce pocztowej.
                </p>
              </motion.div>
              <Button
                variant="outline"
                onClick={() => {
                  setView("login");
                  setEmail("");
                }}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Wróć do logowania
              </Button>
            </motion.div>
          ) : view === "forgot-password" ? (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle className="font-display text-2xl flex items-center gap-2">
                  <KeyRound className="w-6 h-6" />
                  Zapomniałeś hasła?
                </DialogTitle>
                <DialogDescription className="font-body">
                  Podaj swój email, a wyślemy Ci link do resetowania hasła
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleForgotPassword} className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="twoj@email.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-card"
                    required
                    disabled={isLoading}
                    maxLength={255}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Wyślij link resetujący
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center pb-4">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-sm text-primary hover:underline font-body flex items-center gap-1 mx-auto"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Wróć do logowania
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="font-display text-2xl flex items-center gap-2">
                  {view === "login" ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                  {view === "login" ? "Logowanie" : "Rejestracja"}
                </DialogTitle>
                <DialogDescription className="font-body">
                  {view === "login"
                    ? "Zaloguj się do swojego konta ucznia"
                    : "Utwórz nowe konto ucznia"}
                </DialogDescription>
              </DialogHeader>

              {isLockedOut && (
                <motion.div 
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span>Zbyt wiele prób. Odczekaj {lockoutRemaining}s</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                {view === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                      Imię i nazwisko
                    </label>
                    <Input
                      placeholder="Jan Kowalski"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-card"
                      disabled={isLoading || isLockedOut}
                      maxLength={100}
                      autoComplete="name"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </motion.div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="twoj@email.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-card"
                    required
                    disabled={isLoading || isLockedOut}
                    maxLength={255}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    Hasło
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-card"
                    required
                    minLength={6}
                    maxLength={72}
                    disabled={isLoading || isLockedOut}
                    autoComplete={view === "login" ? "current-password" : "new-password"}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">{errors.password}</p>
                  )}
                </div>

                {view === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setView("forgot-password")}
                      className="text-sm text-primary hover:underline font-body"
                      disabled={isLoading}
                    >
                      Zapomniałeś hasła?
                    </button>
                  </div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isLoading || isLockedOut}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : view === "login" ? (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Zaloguj się
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Zarejestruj się
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="text-center pb-4">
                <button
                  type="button"
                  onClick={() => {
                    setView(view === "login" ? "register" : "login");
                    setErrors({});
                  }}
                  className="text-sm text-primary hover:underline font-body"
                  disabled={isLoading}
                >
                  {view === "login"
                    ? "Nie masz konta? Zarejestruj się"
                    : "Masz już konto? Zaloguj się"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
