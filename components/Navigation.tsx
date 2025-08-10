"use client";

import React from "react";
import { Breadcrumbs, Typography, Box, Chip } from "@mui/material";
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toolsData, toolCategories } from "@/lib/data/toolsData";

interface NavigationProps {
  showBreadcrumbs?: boolean;
  currentTool?: string;
  currentCategory?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  showBreadcrumbs = true,
  currentTool,
  currentCategory,
}) => {
  const pathname = usePathname();

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: Array<{
      label: string;
      href: string;
      icon?: React.ReactElement;
    }> = [
      {
        label: "Home",
        href: "/",
        icon: <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />,
      },
    ];

    if (pathSegments.length > 0) {
      // Handle categories listing page
      if (pathSegments[0] === "categories") {
        breadcrumbs.push({
          label: "Categories",
          href: "/categories",
        });
      }

      // Handle category pages
      if (pathSegments[0] === "category" && pathSegments[1]) {
        // Add categories breadcrumb first
        breadcrumbs.push({
          label: "Categories",
          href: "/categories",
        });

        const category = toolCategories.find(
          (cat) => cat.id === pathSegments[1]
        );
        if (category) {
          breadcrumbs.push({
            label: category.title,
            href: `/category/${category.id}`,
            icon: React.cloneElement(category.icon, {
              sx: { fontSize: 16, mr: 0.5 },
            }),
          });
        }
      }

      // Handle tool pages
      if (pathSegments[0] === "tools" && pathSegments[1]) {
        const toolId = pathSegments[1];
        const tool = toolsData.find((t) => t.route?.includes(toolId));

        if (tool) {
          const category = toolCategories.find(
            (cat) => cat.id === tool.category
          );

          // Add category breadcrumb
          if (category) {
            breadcrumbs.push({
              label: category.title,
              href: `/category/${category.id}`,
              icon: React.cloneElement(category.icon, {
                sx: { fontSize: 16, mr: 0.5 },
              }),
            });
          }

          // Add tool breadcrumb
          breadcrumbs.push({
            label: tool.title,
            href: tool.route || "#",
          });
        }
      }

      // Handle other pages
      if (pathSegments[0] === "about") {
        breadcrumbs.push({
          label: "About",
          href: "/about",
        });
      }

      if (pathSegments[0] === "privacy") {
        breadcrumbs.push({
          label: "Privacy Policy",
          href: "/privacy",
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (!showBreadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ py: 2 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: "text.secondary",
          },
        }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <Typography
                key={crumb.href}
                color="text.primary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 500,
                }}
              >
                {crumb.icon && crumb.icon}
                {crumb.label}
              </Typography>
            );
          }

          return (
            <Box
              key={crumb.href}
              component={Link}
              href={crumb.href}
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "text.secondary",
                transition: "color 0.2s ease-in-out",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {crumb.icon && crumb.icon}
              <Typography variant="body2">{crumb.label}</Typography>
            </Box>
          );
        })}
      </Breadcrumbs>

      {/* Category/Tool Tags */}
      {(currentCategory || currentTool) && (
        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {currentCategory && (
            <Chip
              label={currentCategory}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {currentTool && (
            <Chip
              label="Tool"
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default Navigation;
