import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./Signup";
import Login from "./Login";
import MainApp from "./App"; // Use a relative path

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Automatically redirect to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
