import { useState, useEffect, useRef } from "react";
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
import { LogIn, UserPlus, Loader2, ShieldAlert, KeyRound, ArrowLeft, Mail, Sparkles, AlertTriangle, Shield } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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

// Enhanced input sanitization for XSS prevention
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
};

// Validate input doesn't contain SQL injection patterns
const containsSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\/\*|\*\/|;|\bOR\b\s+\d+=\d+|\bAND\b\s+\d+=\d+)/i,
    /(\bOR\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
    /'(\s|\S)*--/i,
  ];
  return sqlPatterns.some(pattern => pattern.test(input));
};

const fullNameSchema = z.string()
  .trim()
  .min(2, "Imię i nazwisko wymagane")
  .max(100, "Max 100 znaków")
  .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/, "Dozwolone tylko litery, spacje i myślniki")
  .refine((val) => !containsSqlInjection(val), { message: "Nieprawidłowe znaki w imieniu" });

const phoneSchema = z.string()
  .trim()
  .transform(val => val.replace(/\s/g, '')) // Remove spaces before validation
  .refine(val => /^\d{9}$/.test(val), {
    message: "Numer telefonu musi mieć dokładnie 9 cyfr (bez prefiksu +48)"
  });

// Rate limiting configuration
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60000; // 1 minute

// Debounce registration to prevent rate limits
const REGISTRATION_COOLDOWN_MS = 3000; // 3 seconds between registration attempts

type AuthView = "login" | "register" | "forgot-password" | "reset-sent" | "registration-success";

