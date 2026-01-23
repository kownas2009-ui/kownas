import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Kasia M.",
    role: "Uczennica liceum",
    content: "Dzięki pani Anecie zdałam maturę rozszerzoną z chemii na 85%! Tłumaczy cierpliwie i zawsze znajduje czas na dodatkowe pytania.",
    rating: 5
  },
  {
    name: "Tomek K.",
    role: "Uczeń 8 klasy",
    content: "Chemia przestała być straszna! Teraz nawet lubię rozwiązywać zadania. Polecam każdemu!",
    rating: 5
  },
  {
    name: "Anna W.",
    role: "Mama ucznia",
    content: "Syn znacznie poprawił oceny z chemii i fizyki. Pani Aneta ma niesamowitą cierpliwość i umiejętność tłumaczenia trudnych zagadnień.",
    rating: 5
  },
  {
    name: "Michał P.",
    role: "Uczeń technikum",
    content: "Profesjonalne podejście i świetne materiały. Zajęcia online są bardzo wygodne i efektywne.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Co mówią uczniowie?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Opinie moich uczniów i ich rodziców
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative p-8 rounded-2xl bg-background border border-border shadow-soft group"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl gradient-hero flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <Quote className="w-5 h-5 text-primary-foreground" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-secondary text-secondary" />
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground font-body mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground font-body">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Hover effect gradient */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.03) 0%, hsl(var(--secondary) / 0.03) 100%)"
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
