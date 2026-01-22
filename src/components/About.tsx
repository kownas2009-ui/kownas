import { Heart, BookOpen, Users, Award } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Pasja do nauczania",
      description: "Chemia to moja wielka miłość, którą z radością dzielę się z uczniami.",
    },
    {
      icon: BookOpen,
      title: "Indywidualne podejście",
      description: "Każdy uczeń jest inny. Dostosuję metody nauczania do Twoich potrzeb.",
    },
    {
      icon: Users,
      title: "Cierpliwość",
      description: "Wierzę, że każdy może zrozumieć chemię. Wystarczy odpowiednie wsparcie.",
    },
    {
      icon: Award,
      title: "Doświadczenie",
      description: "Ponad 10 lat pracy z uczniami na różnych poziomach zaawansowania.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Dlaczego warto uczyć się ze mną?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Łączę wiedzę z empatią, tworząc przestrzeń, w której nauka staje się przyjemnością.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-background border border-border shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
