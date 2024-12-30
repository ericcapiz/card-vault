import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar/Navbar";
import { UploadForm } from "@/components/UploadForm/UploadForm";
import { Footer } from "@/components/Footer/Footer";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoutes/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "@/store/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(checkAuth(token));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box
          component="main"
          sx={{
            mt: 8,
            p: 3,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Routes>
            <Route path="/" element={<UploadForm />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
