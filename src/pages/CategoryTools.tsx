import React from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography, Grid, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { toolsData, toolCategories } from "../data/toolsData";
import ToolCard from "../components/ToolCard";

const CategoryTools = () => {
  const theme = useTheme();
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = toolCategories.find((cat) => cat.id === categoryId);
  const categoryTools = toolsData.filter(
    (tool) => tool.category === categoryId
  );

  if (!category) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4">Category not found</Typography>
      </Container>
    );
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
    </Container>
  );
};

export default CategoryTools;
