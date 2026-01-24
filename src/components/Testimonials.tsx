import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Kasia M.",
    role: "Uczennica liceum",
    content: "Dzięki pani Anecie zdałam maturę rozszerzoną z chemii na 85%! Tłumaczy cierpliwie i zawsze znajduje czas na dodatkowe pytania.",
    rating: 5,
    avatar: null,
    initials: "KM",
    color: "from-pink-400 to-rose-500"
  },
  {
    name: "Tomek K.",
    role: "Uczeń 8 klasy",
    content: "Chemia przestała być straszna! Teraz nawet lubię rozwiązywać zadania. Polecam każdemu!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop",
    initials: null,
    color: null
  },
  {
    name: "Anna W.",
    role: "Mama ucznia",
    content: "Syn znacznie poprawił oceny z chemii i fizyki. Pani Aneta ma niesamowitą cierpliwość i umiejętność tłumaczenia trudnych zagadnień.",
    rating: 5,
    avatar: null,
    initials: "AW",
    color: "from-emerald-400 to-teal-500"
  },
  {
    name: "Michał P.",
    role: "Uczeń technikum",
    content: "Profesjonalne podejście i świetne materiały. Zajęcia online są bardzo wygodne i efektywne.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&h=100&fit=crop",
    initials: null,
    color: null
  },
  {
    name: "Ola S.",
    role: "Studentka chemii",
    content: "Najlepsza korepetytorka jaką miałam! Dzięki niej pokochałam chemię organiczną.",
    rating: 5,
    avatar: null,
    initials: "OS",
    color: "from-violet-400 to-purple-500"
  },
  {
    name: "Piotr N.",
    role: "Tata uczennicy",
    content: "Córka z 2 na 5 w pół roku! Pani Aneta to prawdziwy profesjonalista.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop",
    initials: null,
    color: null
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <motion.div 
                  className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {testimonial.avatar ? (
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">{testimonial.initials}</span>
                    </div>
                  )}
                </motion.div>
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
