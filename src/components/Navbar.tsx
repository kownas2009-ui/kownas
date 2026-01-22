import { useState } from "react";
import { Button } from "@/components/ui/button";
import BookingDialog from "./BookingDialog";
import { Atom, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Start", href: "#" },
    { label: "O mnie", href: "#about" },
    { label: "Oferta", href: "#services" },
    { label: "Kontakt", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a 
            href="#" 
            className="flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#");
            }}
          >
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Atom className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Aneta</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors font-body font-medium cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <BookingDialog lessonType="Umów lekcję">
              <Button variant="hero" size="default">
                Umów lekcję
              </Button>
            </BookingDialog>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-body font-medium py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
              <BookingDialog lessonType="Umów lekcję">
                <Button variant="hero" size="default" className="mt-2">
                  Umów lekcję
                </Button>
              </BookingDialog>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
