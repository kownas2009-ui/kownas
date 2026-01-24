import { useState, useRef, useEffect } from "react";
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
import { LogIn, UserPlus, Loader2, ShieldAlert } from "lucide-react";
import { z } from "zod";

interface AuthDialogProps {
  children: React.ReactNode;
}

const emailSchema = z.string().trim().email("Nieprawidłowy adres email").max(255);
const passwordSchema = z.string().min(6, "Hasło musi mieć min. 6 znaków").max(72, "Hasło max 72 znaki");
const fullNameSchema = z.string().trim().min(2, "Imię i nazwisko wymagane").max(100, "Max 100 znaków");

// Rate limiting configuration
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60000; // 1 minute

const AuthDialog = ({ children }: AuthDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
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

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0]?.message;
    }

    if (!isLogin) {
      const nameResult = fullNameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.fullName = nameResult.error.errors[0]?.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      if (isLogin) {
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
      } else {
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
    setIsLogin(true);
  };

  const isLockedOut = lockedUntil && Date.now() < lockedUntil;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-background">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            {isLogin ? "Logowanie" : "Rejestracja"}
          </DialogTitle>
          <DialogDescription className="font-body">
            {isLogin
              ? "Zaloguj się do swojego konta ucznia"
              : "Utwórz nowe konto ucznia"}
          </DialogDescription>
        </DialogHeader>

        {isLockedOut && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>Zbyt wiele prób. Odczekaj {lockoutRemaining}s</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {!isLogin && (
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
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isLoading || isLockedOut}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Zaloguj się
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Zarejestruj się
              </>
            )}
          </Button>
        </form>

        <div className="text-center pb-4">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="text-sm text-primary hover:underline font-body"
            disabled={isLoading}
          >
            {isLogin
              ? "Nie masz konta? Zarejestruj się"
              : "Masz już konto? Zaloguj się"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
