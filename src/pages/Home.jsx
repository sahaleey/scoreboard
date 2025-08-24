import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { results, students } from "../data";
import { calcScore } from "../utils/calcScores";
import AllRoundToppers from "./AllRoundToppers";

import { Star, Trophy, BarChart2, Award, Sparkles } from "lucide-react";
import ResultsSlider from "./ResultsSlider";

const toOrdinal = (n) =>
  n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;

export default function Home() {
  // map results
  const structuredResults = results
    .slice()
    .reverse()
    .map((program) => {
      const placements = program.placements.map((placement) => {
        const student = students.find((s) => s.id === placement.studentId);
        return {
          ...placement,
          studentName: student ? student.name : "Unknown Student",
          team: student ? student.team : "—",
          class: student ? student.class : "—",
          programName: program.programName,
          programId: program.programId,
          score: calcScore(toOrdinal(placement.position), placement.grade),
        };
      });
      return { ...program, placements };
    });

  // team scores
  const teamScores = {};
  structuredResults.forEach((prog) => {
    prog.placements.forEach((p) => {
      if (!teamScores[p.team]) teamScores[p.team] = 0;
      teamScores[p.team] += p.score;
    });
  });
  const sortedTeams = Object.entries(teamScores).sort((a, b) => b[1] - a[1]);

  // category wise topper teams
  const categoryScores = {};
  structuredResults.forEach((prog) => {
    prog.placements.forEach((p) => {
      if (!categoryScores[p.category]) categoryScores[p.category] = {};
      if (!categoryScores[p.category][p.team])
        categoryScores[p.category][p.team] = 0;
      categoryScores[p.category][p.team] += p.score;
    });
  });

  const categoryTopTeams = Object.entries(categoryScores).map(
    ([category, teams]) => {
      const sorted = Object.entries(teams).sort((a, b) => b[1] - a[1]);
      return { category, teams: sorted };
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-8xl mx-auto grid gap-8 lg:grid-cols-12">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header */}
          <div className="text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-2"
            >
              Art Fest{" "}
              <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                Scoreboard
              </span>
            </motion.h1>
            <p className="text-slate-500      max-w-2xl">
              Track performances, scores, and rankings across all art programs
              and competitions
            </p>
          </div>

          {/* Results Slider Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xs p-6 border border-slate-100/70"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-sky-50 text-sky-600 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Latest Highlights
              </h2>
            </div>

            <div className="relative">
              <ResultsSlider />
            </div>
          </motion.div>

          {/* All Round Toppers */}
          <div className="mt-8">
            <AllRoundToppers />
          </div>
        </div>

        {/* RIGHT SIDE: Team Scores */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-8 space-y-8">
            {/* Team Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xs p-6 border border-slate-100/70"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shadow-sm">
                  <Trophy className="h-5 w-5" />
                </div>
                <h2 className="text-xl      font-bold text-slate-800">
                  Team Leaderboard
                </h2>
              </div>

              <ul className="space-y-3">
                {sortedTeams.map(([team, score], i) => (
                  <motion.li
                    key={team}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
                          i === 0
                            ? "bg-amber-100 text-amber-800 shadow-sm"
                            : i === 1
                            ? "bg-blue-100 text-blue-800 shadow-sm"
                            : i === 2
                            ? "bg-rose-100 text-rose-800 shadow-sm"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className=" font-medium text-slate-700">
                        Team {team}
                      </span>
                    </div>
                    <span className="  font-bold text-emerald-600">
                      {score} pts
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xs p-6 border border-slate-100/70"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shadow-sm">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Quick Stats
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Total Programs</span>
                  <span className="font-bold text-blue-600">
                    {results.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm      text-slate-600">
                    Total Students
                  </span>
                  <span className=" font-bold text-purple-600">
                    {students.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm  text-slate-600">Total Teams</span>
                  <span className="     font-bold text-emerald-600">
                    {sortedTeams.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CATEGORY WISE TOPPER TEAMS */}
      <div className="max-w-7xl mx-auto mt-16 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left"
        >
          <h2 className="text-3xl      font-bold text-slate-800 mb-2 flex items-center justify-center md:justify-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <Trophy className="h-7 w-7" />
            </div>
            Category-wise Topper Teams
          </h2>
          <p className="text-slate-500      max-w-2xl mx-auto md:mx-0">
            Discover the leading teams across different competition categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categoryTopTeams.map((cat, catIndex) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-xs p-6 border border-slate-100/70 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl      font-bold text-slate-700 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <Award className="h-4 w-4" />
                  </span>
                  {cat.category}
                </h3>
                <span className="text-xs      font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  {cat.teams.length} Teams
                </span>
              </div>

              <div className="space-y-4">
                {cat.teams.slice(0, 4).map(([team, score], idx) => (
                  <motion.div
                    key={team}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIndex * 0.1 + idx * 0.05 }}
                    whileHover={{ y: -2, backgroundColor: "#f8fafc" }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center h-10 w-10 rounded-full text-white font-bold text-sm ${
                          idx === 0
                            ? "bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
                            : idx === 1
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
                            : "bg-gradient-to-br from-rose-500 to-rose-600 shadow-[0_4px_12px_rgba(236,72,153,0.3)]"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          Team {team}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {toOrdinal(idx + 1)} Position
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-emerald-600 text-lg">
                        {score} pts
                      </p>
                      <div className="flex items-center justify-end mt-1">
                        <div className="flex items-center text-xs text-slate-500">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                          <span> Top performer</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {cat.teams.length > 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: catIndex * 0.1 + 0.3 }}
                  className="mt-4 pt-4 border-t border-slate-100"
                ></motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
