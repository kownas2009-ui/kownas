import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Kasia M.",
    role: "Uczennica liceum",
    content: "Dzięki pani Anecie zdałam maturę rozszerzoną z chemii na 85%! Tłumaczy cierpliwie i zawsze znajduje czas na dodatkowe pytania.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    initials: null,
    color: null
  },
  {
    name: "Tomek K.",
    role: "Uczeń 8 klasy",
    content: "Chemia przestała być straszna! Teraz nawet lubię rozwiązywać zadania. Polecam każdemu!",
    rating: 5,
    avatar: null,
    initials: "TK",
    color: "from-blue-400 to-cyan-500"
  },
  {
    name: "Anna W.",
    role: "Mama ucznia",
    content: "Syn znacznie poprawił oceny z chemii i fizyki. Pani Aneta ma niesamowitą cierpliwość i umiejętność tłumaczenia trudnych zagadnień.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    initials: null,
    color: null
  },
  {
    name: "Michał P.",
    role: "Uczeń technikum",
    content: "Profesjonalne podejście i świetne materiały. Zajęcia online są bardzo wygodne i efektywne.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    initials: null,
    color: null
  },
  {
    name: "Ola S.",
    role: "Studentka chemii",
    content: "Najlepsza korepetytorka jaką miałam! Dzięki niej pokochałam chemię organiczną.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    initials: null,
    color: null
  },
  {
    name: "Piotr N.",
    role: "Tata uczennicy",
    content: "Córka z 2 na 5 w pół roku! Pani Aneta to prawdziwy profesjonalista.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    initials: null,
    color: null
  },
  {
    name: "Marta J.",
    role: "Uczennica liceum",
    content: "Świetne przygotowanie do matury! Wszystko jasne i klarowne.",
    rating: 5,
    avatar: null,
    initials: "MJ",
    color: "from-violet-400 to-purple-500"
  },
  {
    name: "Jakub L.",
    role: "Uczeń 3 klasy liceum",
    content: "Z chemii miałem 2, teraz mam 5. Magia!",
    rating: 5,
    avatar: null,
    initials: "J",
    color: "from-rose-400 to-pink-500"
  },
  {
    name: "Zosia K.",
    role: "Uczennica 2 liceum",
    content: "Pani Aneta tłumaczy tak, że naprawdę rozumiem! Super zajęcia.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
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
            Co mówią uczniowie oraz rodzice uczniów?
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
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative p-8 rounded-2xl bg-background border border-border shadow-soft group cursor-pointer"
            >
              {/* Quote icon */}
              <motion.div 
                className="absolute -top-4 -left-4 w-10 h-10 rounded-xl gradient-hero flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Quote className="w-5 h-5 text-primary-foreground" />
              </motion.div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
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
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--secondary) / 0.05) 100%)"
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
