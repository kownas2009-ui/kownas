import { useState } from "react";
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
import { User, LogIn, UserPlus, Loader2 } from "lucide-react";

interface AuthDialogProps {
  children: React.ReactNode;
}

const AuthDialog = ({ children }: AuthDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Błąd logowania",
            description: "Nieprawidłowy email lub hasło",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Zalogowano pomyślnie! ✓",
            description: "Witaj ponownie!",
          });
          setIsOpen(false);
          resetForm();
        }
      } else {
        if (!fullName.trim()) {
          toast({
            title: "Uzupełnij wszystkie pola",
            description: "Podaj swoje imię i nazwisko",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
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
    setIsLogin(true);
  };

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
                disabled={isLoading}
              />
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
              disabled={isLoading}
            />
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
              disabled={isLoading}
            />
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
            onClick={() => setIsLogin(!isLogin)}
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
