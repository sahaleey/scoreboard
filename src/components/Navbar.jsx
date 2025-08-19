import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Students", path: "/students" },
    { name: "Results", path: "/program-results" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/"
            className="text-xl font-bold tracking-tight flex items-center"
          >
            <span>Nahj Art</span>
            <span className="ml-2 text-xs   font-normal bg-blue-800 px-2 py-1 rounded-full text-blue-100">
              Fest
            </span>
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-300   font-medium text-sm ${
                    isActive
                      ? "bg-blue-800 text-amber-300 shadow-inner"
                      : "text-blue-100 hover:text-white hover:bg-blue-700/50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <motion.div className="md:hidden z-50" whileTap={{ scale: 0.9 }}>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-600"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="text-amber-300" size={28} />
            ) : (
              <Menu className="text-blue-100" size={28} />
            )}
          </button>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black md:hidden"
                onClick={toggleMenu}
              />

              {/* Menu Content */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0.1 }}
                className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-800 shadow-2xl z-40 md:hidden"
              >
                <div className="h-full flex flex-col pt-20 px-6 space-y-4 overflow-y-auto">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                            isActive
                              ? "bg-blue-900 text-amber-300 shadow-inner"
                              : "text-blue-100 hover:text-white hover:bg-blue-600/50"
                          }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
