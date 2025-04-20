"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  ListItemIcon,
  Divider,
  Fade,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HomeIcon from "@mui/icons-material/Home";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PaletteIcon from "@mui/icons-material/Palette";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DescriptionIcon from "@mui/icons-material/Description";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ImageIcon from "@mui/icons-material/Image";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CodeIcon from "@mui/icons-material/Code";
import CalculateIcon from "@mui/icons-material/Calculate";

// Tool categories
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
];

const mathTools = [
  {
    name: "Calculator",
    path: "/calculator",
    icon: <CalculateIcon fontSize="small" />,
  },
];

const userSettings = [
  { name: "Profile", icon: <PersonIcon fontSize="small" /> },
  { name: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
  {
    name: "Settings",
    path: "/settings",
    icon: <SettingsIcon fontSize="small" />,
  },
  { name: "Logout", icon: <LogoutIcon fontSize="small" /> },
];

interface HeaderProps {
  colorMode: {
    toggleColorMode: () => void;
  };
  mode: "light" | "dark";
}

export default function Header({ colorMode, mode }: HeaderProps) {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Prefetch popular routes for faster navigation
  useEffect(() => {
    const popularRoutes = [
      "/",
      "/pdf-converter",
      "/word-count",
      "/color-palette",
      "/settings",
    ];

    popularRoutes.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  const handleOpenMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuAnchor(null);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleNavigate = (path: string) => {
    handleCloseMobileMenu();
    setActiveCategory(null);
    router.push(path);
  };

  const isActiveCategory = (paths: { path: string }[]) => {
    return paths.some((item) => pathname === item.path);
  };

  const renderCategoryMenu = (
    category: string,
    tools: { name: string; path: string; icon: JSX.Element }[]
  ) => (
    <Box
      sx={{
        position: "relative",
        "&:hover": {
          "& > .MuiPaper-root": {
            display: "block",
            opacity: 1,
          },
        },
      }}
      onMouseEnter={() => setActiveCategory(category)}
      onMouseLeave={() => setActiveCategory(null)}
    >
      <Button
        sx={{
          color: "inherit",
          mx: 1,
          py: 1,
          px: 2,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          backgroundColor:
            isActiveCategory(tools) || activeCategory === category
              ? `${
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.08)"
                    : "rgba(255,255,255,0.08)"
                }`
              : "transparent",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(0,0,0,0.04)"
                : "rgba(255,255,255,0.04)",
          },
          transition: "background-color 0.2s",
        }}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={
          category === "PDF Tools" ? (
            <PictureAsPdfIcon />
          ) : category === "Text Tools" ? (
            <TextFieldsIcon />
          ) : category === "Design Tools" ? (
            <PaletteIcon />
          ) : category === "Developer Tools" ? (
            <CodeIcon />
          ) : (
            <CalculateIcon />
          )
        }
      >
        {category}
      </Button>
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: "100%",
          left: 0,
          zIndex: 1000,
          width: 220,
          display: activeCategory === category ? "block" : "none",
          opacity: activeCategory === category ? 1 : 0,
          transition: "opacity 0.2s",
          mt: 0.5,
          overflow: "hidden",
        }}
      >
        {tools.map((tool) => (
          <MenuItem
            key={tool.path}
            onClick={() => handleNavigate(tool.path)}
            selected={pathname === tool.path}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.04)"
                    : "rgba(255,255,255,0.04)",
              },
            }}
          >
            <ListItemIcon>{tool.icon}</ListItemIcon>
            <Typography>{tool.name}</Typography>
          </MenuItem>
        ))}
      </Paper>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 4 : 0}
      sx={{
        backgroundColor:
          theme.palette.mode === "light"
            ? scrolled
              ? "rgba(255, 255, 255, 0.98)"
              : theme.palette.primary.main
            : scrolled
            ? "rgba(18, 18, 18, 0.98)"
            : theme.palette.primary.dark,
        color:
          theme.palette.mode === "light" && scrolled ? "text.primary" : "white",
        transition: "all 0.3s",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ height: scrolled ? 64 : 70, transition: "height 0.3s" }}
        >
          {/* Desktop Logo */}
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              mr: 3,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              alignItems: "center",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            {/* <HomeIcon sx={{ mr: 1, fontSize: 28 }} /> */}
            Utility Tools
          </Typography>

          {/* Mobile Menu */}
          <Box
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenMobileMenu}
              color="inherit"
              sx={{
                borderRadius: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={mobileMenuAnchor}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleCloseMobileMenu}
              sx={{ display: { xs: "block", md: "none" } }}
              TransitionComponent={Fade}
              transitionDuration={200}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  width: 250,
                  maxHeight: "80vh",
                  overflowY: "auto",
                },
              }}
            >
              {/* <MenuItem onClick={() => handleNavigate("/")} selected={pathname === "/"}>
                <ListItemIcon>
                  <HomeIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Home</Typography>
              </MenuItem> */}

              <Divider />
              <Typography
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                PDF TOOLS
              </Typography>
              {pdfTools.map((tool) => (
                <MenuItem
                  key={tool.path}
                  onClick={() => handleNavigate(tool.path)}
                  selected={pathname === tool.path}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>{tool.icon}</ListItemIcon>
                  <Typography>{tool.name}</Typography>
                </MenuItem>
              ))}

              <Divider />
              <Typography
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                TEXT TOOLS
              </Typography>
              {textTools.map((tool) => (
                <MenuItem
                  key={tool.path}
                  onClick={() => handleNavigate(tool.path)}
                  selected={pathname === tool.path}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>{tool.icon}</ListItemIcon>
                  <Typography>{tool.name}</Typography>
                </MenuItem>
              ))}

              <Divider />
              <Typography
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                DESIGN TOOLS
              </Typography>
              {designTools.map((tool) => (
                <MenuItem
                  key={tool.path}
                  onClick={() => handleNavigate(tool.path)}
                  selected={pathname === tool.path}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>{tool.icon}</ListItemIcon>
                  <Typography>{tool.name}</Typography>
                </MenuItem>
              ))}

              <Divider />
              <MenuItem
                onClick={() => handleNavigate("/settings")}
                selected={pathname === "/settings"}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Settings</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HomeIcon sx={{ mr: 1, fontSize: 24 }} />
            Utility Tools
          </Typography>

          {/* Desktop Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              ml: 2,
            }}
          >
            {renderCategoryMenu("PDF Tools", pdfTools)}
            {renderCategoryMenu("Text Tools", textTools)}
            {renderCategoryMenu("Design Tools", designTools)}
            {renderCategoryMenu("Developer Tools", developerTools)}
            {renderCategoryMenu("Math Tools", mathTools)}
          </Box>

          {/* Right side icons */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Theme toggle */}
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              sx={{
                borderRadius: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>

            {/* Settings button */}
            <Button
              sx={{
                color: "inherit",
                mx: 1,
                py: 1,
                px: 2,
                borderRadius: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                backgroundColor:
                  pathname === "/settings"
                    ? `${
                        theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.08)"
                          : "rgba(255,255,255,0.08)"
                      }`
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.04)"
                      : "rgba(255,255,255,0.04)",
                },
                transition: "background-color 0.2s",
              }}
              startIcon={<SettingsIcon />}
              onClick={() => handleNavigate("/settings")}
            >
              Settings
            </Button>

            {/* User menu */}
            <Box sx={{ ml: 1 }}>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0.5,
                    border: `2px solid ${
                      theme.palette.mode === "light"
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(255,255,255,0.2)"
                    }`,
                    borderRadius: "50%",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <AccountCircleIcon fontSize="small" />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={userMenuAnchor}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(userMenuAnchor)}
                onClose={handleCloseUserMenu}
                TransitionComponent={Fade}
                transitionDuration={200}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1 },
                }}
              >
                {userSettings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting.path) {
                        router.push(setting.path);
                      }
                    }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>{setting.icon}</ListItemIcon>
                    <Typography>{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
