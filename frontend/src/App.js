import React, { useRef, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
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

function ProtectedRoute({ element }) {
  return localStorage.getItem("token") ? element : <Navigate to="/LogIn" />;
}

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const featuresRef = useRef(null);
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Safely parse user data
      } catch (error) {
        console.error("Error parsing user JSON:", error);
        localStorage.removeItem("user"); // Clean up if parsing fails
      }
    } else {
      setUser(null); // Explicitly set user to null if no data exists
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null); // Reset user state to null
  };

  return (
    <>
      {!user ? (
        <Navbar
          scrollToFeatures={() =>
            featuresRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        />
      ) : null}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/LogIn" element={<Login setUser={setUser} />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route
            path="/Projects"
            element={<ProtectedRoute element={<Projects />} />}
          />
        </Routes>

        {/* Features section only on Home page */}
        {location.pathname === "/" && (
          <div ref={featuresRef}>
            <Features />
          </div>
        )}
      </div>

      {user && (
        <div className="user-info">
          <span>Welcome, {user.first_name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <Footer />
    </>
  );
}

export default App;
