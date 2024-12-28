import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

const spiralSpinClockwise = keyframes`
  0% {
    transform: rotate(0deg) scale(0.1);
    opacity: 1;
  }
  100% {
    transform: rotate(720deg) scale(2.5);
    opacity: 0;
  }
`;

const spiralSpinCounterClockwise = keyframes`
  0% {
    transform: rotate(0deg) scale(0.1);
    opacity: 1;
  }
  100% {
    transform: rotate(-720deg) scale(2.5);
    opacity: 0;
  }
`;

interface LoadingOverlayProps {
  show: boolean;
}

export const LoadingOverlay = ({ show }: LoadingOverlayProps) => {
  if (!show) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 12, 32, 0.95)",
        overflow: "hidden",
        zIndex: 1000,
        perspective: "1000px",
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: "250px",
            height: "250px",
            background: `radial-gradient(
              circle at 50% 50%,
              transparent 35%,
              #00BFFF 40%,
              #40E0D0 45%,
              #FF6F61 50%,
              transparent 55%
            )`,
            borderRadius: "100% 0% 100% 0% / 100% 0% 100% 0%",
            transform: `rotate(${60 * i}deg)`,
            animation: `${
              i % 2 === 0 ? spiralSpinClockwise : spiralSpinCounterClockwise
            } 6s infinite linear`,
            animationDelay: `${i * 0.3}s`,
            transformOrigin: "center",
            filter: "blur(1px)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "inherit",
              borderRadius: "0% 100% 0% 100% / 0% 100% 0% 100%",
              transform: "rotate(45deg)",
            },
          }}
        />
      ))}
    </Box>
  );
};
