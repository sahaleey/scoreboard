import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { results } from "../data/results";
import {
  Search,
  X,
  Award,
  Crown,
  Trophy,
  Users,
  Hash,
  Star,
  Filter,
  ChevronDown,
} from "lucide-react";

const ProgramResults = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Flatten placements for searching
  const flattened = results.flatMap((program) =>
    program.placements.map((placement) => ({
      ...placement,
      programName: program.programName,
      programId: program.programId,
    }))
  );

  // Get unique categories for filtering
  const categories = [
    "all",
    ...new Set(flattened.map((item) => item.category).filter(Boolean)),
  ];

  // Filter based on search and category
  const filteredResults = flattened.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.programName.toLowerCase().includes(search) ||
      item.category?.toLowerCase().includes(search) ||
      item.studentId?.toLowerCase().includes(search) ||
      item.grade?.toLowerCase().includes(search);

    const matchesCategory =
      activeFilter === "all" || item.category === activeFilter;

    return matchesSearch && matchesCategory;
  });

  // Group by programName
  const groupedByProgram = filteredResults.reduce((acc, result) => {
    if (!acc[result.programName]) acc[result.programName] = [];
    acc[result.programName].push(result);
    return acc;
  }, {});

  const podiumLayout = (placements) => {
    const first = placements.find((p) => p.position === 1);
    const second = placements.find((p) => p.position === 2);
    const third = placements.find((p) => p.position === 3);
    return { first, second, third };
  };

  // Pastel gradient generator for student badges
  const getStudentBadgeStyle = (position) => {
    const gradients = {
      1: "bg-gradient-to-br from-amber-100 to-amber-200 shadow-[0_4px_12px_rgba(245,158,11,0.25)]",
      2: "bg-gradient-to-br from-blue-50 to-blue-100 shadow-[0_4px_12px_rgba(59,130,246,0.2)]",
      3: "bg-gradient-to-br from-rose-50 to-rose-100 shadow-[0_4px_12px_rgba(236,72,153,0.2)]",
      default:
        "bg-gradient-to-br from-gray-50 to-gray-100 shadow-[0_4px_8px_rgba(156,163,175,0.1)]",
    };
    return gradients[position] || gradients.default;
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="h-4 w-4 text-amber-600" />;
      case 2:
        return <Trophy className="h-4 w-4 text-blue-600" />;
      case 3:
        return <Award className="h-4 w-4 text-rose-600" />;
      default:
        return <Star className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl   font-bold text-slate-800 mb-2"
          >
            Program{" "}
            <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Results
            </span>
          </motion.h1>
          <p className="text-slate-500   max-w-2xl mx-auto">
            Browse competition results and celebrate student achievements across
            all programs
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search programs, students, or grades..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearching(e.target.value.length > 0);
                }}
                className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-white border border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 outline-none shadow-sm   transition-all duration-200"
              />
              <AnimatePresence>
                {isSearching && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => {
                      setSearchTerm("");
                      setIsSearching(false);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-slate-400 hover:text-sky-600" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" />
              </div>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="pl-10 pr-8 py-3.5 rounded-xl bg-white border border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-200   appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {Object.keys(groupedByProgram).length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Object.keys(groupedByProgram).map((programName) => {
              const placements = groupedByProgram[programName];
              const { first, second, third } = podiumLayout(placements);

              return (
                <motion.div
                  layoutId={programName}
                  key={programName}
                  className="bg-white rounded-2xl shadow-xs p-5 border border-slate-100/70 cursor-pointer hover:shadow-sm transition-all"
                  onClick={() => setSelectedProgram(programName)}
                  whileHover={{ y: -5 }}
                >
                  <h2 className="text-xl   font-semibold mb-5 text-center text-slate-800">
                    {programName}
                  </h2>
                  <div className="flex justify-center items-end gap-4 h-40">
                    {/* Second place */}
                    {second && (
                      <motion.div
                        className="flex flex-col items-center"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.1, type: "spring" }}
                      >
                        <div
                          className={`w-16 h-16 flex items-center justify-center rounded-full mb-2 ${getStudentBadgeStyle(
                            2
                          )}`}
                        >
                          <span className="  font-medium text-blue-700">
                            {second.studentId}
                          </span>
                        </div>
                        <div className="px-3 py-1 bg-blue-50 rounded-full flex items-center">
                          {getPositionIcon(2)}
                          <span className="text-xs   font-medium text-blue-600 ml-1">
                            2nd
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* First place */}
                    {first && (
                      <motion.div
                        className="flex flex-col items-center"
                        initial={{ y: 0 }}
                        animate={{ y: -10 }}
                        transition={{ type: "spring" }}
                      >
                        <div
                          className={`w-20 h-20 flex items-center justify-center rounded-full mb-2 ${getStudentBadgeStyle(
                            1
                          )}`}
                        >
                          <span className="  font-medium text-amber-700">
                            {first.studentId}
                          </span>
                        </div>
                        <div className="px-3 py-1 bg-amber-50 rounded-full flex items-center">
                          {getPositionIcon(1)}
                          <span className="text-xs   font-bold text-amber-600 ml-1">
                            1st
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Third place */}
                    {third && (
                      <motion.div
                        className="flex flex-col items-center"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <div
                          className={`w-16 h-16 flex items-center justify-center rounded-full mb-2 ${getStudentBadgeStyle(
                            3
                          )}`}
                        >
                          <span className="  font-medium text-rose-700">
                            {third.studentId}
                          </span>
                        </div>
                        <div className="px-3 py-1 bg-rose-50 rounded-full flex items-center">
                          {getPositionIcon(3)}
                          <span className="text-xs   font-medium text-rose-600 ml-1">
                            3rd
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs   text-slate-500">
                      {placements.length} participant
                      {placements.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-xs border border-slate-100/70"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg   font-medium text-slate-700 mb-2">
              No results found
            </h3>
            <p className="text-slate-500  ">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
              className="mt-4 text-sm   font-medium text-amber-600 hover:text-amber-700"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedProgram && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setSelectedProgram(null)}
              />

              <motion.div
                layoutId={selectedProgram}
                className="fixed inset-0 flex items-center justify-center z-50 px-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.2 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                  <motion.button
                    onClick={() => setSelectedProgram(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-sky-600 z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>

                  <div className="p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-sky-800 mb-10">
                      {selectedProgram}
                    </h2>

                    {(() => {
                      const placements = groupedByProgram[selectedProgram];
                      const { first, second, third } = podiumLayout(placements);
                      const others = placements.filter(
                        (p) => p.position > 3 || !p.position
                      );

                      return (
                        <>
                          {/* Podium */}
                          <div className="flex justify-center items-end gap-6 mb-10 h-48">
                            {/* Second place */}
                            {second && (
                              <motion.div
                                className="flex flex-col items-center"
                                initial={{ y: 40 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.1, type: "spring" }}
                              >
                                <div
                                  className={`w-20 h-20 flex items-center justify-center rounded-full mb-3 ${getStudentBadgeStyle(
                                    2
                                  )}`}
                                >
                                  <span className="  font-medium text-blue-700 text-lg">
                                    {second.studentId}
                                  </span>
                                </div>
                                <div className="px-4 py-1.5 bg-blue-50 rounded-full shadow-inner flex items-center">
                                  {getPositionIcon(2)}
                                  <span className="text-sm   font-medium text-blue-600 ml-1.5">
                                    Second Place
                                  </span>
                                </div>
                                {second.grade ? (
                                  <div className="mt-2 px-3 py-1 bg-white border border-blue-100 rounded-full">
                                    <span className="text-xs   text-blue-500">
                                      Grade: {second.grade}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mt-2 px-3 py-1 bg-white border border-slate-100 rounded-full">
                                    <span className="text-xs   text-slate-400">
                                      No grade
                                    </span>
                                  </div>
                                )}
                              </motion.div>
                            )}

                            {/* First place */}
                            {first && (
                              <motion.div
                                className="flex flex-col items-center"
                                initial={{ y: 0 }}
                                animate={{ y: -20 }}
                                transition={{ type: "spring" }}
                              >
                                <div
                                  className={`w-24 h-24 flex items-center justify-center rounded-full mb-3 ${getStudentBadgeStyle(
                                    1
                                  )}`}
                                >
                                  <span className="  font-medium text-amber-700 text-xl">
                                    {first.studentId}
                                  </span>
                                </div>
                                <div className="px-4 py-1.5 bg-amber-50 rounded-full shadow-inner flex items-center">
                                  {getPositionIcon(1)}
                                  <span className="text-sm   font-bold text-amber-600 ml-1.5">
                                    First Place
                                  </span>
                                </div>
                                {first.grade ? (
                                  <div className="mt-2 px-3 py-1 bg-white border border-amber-100 rounded-full">
                                    <span className="text-xs   text-amber-500">
                                      Grade: {first.grade}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mt-2 px-3 py-1 bg-white border border-slate-100 rounded-full">
                                    <span className="text-xs   text-slate-400">
                                      No grade
                                    </span>
                                  </div>
                                )}
                              </motion.div>
                            )}

                            {/* Third place */}
                            {third && (
                              <motion.div
                                className="flex flex-col items-center"
                                initial={{ y: 40 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.2, type: "spring" }}
                              >
                                <div
                                  className={`w-20 h-20 flex items-center justify-center rounded-full mb-3 ${getStudentBadgeStyle(
                                    3
                                  )}`}
                                >
                                  <span className="  font-medium text-rose-700 text-lg">
                                    {third.studentId}
                                  </span>
                                </div>
                                <div className="px-4 py-1.5 bg-rose-50 rounded-full shadow-inner flex items-center">
                                  {getPositionIcon(3)}
                                  <span className="text-sm   font-medium text-rose-600 ml-1.5">
                                    Third Place
                                  </span>
                                </div>
                                {third.grade ? (
                                  <div className="mt-2 px-3 py-1 bg-white border border-rose-100 rounded-full">
                                    <span className="text-xs   text-rose-500">
                                      Grade: {third.grade}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mt-2 px-3 py-1 bg-white border border-slate-100 rounded-full">
                                    <span className="text-xs   text-slate-400">
                                      No grade
                                    </span>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </div>

                          {/* Other participants */}
                          <div className="mt-8">
                            <h3 className="  text-lg text-slate-700 mb-4 text-center flex items-center justify-center">
                              <Users className="h-5 w-5 mr-2 text-slate-500" />
                              All Participants
                            </h3>

                            {others.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {others.map((p, i) => (
                                  <motion.div
                                    key={i}
                                    className="p-3 rounded-xl text-center bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200"
                                    whileHover={{ y: -3 }}
                                    transition={{ type: "spring" }}
                                  >
                                    <div
                                      className={`w-12 h-12 mx-auto flex items-center justify-center rounded-full mb-2 ${getStudentBadgeStyle(
                                        "default"
                                      )}`}
                                    >
                                      <span className="  font-medium text-slate-700 text-sm">
                                        {p.studentId}
                                      </span>
                                    </div>
                                    <div className="  text-sm text-slate-700 flex items-center justify-center">
                                      <Hash className="h-3 w-3 mr-1 text-slate-500" />
                                      {p.studentId}
                                    </div>
                                    {p.grade ? (
                                      <div className="text-xs   text-amber-600 mt-1 px-2 py-1 bg-white rounded-full inline-block border border-amber-100">
                                        Grade: {p.grade}
                                      </div>
                                    ) : (
                                      <div className="text-xs   text-slate-400 mt-1 px-2 py-1 bg-white rounded-full inline-block border border-slate-100">
                                        No grade
                                      </div>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <div className="inline-block px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
                                  <span className="  text-slate-400">
                                    No other participants
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProgramResults;
