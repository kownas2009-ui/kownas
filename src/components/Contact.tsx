import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import MoleculeDecoration from "./MoleculeDecoration";

const Contact = () => {
  return (
    <section className="py-24 px-4 bg-card/50 relative overflow-hidden">
      {/* Background decoration */}
      <MoleculeDecoration className="absolute -bottom-20 -right-20 w-96 h-96 opacity-20" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Skontaktuj się ze mną
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Masz pytania? Chętnie odpowiem i pomogę dobrać odpowiedni plan zajęć.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Telefon
                </h3>
                <p className="text-muted-foreground font-body">+48 123 456 789</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Email
                </h3>
                <p className="text-muted-foreground font-body">aneta@korepetycje.pl</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Lokalizacja
                </h3>
                <p className="text-muted-foreground font-body">
                  Zajęcia stacjonarne i online
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-border shadow-soft mt-8">
              <p className="font-display text-lg text-foreground italic">
                "Chemia to nie magia — to logika, którą można zrozumieć. Pozwól mi Ci to pokazać."
              </p>
              <p className="text-primary font-semibold mt-3">— Aneta</p>
            </div>
          </div>

          {/* Contact form */}
          <div className="p-8 rounded-2xl bg-background border border-border shadow-card">
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    Imię
                  </label>
                  <Input placeholder="Twoje imię" className="bg-card" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    Telefon
                  </label>
                  <Input placeholder="+48 ..." className="bg-card" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-body">
                  Email
                </label>
                <Input type="email" placeholder="twoj@email.pl" className="bg-card" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-body">
                  Wiadomość
                </label>
                <Textarea
                  placeholder="Opisz swoje potrzeby, poziom nauki, dostępność..."
                  className="bg-card min-h-[120px]"
                />
              </div>

              <Button variant="hero" size="lg" className="w-full group">
                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                Wyślij wiadomość
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
