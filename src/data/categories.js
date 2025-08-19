// Categories grouped by classes (no class 10)
export const categories = [
  { id: "bidaya", name: "Bidaya", classes: [1] },
  { id: "ula", name: "Ula", classes: [2, 3] },
  { id: "thaniyyah", name: "Thaniyyah", classes: [4, 5] },
  { id: "thanawiyyah", name: "Thanawiyyah", classes: [6, 7] },
  { id: "aliyah", name: "Aliyah", classes: [8, 9] },
];

// Handy map for quick lookups later if needed
export const CLASS_TO_CATEGORY = {
  1: "bidaya",
  2: "ula",
  3: "ula",
  4: "thaniyyah",
  5: "thaniyyah",
  6: "thanawiyyah",
  7: "thanawiyyah",
  8: "aliyah",
  9: "aliyah",
};
