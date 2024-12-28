import { Box } from "@mui/material";
import { Navbar } from "@/components/Navbar/Navbar";
import { UploadForm } from "@/components/UploadForm/UploadForm";
import { Footer } from "@/components/Footer/Footer";

function App() {
  return (
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
        <UploadForm />
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
