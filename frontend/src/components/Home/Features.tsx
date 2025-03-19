import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CollectionsBookmark,
  PhotoCamera,
  CloudUpload,
  TableChart,
  GetApp,
  Sort,
} from "@mui/icons-material";

const StyledFeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "rgba(29, 36, 56, 0.8)",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease-in-out",
  border: "1px solid rgba(255, 215, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(44, 62, 123, 0.2)",
    border: "1px solid rgba(255, 215, 0, 0.2)",
  },
  [theme.breakpoints.down("sm")]: {
    "&:hover": {
      transform: "none",
    },
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #FFD700 0%, #2C3E7B 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.2)",
  "& svg": {
    fontSize: 30,
    color: "#fff",
  },
  [theme.breakpoints.down("sm")]: {
    width: 50,
    height: 50,
    "& svg": {
      fontSize: 24,
    },
  },
}));

const features = [
  {
    icon: <PhotoCamera />,
    title: "Card Scanning",
    description:
      "Take pictures of your Yu-Gi-Oh! cards and let our OCR technology identify them automatically",
  },
  {
    icon: <CloudUpload />,
    title: "Batch Upload",
    description:
      "Upload up to 10 card images per batch, with unlimited batches for building your collection",
  },
  {
    icon: <CollectionsBookmark />,
    title: "Collection Management",
    description:
      "Create and manage multiple card collections, perfect for organizing different decks or themes",
  },
  {
    icon: <TableChart />,
    title: "Smart Tables",
    description:
      "View your collections in organized tables showing card names, types (Monster/Trap/Spell), and quantities",
  },
  {
    icon: <Sort />,
    title: "Advanced Sorting",
    description:
      "Sort and filter your collections by card name, type, or quantity to find exactly what you need",
  },
  {
    icon: <GetApp />,
    title: "Export Collections",
    description:
      "Download your collections as spreadsheets for easy sharing or offline reference",
  },
];

export const Features = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
        py: { xs: 4, md: 6 },
      }}
    >
      <Typography
        variant={isMobile ? "h4" : "h3"}
        component="h2"
        align="center"
        gutterBottom
        sx={{
          mb: { xs: 4, md: 6 },
          background: "linear-gradient(90deg, #FFD700, #FFE44D)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          fontWeight: "bold",
          width: "100%",
          px: { xs: 2, sm: 0 },
          letterSpacing: "0.02em",
        }}
      >
        Powerful Features
      </Typography>

      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 4 }}
        justifyContent="center"
        sx={{
          width: "100%",
          mx: "auto",
        }}
      >
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledFeatureCard>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  height: "100%",
                  p: { xs: 2.5, sm: 3 },
                }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="h3"
                  gutterBottom
                  sx={{
                    background: "linear-gradient(90deg, #FFD700, #FFE44D)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontWeight: "bold",
                    mb: 1,
                    textShadow: "0 0 20px rgba(255, 215, 0, 0.15)",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.95)",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    lineHeight: 1.6,
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </StyledFeatureCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;
