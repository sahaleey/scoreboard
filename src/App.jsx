import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProgramResults from "./pages/ProgramResults";
import Students from "./components/StudentCard";

// (Optional) If you already have these pages, import them here.
// Otherwise you can create them later and these routes will start working.
// import Students from "./pages/Students";
// import Programs from "./pages/Programs";
// import Results from "./pages/Results";
// import Teams from "./pages/Teams";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/program-results" element={<ProgramResults />} />
          {/* Uncomment these when you add the pages */}
          <Route path="/students" element={<Students />} />
          {/* <Route path="/programs" element={<Programs />} /> */}
          {/* <Route path="/results" element={<Results />} /> */}
          {/* <Route path="/teams" element={<Teams />} /> */}
        </Routes>
      </main>
    </Router>
  );
}
