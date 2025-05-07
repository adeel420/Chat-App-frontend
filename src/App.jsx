import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Verify_Email from "./pages/Verify_Email";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import RefreshHandler from "./components/RefreshHandler";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to={"/login"} />;
  };
  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<Verify_Email />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
