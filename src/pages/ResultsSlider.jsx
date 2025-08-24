import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Hash,
  Search,
  Trophy,
  Award,
  Crown,
  Star,
  Calendar,
  Users,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { results, students } from "../data";

// 🔹 Calculate score from position + grade
const getPoints = (position, grade) => {
  let base = 0;
  if (position === 1) base = 7;
  if (position === 2) base = 5;
  if (position === 3) base = 3;

  let gradeBonus = 0;
  if (grade === "A") gradeBonus = 3;
  if (grade === "B") gradeBonus = 1;

  return base + gradeBonus;
};

// Get medal icon based on position
const getMedalIcon = (position) => {
  switch (position) {
    case 1:
      return <Crown className="h-5 w-5 text-amber-500" />;
    case 2:
      return <Trophy className="h-5 w-5 text-blue-500" />;
    case 3:
      return <Award className="h-5 w-5 text-rose-500" />;
    default:
      return <Sparkles className="h-5 w-5 text-purple-500" />;
  }
};

// Get background color based on position
const getPositionColor = (position) => {
  switch (position) {
    case 1:
      return "bg-gradient-to-br from-amber-500 to-amber-600";
    case 2:
      return "bg-gradient-to-br from-blue-500 to-blue-600";
    case 3:
      return "bg-gradient-to-br from-rose-500 to-rose-600";
    default:
      return "bg-gradient-to-br from-purple-500 to-purple-600";
  }
};

// Get student name by ID
const getStudentName = (studentId) => {
  const student = students.find((s) => s.id === studentId);
  return student ? student.name : "Unknown Student";
};

export default function ResultsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const scrollContainerRef = useRef(null);

  // Filter results: separate placements with positions and those with only grades
  const filteredResults = results.map((program) => {
    const withPosition = program.placements.filter((p) => p.position);
    const onlyGrades = program.placements.filter((p) => !p.position && p.grade);
    return { ...program, withPosition, onlyGrades };
  });

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || filteredResults.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % filteredResults.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoPlay, filteredResults.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredResults.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + filteredResults.length) % filteredResults.length
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  if (!filteredResults || filteredResults.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 bg-white rounded-2xl shadow-xs border border-slate-100/70"
      >
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
          <Search className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          No results available
        </h3>
        <p className="text-slate-500 max-w-md mx-auto">
          There are no program results to display at this time.
        </p>
      </motion.div>
    );
  }

  const currentProgram = filteredResults[currentIndex];
  const hasPositions = currentProgram?.withPosition?.length > 0;
  const hasGradesOnly = currentProgram?.onlyGrades?.length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Program Results</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 font-medium">
              {currentIndex + 1} of {filteredResults.length}
            </span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 p-1 shadow-xs">
        <button
          onClick={prevSlide}
          disabled={filteredResults.length <= 1}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
        </button>

        <button
          onClick={nextSlide}
          disabled={filteredResults.length <= 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
        </button>

        <div className="relative h-full overflow-hidden rounded-2xl min-h-[400px]">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
              className="w-full absolute"
            >
              <div className="bg-white rounded-2xl shadow-xs p-4 sm:p-6 border border-slate-100/70 h-full">
                {/* Program Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-blue-50 text-blue-600 shadow-sm">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {currentProgram?.programName || "Unnamed Program"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium">
                          <Calendar className="h-3 w-3 mr-1" />
                          Program ID: {currentProgram?.programId || "N/A"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-medium">
                          <Users className="h-3 w-3 mr-1" />
                          {currentProgram?.placements?.length || 0} Participants
                        </span>
                        {currentProgram?.placements?.[0]?.category && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs sm:text-sm font-medium">
                            {currentProgram.placements[0].category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placements with positions */}
                {hasPositions ? (
                  <div className="relative">
                    <div
                      ref={scrollContainerRef}
                      className="flex overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:overflow-visible hide-scrollbar"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {currentProgram.withPosition.map((p, idx) => {
                        const score = getPoints(p.position, p.grade);
                        const MedalIcon = getMedalIcon(p.position);
                        return (
                          <motion.div
                            key={`${p.studentId}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{
                              y: -8,
                              boxShadow:
                                "0 25px 50px -10px rgba(0, 0, 0, 0.15)",
                            }}
                            className="flex-shrink-0 w-72 md:w-auto md:flex-shrink md:min-h-0 bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:shadow-lg transition-all group relative mr-4 md:mr-0"
                          >
                            <div
                              className={`absolute -top-3 -right-3 h-14 w-14 rounded-full 
                                        ${getPositionColor(p.position)} 
                                        flex items-center justify-center text-white font-bold shadow-lg`}
                            >
                              <span className="text-lg">{p.position}</span>
                            </div>

                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-base">
                                  {p.studentId}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-slate-800 truncate text-sm">
                                    {getStudentName(p.studentId)}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                      Ad No: {p.studentId}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                                    {MedalIcon}
                                  </div>
                                  <span className="text-sm font-medium text-slate-700">
                                    Grade:{" "}
                                    <span className="font-bold">{p.grade}</span>
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-amber-600">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-base">
                                      {score}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-500">
                                    points
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Scroll indicator for mobile */}
                    <div className="md:hidden flex justify-center mt-4 space-x-1">
                      {currentProgram.withPosition.map((_, idx) => (
                        <div
                          key={idx}
                          className="h-1 w-1 rounded-full bg-slate-300"
                        ></div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Placements with only grades */}
                {hasGradesOnly && (
                  <div className="mt-6 border-t pt-2">
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">
                      More in Results Page
                    </h4>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      {filteredResults.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {filteredResults.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-500 scale-125"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
