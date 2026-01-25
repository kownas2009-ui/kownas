import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Jak wyglądają zajęcia online?",
    answer: "Zajęcia odbywają się przez platformę Zoom lub Google Meet. Korzystam z tablicy interaktywnej, gdzie wspólnie rozwiązujemy zadania. Wszystkie materiały udostępniam po lekcji."
  },
  {
    question: "Czy można odwołać lekcję?",
    answer: "Tak, lekcję można odwołać bezpłatnie do 24 godzin przed planowanym terminem. W przypadku późniejszego odwołania pobierana jest opłata 50% wartości lekcji."
  },
  {
    question: "Jak często powinny odbywać się zajęcia?",
    answer: "Zalecam regularne zajęcia - raz w tygodniu dla utrzymania ciągłości nauki. Przed ważnymi sprawdzianami lub maturą możemy zwiększyć intensywność."
  },
  {
    question: "Co jest potrzebne do zajęć online?",
    answer: "Potrzebujesz komputera lub tabletu z kamerą i mikrofonem, stabilnego połączenia internetowego oraz zeszytu do notatek. Resztę materiałów dostarczam."
  },
  {
    question: "Czy pomagasz z zadaniami domowymi?",
    answer: "Tak! Możesz przesłać mi zdjęcie zadania przed lekcją, a wspólnie je omówimy. Wyjaśniam krok po kroku, żebyś zrozumiał metodę rozwiązywania."
  },
  {
    question: "Jak wygląda płatność?",
    answer: "Płatność odbywa się przez BLIK na 15 minut przed rozpoczęciem lekcji. Szczegóły płatności otrzymasz po potwierdzeniu rezerwacji."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Masz pytania?</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Często zadawane pytania
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-display font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-primary" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 text-muted-foreground font-body leading-relaxed border-t border-border pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
