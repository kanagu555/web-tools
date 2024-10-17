import React from "react";
import { Box, Grid, Card, CardContent } from "@mui/material";
import Link from "next/link";

const YouTubeThumbnailImage = "/YouTubeThumbnailImage.jpg";

const styles = {
  container: {
    flexGrow: 1,
  },
  contentBox: {
    padding: 3,
  },
  card: {
    width: '250px',
    height: '250px', // Set the fixed size of the card
    position: 'relative',
  },
  cardContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "contents",
  },
};

const MainContent = () => {
  return (
    <Box sx={styles.container}>
      {/* Content with Square Cards */}
      <Box sx={styles.contentBox}>
        <Grid container spacing={1}>
          {/* Create multiple cards */}
          {Array.from(Array(1)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={styles.card}>
                <CardContent sx={styles.cardContent}>
                <Link href="./YouTubeThumbnail" target="_blank">
                  <img src={YouTubeThumbnailImage} width='250px' height='250px' alt="YouTube Thumbnail" />
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MainContent;
