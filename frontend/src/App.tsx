import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import { UploadForm } from "./components/UploadForm/UploadForm";
import { Navbar } from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/upload" /> : <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
}

export default App;
