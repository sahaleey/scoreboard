import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { results, students } from "../data";
import { calcScore } from "../utils/calcScores";
import {
  Crown,
  Trophy,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

const toOrdinal = (n) =>
  n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;

const classToCategory = (cls) => {
  if (cls === 1) return "Bidaya";
  if (cls === 2 || cls === 3) return "Ula";
  if (cls === 4 || cls === 5) return "Thaniyyah";
  if (cls === 6 || cls === 7) return "Thanawiyyah";
  if (cls === 8 || cls === 9) return "Aliyah";
  return "Unknown";
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getPositionIcon = (position) => {
  switch (position) {
    case 1:
      return <Crown className="h-4 w-4 text-amber-500" />;
    case 2:
      return <Trophy className="h-4 w-4 text-blue-500" />;
    case 3:
      return <Award className="h-4 w-4 text-rose-500" />;
    default:
      return <Sparkles className="h-4 w-4 text-purple-500" />;
  }
};

const getPositionColor = (position) => {
  switch (position) {
    case 1:
      return "from-amber-400 to-amber-500 text-white";
    case 2:
      return "from-blue-400 to-blue-500 text-white";
    case 3:
      return "from-rose-400 to-rose-500 text-white";
    default:
      return "from-purple-400 to-purple-500 text-white";
  }
};

export default function AllRoundToppers() {
  const toppers = useMemo(() => {
    const scoreByStudent = new Map();

    results.forEach((program) => {
      program.placements.forEach((p) => {
        const posStr = toOrdinal(p.position);
        const pts = calcScore(posStr, p.grade);
        scoreByStudent.set(
          p.studentId,
          (scoreByStudent.get(p.studentId) || 0) + pts
        );
      });
    });

    const rows = Array.from(scoreByStudent.entries()).map(
      ([studentId, total]) => {
        const stu = students.find((s) => s.id === studentId);
        return {
          studentId,
          total,
          name: stu?.name || "Unknown",
          team: stu?.team || "—",
          class: stu?.class ?? "—",
          category:
            typeof stu?.class === "number" ? classToCategory(stu.class) : "—",
        };
      }
    );

    rows.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

    // Assign rank positions
    return rows.slice(0, 5).map((row, i) => ({
      ...row,
      position: i + 1,
    }));
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(toppers.length / itemsPerPage);
  const currentItems = toppers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    if (toppers.length <= itemsPerPage) return;
    const t = setInterval(() => {
      setDirection(1);
      setCurrentPage((page) => (page + 1) % totalPages);
    }, 5000);
    return () => clearInterval(t);
  }, [toppers.length, totalPages, itemsPerPage]);

  const goPrev = () => {
    setDirection(-1);
    setCurrentPage((page) => (page - 1 + totalPages) % totalPages);
  };

  const goNext = () => {
    setDirection(1);
    setCurrentPage((page) => (page + 1) % totalPages);
  };

  if (!toppers.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-xs p-8 border border-slate-100/70 text-center"
      >
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
          <Star className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl      font-bold text-slate-700 mb-2">
          All-Round Toppers
        </h3>
        <p className="text-slate-500">No topper data available yet.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-xs p-6 border border-slate-100/70"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl      font-bold text-slate-800 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" /> All-Round Toppers
        </h3>
        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
          Top {toppers.length} Students
        </span>
      </div>

      {/* Grid Layout */}
      <div className="relative overflow-hidden min-h-[380px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentItems.map((topper) => (
              <motion.div
                key={topper.studentId}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white      font-bold text-sm">
                        {initials(topper.name)}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-r ${getPositionColor(
                          topper.position
                        )}`}
                      >
                        {topper.position}
                      </div>
                    </div>
                    <div>
                      <h4 className="     font-semibold text-slate-800 text-sm leading-tight">
                        {topper.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Ad No: {topper.studentId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {getPositionIcon(topper.position)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                    Team {topper.team}
                  </span>
                  <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                    Class {topper.class}
                  </span>
                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                    {topper.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Total Points</p>
                    <p className="     font-bold text-amber-600 text-lg">
                      {topper.total}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-gradient-to-r ${getPositionColor(
                      topper.position
                    )}`}
                  >
                    {getPositionIcon(topper.position)}
                    {toOrdinal(topper.position)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm      text-slate-500">
            Page {currentPage + 1} of {totalPages}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
              whileTap={{ scale: 0.95 }}
              onClick={goPrev}
              disabled={currentPage === 0}
              className="h-10 w-10 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </motion.button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setDirection(i > currentPage ? 1 : -1);
                    setCurrentPage(i);
                  }}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === currentPage ? "bg-amber-500" : "bg-slate-300"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              disabled={currentPage === totalPages - 1}
              className="h-10 w-10 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
