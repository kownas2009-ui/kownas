import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Beaker, Check, X, Trophy, RotateCcw, Sparkles, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";

const quizQuestions = [
  {
    question: "Jaki jest symbol chemiczny złota?",
    options: ["Go", "Au", "Ag", "Gd"],
    correct: 1,
    explanation: "Au pochodzi od łacińskiej nazwy złota - Aurum"
  },
  {
    question: "Ile elektronów ma atom tlenu?",
    options: ["6", "8", "10", "12"],
    correct: 1,
    explanation: "Tlen ma liczbę atomową 8, więc ma 8 elektronów"
  },
  {
    question: "Co jest głównym składnikiem powietrza?",
    options: ["Tlen", "Azot", "Argon", "CO₂"],
    correct: 1,
    explanation: "Azot stanowi około 78% powietrza atmosferycznego"
  },
  {
    question: "Jaki jest wzór wody?",
    options: ["HO₂", "H₂O", "OH", "H₂O₂"],
    correct: 1,
    explanation: "Woda składa się z 2 atomów wodoru i 1 atomu tlenu"
  },
  {
    question: "Który pierwiastek ma symbol Fe?",
    options: ["Fluor", "Fosfor", "Żelazo", "Francez"],
    correct: 2,
    explanation: "Fe pochodzi od łacińskiej nazwy żelaza - Ferrum"
  }
];

const ChemistryQuiz = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (index: number) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
    setIsPlaying(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) return "Perfekcyjnie! 🎉 Jesteś mistrzem chemii!";
    if (percentage >= 80) return "Świetnie! 🌟 Masz talent do chemii!";
    if (percentage >= 60) return "Nieźle! 👍 Jeszcze trochę nauki!";
    return "Nie poddawaj się! 💪 Chemia wymaga praktyki!";
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Atom className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">Mini Quiz</span>
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sprawdź swoją wiedzę! 🧪
          </h2>
          <p className="text-lg text-muted-foreground font-body">
            Rozwiąż szybki quiz i zobacz jak dobrze znasz chemię
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-3xl p-8 text-center shadow-soft"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Beaker className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              
              <h3 className="font-display text-2xl font-bold mb-4">
                Quiz Chemiczny
              </h3>
              <p className="text-muted-foreground mb-6">
                5 pytań • ~2 minuty • Sprawdź się!
              </p>
              
              <Button
                onClick={() => setIsPlaying(true)}
                className="btn-ripple bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg rounded-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Rozpocznij Quiz
              </Button>
            </motion.div>
          ) : showResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-3xl p-8 text-center shadow-soft"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              
              <h3 className="font-display text-3xl font-bold mb-2">
                Wynik: {score}/{quizQuestions.length}
              </h3>
              <p className="text-xl text-muted-foreground mb-6">
                {getScoreMessage()}
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="px-6 py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Zagraj ponownie
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-card border border-border rounded-3xl p-8 shadow-soft"
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">
                  Pytanie {currentQuestion + 1} z {quizQuestions.length}
                </span>
                <div className="flex gap-1">
                  {quizQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i <= currentQuestion ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              <h3 className="font-display text-2xl font-bold mb-6 text-foreground">
                {quizQuestions[currentQuestion].question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => {
                  const isCorrect = index === quizQuestions[currentQuestion].correct;
                  const isSelected = selectedAnswer === index;
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={answered}
                      className={`w-full p-4 rounded-xl text-left transition-all border ${
                        answered
                          ? isCorrect
                            ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300"
                            : isSelected
                              ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300"
                              : "bg-muted/50 border-border opacity-50"
                          : "bg-muted/30 border-border hover:bg-primary/10 hover:border-primary"
                      }`}
                      whileHover={!answered ? { scale: 1.02 } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-body">{option}</span>
                        {answered && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            {isCorrect ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : isSelected ? (
                              <X className="w-5 h-5 text-red-500" />
                            ) : null}
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20"
                  >
                    <p className="text-sm text-foreground">
                      💡 {quizQuestions[currentQuestion].explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ChemistryQuiz;
