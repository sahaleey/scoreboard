import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Award, User, Users, Hash } from "lucide-react";
import { results, students } from "../data";
import { X } from "lucide-react";

const StudentCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mergedData, setMergedData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Merge student info with results
    const combined = students.map((student) => {
      const studentResults = results.flatMap((program) =>
        program.placements
          .filter((placement) => placement.studentId === student.id)
          .map((placement) => ({
            programName: program.programName,
            position: placement.position,
            grade: placement.grade,
            category: placement.category,
          }))
      );

      return {
        ...student,
        results: studentResults,
        achievements: studentResults.filter((r) => r.position <= 3).length,
      };
    });

    setMergedData(combined);
  }, []);

  const filteredStudents = mergedData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toString().includes(searchTerm)
  );

  const getPositionBadge = (position) => {
    const positionColors = {
      1: "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800",
      2: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800",
      3: "bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800",
      default: "bg-gray-100 text-gray-800",
    };

    const positionClass = positionColors[position] || positionColors.default;

    return (
      <span
        className={`${positionClass} px-2 py-1 rounded-full text-xs font-medium`}
      >
        {position === 1
          ? "🏆 1st"
          : position === 2
          ? "🥈 2nd"
          : position === 3
          ? "🥉 3rd"
          : `${position}th`}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl    font-bold text-gray-800 mb-2">
            Student Achievements
          </h1>
          <p className="text-gray-500">Track performance across all programs</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students by name or Ad No. ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300  transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Student Cards Grid */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <motion.div
              key={student.id}
              layoutId={`student-${student.id}`}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl    font-bold text-gray-800">
                      {student.name}
                    </h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Hash className="h-3 w-3 mr-1" />
                        {student.id}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Users className="h-3 w-3 mr-1" />
                        {student.team}
                      </span>
                    </div>
                  </div>

                  {student.achievements > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800">
                      <Award className="h-3 w-3 mr-1" />
                      {student.achievements} award
                      {student.achievements !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="flex items-center text-sm  font-semibold text-gray-500 mb-2">
                    <User className="h-4 w-4 mr-1.5" />
                    Performance Summary
                  </h4>

                  {student.results.length > 0 ? (
                    <ul className="space-y-2">
                      {student.results.slice(0, 3).map((res, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {getPositionBadge(res.position)}
                          </div>
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-800">
                              {res.programName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {res.category} • Grade: {res.grade || "N/A"}
                            </p>
                          </div>
                        </li>
                      ))}
                      {student.results.length > 3 && (
                        <li className="text-xs text-gray-400">
                          +{student.results.length - 3} more achievements
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div className="text-center py-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-400">
                        No results recorded yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 ">
                No students found matching your search
              </p>
            </div>
          </div>
        )}

        {/* Student Detail Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setSelectedStudent(null)}
              />

              <motion.div
                layoutId={`student-${selectedStudent.id}`}
                className="fixed inset-0 flex items-center justify-center z-50 px-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.2 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                  <motion.button
                    onClick={() => setSelectedStudent(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-amber-600 z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>

                  <div className="p-8">
                    {/* Student Header */}
                    <div className="flex items-start">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-2xl font-bold text-blue-800 mr-4">
                        {selectedStudent.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl    font-bold text-gray-800">
                          {selectedStudent.name}
                        </h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Ad No: {selectedStudent.id}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Users className="h-3 w-3 mr-1" />
                            Team: {selectedStudent.team}
                          </span>
                          {selectedStudent.achievements > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800">
                              <Award className="h-3 w-3 mr-1" />
                              {selectedStudent.achievements} award
                              {selectedStudent.achievements !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Results Section */}
                    <div className="mt-8">
                      <h3 className="text-lg    font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-amber-600" />
                        Academic Achievements
                      </h3>

                      {selectedStudent.results.length > 0 ? (
                        <div className="space-y-4">
                          {selectedStudent.results.map((res, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className=" font-bold text-gray-800">
                                    {res.programName}
                                  </h4>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {res.category}
                                  </p>
                                </div>
                                {getPositionBadge(res.position)}
                              </div>
                              <div className="mt-3 flex justify-between items-center">
                                <div>
                                  <span className="text-xs font-medium text-gray-500">
                                    Grade:
                                  </span>
                                  <span
                                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                      res.grade
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                                  >
                                    {res.grade || "Not graded"}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date().toLocaleDateString()}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <div className="inline-block p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <p className="text-gray-500 ">
                              No academic achievements recorded yet
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
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

export default StudentCard;
