import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { ChevronRight, Home } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

interface BreadcrumbItem {
  name: string;
  url?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <Box sx={{ mb: 4, mt: 2 }}>
      <Breadcrumbs
        separator={<ChevronRight size={16} />}
        aria-label="breadcrumb navigation"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: "text.secondary",
            mx: 1,
          },
          "& .MuiBreadcrumbs-ol": {
            flexWrap: "wrap",
          },
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast || !item.url) {
            return (
              <Typography
                key={index}
                color="text.primary"
                fontWeight={500}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "0.875rem",
                }}
              >
                {index === 0 && <Home size={16} />}
                {item.name}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              component={RouterLink}
              to={item.url}
              underline="hover"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "0.875rem",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {index === 0 && <Home size={16} />}
              {item.name}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
