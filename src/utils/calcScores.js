// data/calcScore.js

/**
 * Calculates the score for a student based on their position and grade.
 *
 * @param {string} position - The student's position ('1st', '2nd', '3rd', or null).
 * @param {string} grade - The student's grade ('A', 'B', 'C', or null).
 * @returns {number} The calculated score.
 */
export function calcScore(position, grade) {
  // Points mapping for positions
  const positionPoints = {
    "1st": 5,
    "2nd": 3,
    "3rd": 1,
  };

  // Points mapping for grades
  const gradePoints = {
    A: 5,
    B: 3,
    C: 1,
  };

  // Start with 0
  let totalPoints = 0;

  // Add position points (if exists)
  if (position && positionPoints[position]) {
    totalPoints += positionPoints[position];
  }

  // Add grade points (if exists)
  if (grade && gradePoints[grade]) {
    totalPoints += gradePoints[grade];
  }

  return totalPoints;
}
