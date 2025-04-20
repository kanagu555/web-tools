"use client";

import React, { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  MenuItem,
  useTheme,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CodeIcon from "@mui/icons-material/Code";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PaletteIcon from "@mui/icons-material/Palette";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ImageIcon from "@mui/icons-material/Image";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import CalculateIcon from "@mui/icons-material/Calculate";

// Tool categories with their subsections
const pdfTools = [
  {
    name: "PDF Converter",
    path: "/pdf-converter",
    icon: <PictureAsPdfIcon fontSize="small" />,
  },
  {
    name: "PDF Merger",
    path: "/pdf-merger",
    icon: <DescriptionIcon fontSize="small" />,
  },
  {
    name: "PDF Splitter",
    path: "/pdf-splitter",
    icon: <DescriptionIcon fontSize="small" />,
  },
];

const textTools = [
  {
    name: "Word Count",
    path: "/word-count",
    icon: <TextFieldsIcon fontSize="small" />,
  },
  {
    name: "Text Formatter",
    path: "/text-formatter",
    icon: <TextFormatIcon fontSize="small" />,
  },
  {
    name: "Spell Check",
    path: "/spell-check",
    icon: <SpellcheckIcon fontSize="small" />,
  },
];

const designTools = [
  {
    name: "Color Palette",
    path: "/color-palette",
    icon: <PaletteIcon fontSize="small" />,
  },
  {
    name: "Image Editor",
    path: "/image-editor",
    icon: <ImageIcon fontSize="small" />,
  },
  {
    name: "Color Picker",
    path: "/color-picker",
    icon: <FormatColorFillIcon fontSize="small" />,
  },
];

const developerTools = [
  {
    name: "Code Formatter",
    path: "/code-formatter",
    icon: <CodeIcon fontSize="small" />,
  },
  {
    name: "Unit Converter",
    path: "/unit-converter",
    icon: <CalculateIcon fontSize="small" />,
  },
];

// Define the categories
const categories = [
  { name: "PDF Tools", icon: <PictureAsPdfIcon />, tools: pdfTools },
  { name: "Text Tools", icon: <TextFieldsIcon />, tools: textTools },
  { name: "Design Tools", icon: <PaletteIcon />, tools: designTools },
  { name: "Developer Tools", icon: <CodeIcon />, tools: developerTools },
];

interface HeaderProps {
  colorMode: {
    toggleColorMode: () => void;
  };
  mode: "light" | "dark";
}

export default function Header({ colorMode, mode }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoryClick = useCallback((category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
      setMobileOpen(false);
    },
    [router]
  );

  const Logo = () => (
    <>
      <CodeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
      <Typography
        variant="h6"
        noWrap
        component={Link}
        href="/"
        sx={{
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".1rem",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        KodeKit
      </Typography>
    </>
  );

  const drawer = (
    <Box sx={{ width: 280, bgcolor: "background.paper", height: "100%" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Logo />
      </Box>
      <Divider />
      <List>
        {categories.map((category) => (
          <React.Fragment key={category.name}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleCategoryClick(category.name)}
              >
                <ListItemIcon>{category.icon}</ListItemIcon>
                <ListItemText primary={category.name} />
                {openCategories[category.name] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            <Collapse
              in={openCategories[category.name]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {category.tools.map((tool) => (
                  <ListItemButton
                    key={tool.path}
                    sx={{ pl: 4 }}
                    selected={pathname === tool.path}
                    onClick={() => handleNavigate(tool.path)}
                  >
                    <ListItemIcon>{tool.icon}</ListItemIcon>
                    <ListItemText primary={tool.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          bgcolor:
            theme.palette.mode === "light" ? "white" : "background.paper",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Desktop Logo */}
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
              <Logo />
            </Box>

            {/* Mobile menu icon */}
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Mobile Logo */}
            <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
              <Logo />
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 2 }}
            >
              {categories.map((category) => (
                <Box
                  key={category.name}
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  sx={{ position: "relative" }}
                >
                  <Button
                    sx={{
                      my: 2,
                      color: "text.primary",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                    startIcon={category.icon}
                    endIcon={<ExpandMore />}
                  >
                    {category.name}
                  </Button>
                  {hoveredCategory === category.name && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 1,
                        width: 220,
                        bgcolor: "background.paper",
                        boxShadow: 3,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      {category.tools.map((tool) => (
                        <MenuItem
                          key={tool.path}
                          onClick={() => handleNavigate(tool.path)}
                          selected={pathname === tool.path}
                          sx={{ py: 1.5 }}
                        >
                          <ListItemIcon>{tool.icon}</ListItemIcon>
                          <ListItemText primary={tool.name} />
                        </MenuItem>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            {/* Theme Toggle */}
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                onClick={colorMode.toggleColorMode}
                color="inherit"
                aria-label="toggle theme"
              >
                {theme.palette.mode === "dark" ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Toolbar placeholder to prevent content from hiding behind the appbar */}
      <Toolbar />
    </>
  );
}
