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
import { LogIn, UserPlus, Loader2, ShieldAlert, KeyRound, ArrowLeft, Mail, Sparkles, AlertTriangle } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

interface AuthDialogProps {
  children: React.ReactNode;
}

// Enhanced email validation with common provider check
const commonEmailProviders = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'wp.pl', 'onet.pl', 
  'interia.pl', 'o2.pl', 'tlen.pl', 'gazeta.pl', 'icloud.com', 'protonmail.com',
  'live.com', 'aol.com', 'mail.com', 'zoho.com', 'yandex.com', 'gmx.com'
];

const isValidEmailFormat = (email: string): boolean => {
  // Check for common typos in popular domains
  const typoPatterns = [
    /gmal\.com$/i, /gmial\.com$/i, /gamil\.com$/i, /gnail\.com$/i,
    /yahooo\.com$/i, /yaho\.com$/i, /yhoo\.com$/i,
    /outloo\.com$/i, /outlok\.com$/i,
    /hotmal\.com$/i, /hotmai\.com$/i,
  ];
  
  for (const pattern of typoPatterns) {
    if (pattern.test(email)) {
      return false;
    }
  }
  
  // Check if domain has valid structure (at least one dot after @)
  const domain = email.split('@')[1];
  if (!domain || !domain.includes('.')) return false;
  
  // Check domain has at least 2 chars after last dot
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return false;
  
  return true;
};

const emailSchema = z.string()
  .trim()
  .email("Nieprawidłowy adres email")
  .max(255, "Email max 255 znaków")
  .refine((email) => isValidEmailFormat(email), {
    message: "Sprawdź poprawność adresu email - wygląda na błędny"
  });

const passwordSchema = z.string()
  .min(8, "Hasło musi mieć min. 8 znaków")
  .max(72, "Hasło max 72 znaki")
  .regex(/[A-Z]/, "Hasło musi zawierać wielką literę")
  .regex(/[a-z]/, "Hasło musi zawierać małą literę")
  .regex(/[0-9]/, "Hasło musi zawierać cyfrę");

const fullNameSchema = z.string().trim().min(2, "Imię i nazwisko wymagane").max(100, "Max 100 znaków");
const phoneSchema = z.string().trim().min(9, "Numer telefonu wymagany").max(20, "Max 20 znaków").regex(/^[\d\s\+\-\(\)]+$/, "Nieprawidłowy format numeru");

// Rate limiting configuration
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60000; // 1 minute

// Debounce registration to prevent rate limits
const REGISTRATION_COOLDOWN_MS = 3000; // 3 seconds between registration attempts

type AuthView = "login" | "register" | "forgot-password" | "reset-sent";

const AuthDialog = ({ children }: AuthDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string; phone?: string }>({});
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  
  // Rate limiting state
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [lastRegistrationAttempt, setLastRegistrationAttempt] = useState<number>(0);
  
  const { signIn, signUp } = useAuth();

  // Email validation on blur
  const handleEmailBlur = () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;
    
    const domain = trimmedEmail.split('@')[1];
    if (domain && !commonEmailProviders.includes(domain)) {
      // Check if it's a plausible domain
      const parts = domain.split('.');
      if (parts.length >= 2 && parts[parts.length - 1].length >= 2) {
        setEmailWarning(`Czy na pewno "${domain}" to poprawna domena?`);
      }
    } else {
      setEmailWarning(null);
    }
  };

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
      const phoneResult = phoneSchema.safeParse(phone);
      if (!phoneResult.success) {
        newErrors.phone = phoneResult.error.errors[0]?.message;
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
      // Use Supabase's built-in password reset - works without verified domain
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

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
        const { error } = await signIn(email.trim().toLowerCase(), password);
        if (error) {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          
          // Check if the error is about email not confirmed
          if (error.message?.toLowerCase().includes("email not confirmed") || 
              error.message?.toLowerCase().includes("email_not_confirmed")) {
            toast({
              title: "Konto nie zostało zweryfikowane",
              description: "Sprawdź swoją skrzynkę email i kliknij w link weryfikacyjny, aby aktywować konto.",
              variant: "destructive",
              duration: 8000,
            });
          } else if (newAttempts >= MAX_ATTEMPTS) {
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
        // Prevent rapid registration attempts (rate limit protection)
        const now = Date.now();
        const timeSinceLastAttempt = now - lastRegistrationAttempt;
        if (timeSinceLastAttempt < REGISTRATION_COOLDOWN_MS && lastRegistrationAttempt > 0) {
          const waitTime = Math.ceil((REGISTRATION_COOLDOWN_MS - timeSinceLastAttempt) / 1000);
          toast({
            title: "Poczekaj chwilę",
            description: `Odczekaj ${waitTime} sekund przed ponowną próbą rejestracji`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        setLastRegistrationAttempt(now);
        
        const { error } = await signUp(email.trim().toLowerCase(), password, fullName.trim(), phone.trim());
        if (error) {
          // Handle rate limit error specifically
          if (error.message?.toLowerCase().includes("rate limit") || 
              error.message?.toLowerCase().includes("too many requests") ||
              error.message?.toLowerCase().includes("email rate limit")) {
            toast({
              title: "Za dużo prób",
              description: "System wykrył zbyt wiele prób rejestracji. Poczekaj 60 sekund i spróbuj ponownie.",
              variant: "destructive",
              duration: 10000,
            });
            // Set a longer cooldown after rate limit
            setLastRegistrationAttempt(now + 57000); // Effective 60s cooldown
          } else if (error.message?.toLowerCase().includes("already registered") ||
                     error.message?.toLowerCase().includes("user already exists")) {
            toast({
              title: "Email już zarejestrowany",
              description: "To konto już istnieje. Spróbuj się zalogować lub użyj opcji 'Zapomniałeś hasła?'",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Błąd rejestracji",
              description: error.message || "Nie udało się utworzyć konta",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Sprawdź swoją skrzynkę email! 📧",
            description: "Wysłaliśmy link weryfikacyjny na podany adres email. Kliknij w link, aby aktywować konto.",
            duration: 10000,
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
    setPhone("");
    setErrors({});
    setEmailWarning(null);
    setView("login");
    // Don't reset lastRegistrationAttempt to maintain cooldown across form resets
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
                    onBlur={handleEmailBlur}
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
                    className="space-y-4"
                  >
                    <div>
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
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 font-body">
                        Numer telefonu
                      </label>
                      <Input
                        type="tel"
                        placeholder="+48 123 456 789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-card"
                        disabled={isLoading || isLockedOut}
                        maxLength={20}
                        autoComplete="tel"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailWarning(null);
                    }}
                    onBlur={handleEmailBlur}
                    className="bg-card"
                    required
                    disabled={isLoading || isLockedOut}
                    maxLength={255}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                  {emailWarning && !errors.email && (
                    <motion.p 
                      className="text-sm text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {emailWarning}
                    </motion.p>
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
                    minLength={8}
                    maxLength={72}
                    disabled={isLoading || isLockedOut}
                    autoComplete={view === "login" ? "current-password" : "new-password"}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">{errors.password}</p>
                  )}
                  {view === "register" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Min. 8 znaków, wielka i mała litera oraz cyfra
                    </p>
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
                    setEmailWarning(null);
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
