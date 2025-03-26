import React, { useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Projects from "./pages/Projects";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const featuresRef = useRef(null);
  const location = useLocation(); // Get the current route

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navbar scrollToFeatures={scrollToFeatures} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/LogIn" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Projects" element={<Projects />} />
        </Routes>

        {/* Show Features ONLY on the Home page */}
        {location.pathname === "/" && (
          <div ref={featuresRef}>
            <Features />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;
