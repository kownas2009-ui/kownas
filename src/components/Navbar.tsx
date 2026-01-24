import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import AuthDialog from "./AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Atom, Menu, X, User, LogOut, Shield, BookOpen, Beaker, GraduationCap, HelpCircle, Calendar, Star } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Start", href: "#", icon: Atom },
    { label: "O mnie", href: "#about", icon: GraduationCap },
    { label: "Jak działam", href: "#how-it-works", icon: Beaker },
    { label: "Oferta", href: "#services", icon: BookOpen },
    { label: "Opinie", href: "#testimonials", icon: Star },
    { label: "FAQ", href: "#faq", icon: HelpCircle },
    { label: "Kontakt", href: "#contact", icon: Calendar },
  ];

  const scrollToSection = (href: string) => {
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a 
            href="#" 
            className="flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Atom className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="font-display text-xl font-bold text-foreground">Aneta</span>
          </motion.a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="relative text-muted-foreground hover:text-foreground transition-colors font-body font-medium cursor-pointer group flex items-center gap-1.5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <link.icon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm">{link.label}</span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
            
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="default" className="relative overflow-hidden group">
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <User className="w-4 h-4 mr-2" />
                      Moje konto
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/panel")}>
                    <User className="w-4 h-4 mr-2" />
                    Panel ucznia
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Panel administratora
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Wyloguj się
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDialog>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="hero" size="default" className="relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <User className="w-4 h-4 mr-2" />
                    Zaloguj się
                  </Button>
                </motion.div>
              </AuthDialog>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="lg:hidden py-4 border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors font-body font-medium py-2 px-3 rounded-lg hover:bg-primary/5"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <link.icon className="w-4 h-4 text-primary" />
                    {link.label}
                  </motion.a>
                ))}
                {user ? (
                  <>
                    <Button variant="outline" className="mt-2" onClick={() => navigate("/panel")}>
                      <User className="w-4 h-4 mr-2" />
                      Panel ucznia
                    </Button>
                    {isAdmin && (
                      <Button variant="outline" onClick={() => navigate("/admin")}>
                        <Shield className="w-4 h-4 mr-2" />
                        Panel administratora
                      </Button>
                    )}
                    <Button variant="ghost" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Wyloguj się
                    </Button>
                  </>
                ) : (
                  <AuthDialog>
                    <Button variant="hero" size="default" className="mt-2">
                      <User className="w-4 h-4 mr-2" />
                      Zaloguj się
                    </Button>
                  </AuthDialog>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
