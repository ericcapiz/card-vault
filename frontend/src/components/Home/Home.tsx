import { useRef } from "react";
import { Box, Container } from "@mui/material";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import HowItWorks from "@/components/Home/HowItWorks";

const Home = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: 4, md: 6 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Hero scrollToFeatures={scrollToFeatures} />
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          px: { xs: 2, sm: 3, md: 4 },
          mx: "auto",
        }}
      >
        <Box ref={featuresRef}>
          <Features />
        </Box>
        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <HowItWorks />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
