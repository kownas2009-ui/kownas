import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import AuthDialog from "./AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { FlaskConical, Menu, X, User, LogOut, Shield, BookOpen, Beaker, GraduationCap, HelpCircle, Calendar, Star, Sparkles, Atom } from "lucide-react";
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
              className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center relative overflow-hidden"
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <FlaskConical className="w-5 h-5 text-primary-foreground relative z-10" />
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
            <span className="font-display text-xl font-bold text-foreground">Aneta</span>
          </motion.a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="relative text-muted-foreground hover:text-foreground transition-colors font-body font-medium cursor-pointer group flex items-center gap-1.5 px-3 py-2 rounded-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ 
                  y: -3,
                  backgroundColor: "hsl(var(--primary) / 0.1)"
                }}
              >
                {/* Icon with animation */}
                <motion.div
                  className="relative"
                  whileHover={{ 
                    rotate: [0, -15, 15, 0],
                    scale: 1.2 
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                  
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30 blur-md opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
                
                <span className="text-sm group-hover:text-foreground transition-colors">{link.label}</span>
                
                {/* Animated underline */}
                <motion.span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full group-hover:w-4/5"
                  transition={{ duration: 0.3 }}
                />
                
                {/* Sparkle effect on hover */}
                <motion.div
                  className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                >
                  <Sparkles className="w-3 h-3 text-secondary" />
                </motion.div>
                
                {/* Particle effects */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-primary/50 opacity-0 group-hover:opacity-100"
                    style={{
                      left: `${30 + i * 20}%`,
                      top: "50%"
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                ))}
              </motion.a>
            ))}
            
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="default" className="relative overflow-hidden group">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute inset-0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </motion.div>
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
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="hero" size="default" className="relative overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </motion.div>
                    <User className="w-4 h-4 mr-2" />
                    Zaloguj się
                    
                    {/* Orbiting particle */}
                    <motion.div
                      className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
                      animate={{
                        rotate: 360
                      }}
                      style={{
                        x: 30,
                        y: 0,
                        originX: "-30px"
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </Button>
                </motion.div>
              </AuthDialog>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground rounded-xl hover:bg-primary/10 transition-colors"
            whileTap={{ scale: 0.9 }}
            whileHover={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}
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
