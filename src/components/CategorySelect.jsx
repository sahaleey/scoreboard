import { useState } from "react";

export default function CustomSelect({
  categories,
  activeCategory,
  setActiveCategory,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-48">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
      >
        {activeCategory === "all" ? "All Categories" : activeCategory}
        <span className="ml-2">▼</span>
      </button>

      {open && (
        <ul className="absolute mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg z-10">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setOpen(false);
              }}
              className="cursor-pointer px-4 py-2 text-slate-700 hover:bg-amber-100 rounded-lg"
            >
              {category === "all" ? "All Categories" : category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
