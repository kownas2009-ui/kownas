import { Button } from "@/components/ui/button";
import BookingDialog from "./BookingDialog";
import { Check, Beaker, FlaskConical, Microscope } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Beaker,
      title: "Szkoła podstawowa",
      subtitle: "Chemia i Fizyka",
      price: "100",
      features: [
        "Podstawy chemii i fizyki",
        "Pomoc z zadaniami domowymi",
        "Przygotowanie do sprawdzianów",
        "Przygotowanie do konkursów",
      ],
      popular: false,
    },
    {
      icon: FlaskConical,
      title: "Liceum / Technikum",
      subtitle: "Chemia",
      price: "120",
      features: [
        "Chemia na poziomie rozszerzonym",
        "Przygotowanie do matury",
        "Rozwiązywanie zadań maturalnych",
        "Konsultacje przed egzaminem",
      ],
      popular: true,
    },
    {
      icon: Microscope,
      title: "Studia / Olimpiady",
      subtitle: "Chemia",
      price: "120",
      features: [
        "Zaawansowane zagadnienia",
        "Przygotowanie do olimpiad",
        "Chemia organiczna",
        "Biochemia i analityka",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Oferta zajęć
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Zajęcia online, tylko w weekendy. Każda lekcja trwa 60 minut.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${
                service.popular
                  ? "bg-primary text-primary-foreground border-primary shadow-card"
                  : "bg-card border-border shadow-soft hover:shadow-card"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-accent text-accent-foreground text-sm font-semibold">
                  Najpopularniejsze
                </div>
              )}

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  service.popular ? "bg-primary-foreground/20" : "gradient-hero"
                }`}
              >
                <service.icon
                  className={`w-7 h-7 ${
                    service.popular ? "text-primary-foreground" : "text-primary-foreground"
                  }`}
                />
              </div>

              <h3 className="font-display text-2xl font-bold mb-1">{service.title}</h3>
              <p className={`text-sm mb-4 ${service.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {service.subtitle}
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-display font-bold">{service.price}</span>
                <span className={`${service.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  zł / lekcja
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${
                        service.popular ? "text-secondary" : "text-primary"
                      }`}
                    />
                    <span
                      className={`font-body ${
                        service.popular ? "text-primary-foreground/90" : "text-muted-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <BookingDialog lessonType={service.title}>
                <Button
                  variant={service.popular ? "accent" : "hero"}
                  size="lg"
                  className="w-full"
                >
                  Wybierz pakiet
                </Button>
              </BookingDialog>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
