import { useRef } from "react";
import { Box } from "@mui/material";
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
        alignItems: "center",
        gap: 24,
      }}
    >
      <Hero scrollToFeatures={scrollToFeatures} />
      <Box ref={featuresRef}>
        <Features />
      </Box>
      <HowItWorks />
    </Box>
  );
};

export default Home;