const AuthDialog = ({ children }: AuthDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; fullName?: string; phone?: string }>({});
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);
  
  // Rate limiting state
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [lastRegistrationAttempt, setLastRegistrationAttempt] = useState<number>(0);
  
  // hCaptcha state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  // Use env variable - must be configured with real hCaptcha key
  const hCaptchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "";
  
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
      // Validate password confirmation
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Hasła nie są identyczne";
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

  const handleResendVerification = async () => {
    const emailToUse = email.trim() || registeredEmail;
    
    const emailResult = emailSchema.safeParse(emailToUse);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0]?.message });
      return;
    }

    setResendLoading(true);
    try {
      // Try multiple methods to ensure email is sent
      // Method 1: Standard resend
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: emailToUse.toLowerCase(),
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      // Method 2: If resend doesn't work for existing accounts, try signUp again
      // This triggers a new confirmation email for unverified accounts
      if (!resendError) {
        await supabase.auth.signUp({
          email: emailToUse.toLowerCase(),
          password: 'temporary_resend_trigger_' + Date.now(), // Won't actually create account
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
      }

      if (resendError && resendError.message?.toLowerCase().includes("rate limit")) {
        toast({
          title: "Za dużo prób",
          description: "Poczekaj 60 sekund przed ponowną próbą wysłania emaila.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email wysłany! 📧",
          description: `Link weryfikacyjny został wysłany na ${emailToUse.toLowerCase()}. Sprawdź folder SPAM!`,
          duration: 10000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się wysłać emaila weryfikacyjnego",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Normalize phone number - extract digits only, remove leading 48 or +48
  const normalizePhone = (phoneNumber: string): string => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    // Remove leading 48 (country code)
    if (digitsOnly.startsWith('48') && digitsOnly.length > 9) {
      return digitsOnly.slice(2);
    }
    return digitsOnly;
  };

  const checkPhoneUniqueness = async (phoneNumber: string): Promise<boolean> => {
    if (!phoneNumber.trim()) return true;
    
    const normalizedInput = normalizePhone(phoneNumber);
    console.log('Checking phone uniqueness for:', normalizedInput);
    
    if (normalizedInput.length < 9) return true; // Too short to check
    
    try {
      // Fetch all phones from profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('phone')
        .not('phone', 'is', null);
      
      if (error) {
        console.error('Error checking phone uniqueness:', error);
        return true; // Allow registration if check fails
      }
      
      console.log('Existing phones in DB:', data);
      
      // Check if any existing phone matches when normalized
      const isDuplicate = data?.some(profile => {
        const existingNormalized = normalizePhone(profile.phone || '');
        console.log('Comparing:', normalizedInput, 'vs', existingNormalized);
        return existingNormalized === normalizedInput;
      });
      
      console.log('Is duplicate:', isDuplicate);
      return !isDuplicate; // Return true if phone is unique
    } catch (err) {
      console.error('Phone check error:', err);
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // For registration, check phone uniqueness and captcha FIRST before anything else
    if (view === "register") {
      // Check phone uniqueness BEFORE anything else
      setIsLoading(true);
      const isPhoneUnique = await checkPhoneUniqueness(phone.trim());
      setIsLoading(false);
      
      if (!isPhoneUnique) {
        setErrors({ phone: "Ten numer telefonu jest już używany" });
        return;
      }
      
      // Require captcha for registration - only if key is configured
      if (hCaptchaSiteKey && !captchaToken) {
        setCaptchaError("Potwierdź że nie jesteś robotem");
        toast({
          title: "Wymagana weryfikacja CAPTCHA",
          description: "Zaznacz pole 'Nie jestem robotem' przed rejestracją",
          variant: "destructive",
        });
        return;
      }
    }

    // Now check lockout (only for login, registration has its own cooldown)
    if (view === "login" && lockedUntil && Date.now() < lockedUntil) {
      toast({
        title: "Zbyt wiele prób",
        description: `Spróbuj ponownie za ${lockoutRemaining} sekund`,
        variant: "destructive",
      });
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
          const errorMsg = error.message?.toLowerCase() || '';
          if (errorMsg.includes("email not confirmed") || 
              errorMsg.includes("email_not_confirmed") ||
              errorMsg.includes("not confirmed") ||
              errorMsg.includes("confirm your email") ||
              errorMsg.includes("verify your email")) {
            // Save email and show registration success view with resend option
            setRegisteredEmail(email.trim().toLowerCase());
            setView("registration-success");
            // Don't count this as a failed attempt
            setAttempts(Math.max(0, newAttempts - 1));
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
          // Login successful - check if user is banned
          const { data: sessionData } = await supabase.auth.getSession();
          const userId = sessionData.session?.user?.id;
          
          if (userId) {
            // Check ban status
            const { data: banData } = await supabase.functions.invoke("check-user-banned", {
              body: { userId }
            });
            
            if (banData?.is_banned) {
              // User is banned - sign them out immediately
              await supabase.auth.signOut();
              toast({
                title: "🚫 Konto zbanowane",
                description: "Twoje konto zostało zablokowane. Nie możesz korzystać z serwisu. Jeśli uważasz, że to błąd, skontaktuj się z administratorem.",
                variant: "destructive",
                duration: 15000,
              });
              setIsLoading(false);
              return;
            }
          }
          
          setAttempts(0);
          toast({
            title: "Zalogowano pomyślnie! ✓",
            description: "Witaj ponownie!",
          });
          setIsOpen(false);
          resetForm();
        }
      } else if (view === "register") {
        // Security: Check for SQL injection attempts in all inputs
        const sanitizedFullName = sanitizeInput(fullName);
        if (containsSqlInjection(email) || containsSqlInjection(fullName) || containsSqlInjection(phone)) {
          toast({
            title: "Wykryto niedozwolone znaki",
            description: "Usuń specjalne znaki z formularza",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Format phone with +48 prefix and sanitize all inputs
        const formattedPhone = phone.trim() ? `+48${phone.replace(/\D/g, '')}` : '';
        const { error, data } = await signUp(
          sanitizeInput(email.trim().toLowerCase()), 
          password, 
          sanitizedFullName, 
          formattedPhone
        );
        
        const userEmail = email.trim().toLowerCase();
        
        // Check if this email already exists (identities will be empty or null for existing users)
        // This happens when: 1) user already verified, or 2) user was deleted but email still in system
        // Check if this email is banned
        const { data: bannedData } = await supabase
          .from("banned_users")
          .select("banned_email")
          .eq("banned_email", userEmail)
          .maybeSingle();
        
        if (bannedData) {
          toast({
            title: "🚫 Rejestracja niemożliwa",
            description: "Nie możesz założyć konta na ten adres email.",
            variant: "destructive",
            duration: 10000,
          });
          setIsLoading(false);
          return;
        }
        
        if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
          // User already exists - show appropriate message
          toast({
            title: "Konto już istnieje",
            description: "Na ten adres email już istnieje konto. Przejdź do logowania.",
            variant: "destructive",
            duration: 8000,
          });
          // Switch to login view with email pre-filled
          setEmail(userEmail);
          setPassword("");
          setView("login");
          setIsLoading(false);
          return;
        }
        
        if (error) {
          const errorMsg = error.message?.toLowerCase() || '';
          console.log('Registration error:', error.message);
          
          // Handle rate limit error
          if (errorMsg.includes("rate limit") || 
              errorMsg.includes("too many requests") ||
              errorMsg.includes("email rate limit") ||
              errorMsg.includes("429")) {
            toast({
              title: "Zbyt wiele prób",
              description: "Poczekaj 60 sekund przed ponowną próbą rejestracji.",
              variant: "destructive",
              duration: 12000,
            });
          } else if (errorMsg.includes("already registered") ||
                     errorMsg.includes("user already exists") ||
                     errorMsg.includes("already been registered")) {
            toast({
              title: "Email już zarejestrowany",
              description: "To konto już istnieje. Spróbuj się zalogować lub użyj opcji 'Zapomniałeś hasła?'",
              variant: "destructive",
            });
          } else if (errorMsg.includes("phone") || errorMsg.includes("unique") || errorMsg.includes("duplicate") || errorMsg.includes("database")) {
            setErrors({ phone: "Ten numer telefonu jest już używany. Wpisz inny numer." });
            toast({
              title: "Numer telefonu zajęty",
              description: "Ten numer telefonu jest już używany. Wpisz inny numer.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Błąd rejestracji",
              description: error.message || "Nie udało się utworzyć konta. Spróbuj ponownie.",
              variant: "destructive",
            });
          }
        } else {
          // New registration successful - show resend verification view
          setRegisteredEmail(userEmail);
          setEmail(userEmail);
          
          // Force resend confirmation email to make sure it's always sent
          try {
            await supabase.auth.resend({
              type: 'signup',
              email: userEmail,
              options: {
                emailRedirectTo: window.location.origin,
              }
            });
          } catch (resendError) {
            console.log('Resend attempted:', resendError);
          }
          
          toast({
            title: "Rejestracja udana! 🎉",
            description: `Sprawdź skrzynkę ${userEmail} i kliknij link weryfikacyjny.`,
            duration: 10000,
          });
          
          // Show registration success view with resend option
          setView("registration-success");
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
    setConfirmPassword("");
    setFullName("");
    setPhone("");
    setErrors({});
    setEmailWarning(null);
    setView("login");
    setCaptchaToken(null);
    setCaptchaError(null);
    captchaRef.current?.resetCaptcha();
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
          ) : view === "registration-success" ? (
            <motion.div
              key="registration-success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-6"
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Mail className="w-8 h-8 text-green-500" />
              </motion.div>
              <h3 className="font-display text-xl font-bold mb-2">Sprawdź swoją skrzynkę!</h3>
              <p className="text-muted-foreground font-body text-sm mb-4">
                Wysłaliśmy link weryfikacyjny na:<br />
                <strong className="text-foreground">{registeredEmail || email}</strong>
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Sprawdź też folder SPAM lub Oferty
              </p>
              
              <Button
                variant="outline"
                onClick={() => {
                  setView("login");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="gap-2 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Przejdź do logowania
              </Button>
              
              <div className="border-t pt-4 mt-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Nie przyszedł email weryfikujący?
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="text-xs text-primary hover:underline font-body inline-flex items-center gap-1"
                >
                  {resendLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Mail className="w-3 h-3" />
                  )}
                  Wyślij ponownie
                </button>
              </div>
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
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm font-medium">
                          +48
                        </span>
                        <Input
                          type="tel"
                          placeholder="123456789"
                          value={phone}
                          onChange={(e) => {
                            // Only allow digits, max 9
                            const cleaned = e.target.value.replace(/\D/g, '').slice(0, 9);
                            setPhone(cleaned);
                          }}
                          className="bg-card rounded-l-none"
                          disabled={isLoading || isLockedOut}
                          maxLength={9}
                          autoComplete="tel"
                        />
                      </div>
                      {errors.phone && (
                        <motion.div 
                          className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-destructive/10 border border-destructive/30"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                          <p className="text-sm text-destructive font-medium">{errors.phone}</p>
                        </motion.div>
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

                {view === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 font-body">
                      Powtórz hasło
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-card"
                      required
                      minLength={8}
                      maxLength={72}
                      disabled={isLoading || isLockedOut}
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* hCaptcha for registration - shown only if key is configured */}
                {view === "register" && hCaptchaSiteKey && (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Weryfikacja bezpieczeństwa</span>
                    </div>
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={hCaptchaSiteKey}
                      onVerify={(token) => {
                        setCaptchaToken(token);
                        setCaptchaError(null);
                      }}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => setCaptchaToken(null)}
                    />
                    {captchaError && (
                      <motion.p 
                        className="text-sm text-destructive font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {captchaError}
                      </motion.p>
                    )}
                    {!captchaToken && !captchaError && (
                      <p className="text-xs text-muted-foreground">
                        Zaznacz powyższe pole aby kontynuować
                      </p>
                    )}
                    {captchaToken && (
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        ✓ Zweryfikowano
                      </p>
                    )}
                  </div>
                )}

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
