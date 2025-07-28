import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { toolsData, toolCategories } from "../data/toolsData";
import ToolCard from "../components/ToolCard";
import AdSense from "../components/AdSense";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const category = toolCategories.find((cat) => cat.id === categoryId);
  const categoryTools = toolsData.filter(
    (tool) => tool.category === categoryId
  );

  // Category validation is now handled in CategoryPageWithSEO wrapper
  if (!category) {
    return null; // This should never happen now
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            {category.icon}
            <Typography variant="h3" component="h1" fontWeight={700}>
              {category.title}
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            {category.description}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categoryTools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
      <AdSense adSlot="6613251015" />
    </Container>
  );
};

export default CategoryPage;
