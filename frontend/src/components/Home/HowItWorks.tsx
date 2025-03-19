import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AccountCircle,
  PhotoCamera,
  CloudUpload,
  Collections,
  TableChart,
  GetApp,
} from "@mui/icons-material";

const StyledStepIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #FFD700 0%, #9B4D86 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    fontSize: 24,
    color: "#fff",
  },
}));

const steps = [
  {
    icon: <AccountCircle />,
    label: "Create an Account",
    description:
      "Sign up for a free account to start managing your Yu-Gi-Oh! card collection.",
  },
  {
    icon: <PhotoCamera />,
    label: "Take Card Photos",
    description:
      "Take clear photos of your Yu-Gi-Oh! cards. Make sure the card text is visible and well-lit.",
  },
  {
    icon: <CloudUpload />,
    label: "Upload in Batches",
    description:
      "Upload your card photos in batches of up to 10 images. You can create multiple batches for larger collections.",
  },
  {
    icon: <Collections />,
    label: "Create Collections",
    description:
      "Organize your cards into collections. Perfect for keeping track of different decks or card sets.",
  },
  {
    icon: <TableChart />,
    label: "Manage Your Collection",
    description:
      "View your cards in a table format showing card names, types, and quantities. Sort and filter to find specific cards.",
  },
  {
    icon: <GetApp />,
    label: "Export and Share",
    description:
      "Download your collections as spreadsheets to share with friends or keep for your records.",
  },
];

export const HowItWorks = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 8,
        px: 2,
      }}
    >
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom
        sx={{
          mb: 6,
          background: "linear-gradient(90deg, #FFD700, #9B4D86)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 20px rgba(155, 77, 134, 0.1)",
        }}
      >
        How It Works
      </Typography>

      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Stepper orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index} active={true}>
              <StepLabel
                StepIconComponent={() => (
                  <StyledStepIcon>{step.icon}</StyledStepIcon>
                )}
              >
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(90deg, #FFD700, #FFE44D)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontWeight: "bold",
                    textShadow: "0 0 8px rgba(255, 215, 0, 0.15)",
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "rgba(29, 36, 56, 0.8)",
                    borderLeft: "2px solid",
                    borderColor: "#FFD700",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.95)",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {step.description}
                  </Typography>
                </Paper>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
};

export default HowItWorks;
