import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  Tooltip,
  Container,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Code,
  Menu as MenuIcon,
  FileText,
  Text,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  items?: { label: string; href: string }[];
}

interface Props {
  toggleTheme: () => void;
}

const Header: React.FC<Props> = ({ toggleTheme }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEls, setAnchorEls] = useState<{
    [key: string]: null | HTMLElement;
  }>({});

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const navItems: NavItem[] = [
    {
      label: "PDF Tools",
      icon: <FileText size={16} />,
      items: [
        { label: "Image to PDF", href: "/tools/image-to-pdf" },
        { label: "PDF Merger", href: "/tools/pdf-merger" },
        { label: "PDF Splitter", href: "/tools/pdf-splitter" },
        { label: "View All PDF Tools", href: "/category/pdf" },
      ],
    },
    {
      label: "Text Tools",
      icon: <Text size={16} />,
      items: [
        { label: "Word Count", href: "/tools/word-count" },
        { label: "Text Formatter", href: "/tools/text-formatter" },
        { label: "Text Translator", href: "/tools/text-translator" },
        { label: "View All Text Tools", href: "/category/text" },
      ],
    },
    {
      label: "Design Tools",
      icon: <Palette size={16} />,
      items: [
        { label: "Color Picker", href: "#" },
        { label: "Image Editor", href: "#" },
        { label: "SVG Editor", href: "#" },
        { label: "View All Design Tools", href: "#" },
      ],
    },
    {
      label: "Developer Tools",
      icon: <Code size={16} />,
      items: [
        { label: "JSON Formatter", href: "#" },
        { label: "HTML Formatter", href: "#" },
        { label: "CSS Minifier", href: "#" },
        { label: "View All Developer Tools", href: "#" },
      ],
    },
  ];

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    item: string
  ) => {
    setAnchorEls({ ...anchorEls, [item]: event.currentTarget });
  };

  const handleCloseMenu = (item: string) => {
    setAnchorEls({ ...anchorEls, [item]: null });
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigateHome = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleResize = () => {
      if (!isMobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, mobileMenuOpen]);

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="a"
                href="/"
                onClick={handleNavigateHome}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <Code size={32} color={theme.palette.primary.main} />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    ml: 1,
                    fontWeight: 700,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  KodeKit
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {navItems.map((item) => (
                  <div key={item.label}>
                    <Button
                      color="inherit"
                      startIcon={item.icon}
                      endIcon={<span style={{ fontSize: "10px" }}>▼</span>}
                      onClick={(e) => handleOpenMenu(e, item.label)}
                      sx={{ mx: 1, py: 1 }}
                    >
                      {item.label}
                    </Button>
                    <Menu
                      anchorEl={anchorEls[item.label]}
                      open={Boolean(anchorEls[item.label])}
                      onClose={() => handleCloseMenu(item.label)}
                      MenuListProps={{
                        "aria-labelledby": `${item.label}-button`,
                      }}
                      sx={{
                        "& .MuiPaper-root": {
                          borderRadius: 2,
                          mt: 1.5,
                          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      {item.items?.map((subItem) => (
                        <MenuItem
                          key={subItem.label}
                          onClick={() => {
                            handleCloseMenu(item.label);
                            if (subItem.href !== "#") {
                              navigate(subItem.href);
                            }
                          }}
                        >
                          {subItem.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                ))}
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Toggle theme">
                <IconButton
                  color="inherit"
                  onClick={toggleTheme}
                  sx={{ ml: 1 }}
                >
                  {theme.palette.mode === "dark" ? (
                    <Sun size={20} />
                  ) : (
                    <Moon size={20} />
                  )}
                </IconButton>
              </Tooltip>

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  sx={{ ml: 1 }}
                  id="mobile-menu-button"
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>

            {/* Mobile Navigation */}
            {isMobile && (
              <Menu
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                anchorEl={document.getElementById("mobile-menu-button")}
                open={mobileMenuOpen}
                onClose={handleCloseMobileMenu}
                sx={{
                  "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "300px",
                    mt: 5,
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem key={item.label} onClick={handleCloseMobileMenu}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {item.icon}
                      <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default Header;
