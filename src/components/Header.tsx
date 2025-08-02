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
  Collapse,
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
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

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

  useEffect(() => {
    if (!mobileMenuOpen) {
      setExpandedCategory(null);
    }
  }, [mobileMenuOpen]);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  // Enhanced JSON-LD structured data for Website and Navigation
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KodeKit - Developer Tools & Utilities",
    alternateName: "KodeKit",
    url: "https://kodekit.in",
    description:
      "All-in-one toolkit for developers, designers, and content creators. Secure, fast, and privacy-focused web tools.",
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://kodekit.in/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "WebApplication",
      name: "KodeKit",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  };

  const navItems: NavItem[] = [
    {
      label: "PDF Tools",
      icon: <FileText size={16} aria-hidden="true" />,
      items: [
        { label: "Image to PDF", href: "/tools/image-to-pdf-converter" },
        { label: "PDF Merger", href: "/tools/pdf-merger" },
        { label: "PDF Splitter", href: "/tools/pdf-splitter" },
        { label: "View All PDF Tools", href: "/category/pdf" },
      ],
    },
    {
      label: "Text Tools",
      icon: <Text size={16} aria-hidden="true" />,
      items: [
        { label: "Word Count", href: "/tools/word-count" },
        { label: "Text Formatter", href: "/tools/text-formatter" },
        { label: "Text Translator", href: "/tools/text-translator" },
        { label: "View All Text Tools", href: "/category/text" },
      ],
    },
    {
      label: "Design Tools",
      icon: <Palette size={16} aria-hidden="true" />,
      items: [
        { label: "Color Picker", href: "/tools/color-picker" },
        { label: "Image Resizer", href: "/tools/image-resizer" },
        { label: "SVG Editor", href: "/tools/svg-editor" },
        { label: "View All Design Tools", href: "/category/design" },
      ],
    },
    {
      label: "Developer Tools",
      icon: <Code size={16} aria-hidden="true" />,
      items: [
        { label: "JSON Formatter", href: "/tools/json-formatter" },
        { label: "Regex Tester", href: "/tools/regex-tester" },
        { label: "JWT Decoder", href: "/tools/jwt-decoder" },
        { label: "View All Developer Tools", href: "/category/developer" },
      ],
    },
  ];

  // Breadcrumb structured data for navigation
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: navItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://kodekit.in/category/${item.label
        .toLowerCase()
        .replace(" tools", "")}`,
    })),
  };

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

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
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
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(websiteJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Helmet>

      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          component="header"
          role="banner"
          aria-label="Site header"
        >
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
                  aria-label="KodeKit homepage"
                >
                  <Code
                    size={32}
                    color={theme.palette.primary.main}
                    aria-label="KodeKit logo"
                    role="img"
                  />
                  <Typography
                    variant="h3"
                    component="h3"
                    sx={{
                      ml: 1,
                      fontWeight: 700,
                      fontSize: "1.5rem",
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
                <Box
                  sx={{ display: "flex", alignItems: "center" }}
                  component="nav"
                  role="navigation"
                  aria-label="Main navigation"
                >
                  <Box
                    component="ul"
                    sx={{ display: "flex", listStyle: "none", p: 0, m: 0 }}
                  >
                    {navItems.map((item) => (
                      <Box component="li" key={item.label}>
                        <Button
                          color="inherit"
                          startIcon={item.icon}
                          endIcon={
                            <ChevronDown
                              size={12}
                              aria-hidden="true"
                              style={{
                                transform: Boolean(anchorEls[item.label])
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                              }}
                            />
                          }
                          onClick={(e) => handleOpenMenu(e, item.label)}
                          sx={{
                            mx: 1,
                            py: 1,
                            "&:hover, &:focus": {
                              backgroundColor: `${theme.palette.primary.light}10`,
                            },
                          }}
                          aria-haspopup="true"
                          aria-expanded={Boolean(anchorEls[item.label])}
                          aria-controls={`${item.label}-menu`}
                          id={`${item.label}-button`}
                          aria-label={`${item.label} menu`}
                        >
                          {item.label}
                        </Button>
                        <Menu
                          id={`${item.label}-menu`}
                          anchorEl={anchorEls[item.label]}
                          open={Boolean(anchorEls[item.label])}
                          onClose={() => handleCloseMenu(item.label)}
                          MenuListProps={{
                            "aria-labelledby": `${item.label}-button`,
                            role: "menu",
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
                              role="menuitem"
                              onClick={() => {
                                handleCloseMenu(item.label);
                                if (subItem.href !== "#") {
                                  navigate(subItem.href);
                                }
                              }}
                              sx={{
                                "&:hover, &:focus": {
                                  backgroundColor: `${theme.palette.primary.main}1`,
                                },
                              }}
                              aria-label={`Navigate to ${subItem.label}`}
                            >
                              {subItem.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Right Side Actions */}
              <Box
                sx={{ display: "flex", alignItems: "center" }}
                component="div"
                role="toolbar"
                aria-label="Header actions"
              >
                <Tooltip
                  title={`Switch to ${
                    theme.palette.mode === "dark" ? "light" : "dark"
                  } mode`}
                >
                  <IconButton
                    color="inherit"
                    onClick={toggleTheme}
                    sx={{
                      ml: 1,
                      "&:hover, &:focus": {
                        backgroundColor: `${theme.palette.primary.main}10`,
                      },
                    }}
                    aria-label={`Switch to ${
                      theme.palette.mode === "dark" ? "light" : "dark"
                    } mode`}
                  >
                    {theme.palette.mode === "dark" ? (
                      <Sun size={20} aria-hidden="true" />
                    ) : (
                      <Moon size={20} aria-hidden="true" />
                    )}
                  </IconButton>
                </Tooltip>

                {/* Mobile Menu Button */}
                {isMobile && (
                  <IconButton
                    color="inherit"
                    aria-label={
                      mobileMenuOpen ? "Close main menu" : "Open main menu"
                    }
                    aria-controls="mobile-menu"
                    aria-haspopup="true"
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    sx={{
                      ml: 1,
                      "&:hover, &:focus": {
                        backgroundColor: `${theme.palette.primary.main}10`,
                      },
                    }}
                    id="mobile-menu-button"
                  >
                    <MenuIcon aria-hidden="true" />
                  </IconButton>
                )}
              </Box>

              {/* Mobile Navigation */}
              {isMobile && (
                <Menu
                  id="mobile-menu"
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
                  MenuListProps={{
                    "aria-labelledby": "mobile-menu-button",
                    role: "menu",
                  }}
                >
                  <Box
                    component="nav"
                    role="navigation"
                    aria-label="Mobile navigation"
                  >
                    {navItems.map((item) => {
                      const isExpanded = expandedCategory === item.label;

                      return (
                        <React.Fragment key={item.label}>
                          {/* Category header with toggle */}
                          <MenuItem
                            role="menuitem"
                            onClick={() => toggleCategoryExpansion(item.label)}
                            sx={{
                              backgroundColor:
                                theme.palette.primary.main + "10",
                              fontWeight: "bold",
                              "&:hover, &:focus": {
                                backgroundColor:
                                  theme.palette.primary.main + "20",
                              },
                            }}
                            aria-expanded={isExpanded}
                            aria-controls={`${item.label}-mobile-menu`}
                            aria-label={`${
                              isExpanded ? "Collapse" : "Expand"
                            } ${item.label} menu`}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  role="img"
                                  aria-label={`${item.label} icon`}
                                >
                                  {item.icon}
                                </Box>
                                <Typography sx={{ ml: 1 }}>
                                  {item.label}
                                </Typography>
                              </Box>
                              {isExpanded ? (
                                <ChevronDown size={16} aria-hidden="true" />
                              ) : (
                                <ChevronRight size={16} aria-hidden="true" />
                              )}
                            </Box>
                          </MenuItem>

                          {/* Tool links with collapse */}
                          <Collapse
                            in={isExpanded}
                            timeout="auto"
                            unmountOnExit
                            id={`${item.label}-mobile-menu`}
                            role="region"
                            aria-labelledby={`${item.label}-category`}
                          >
                            <Box
                              component="ul"
                              sx={{ listStyle: "none", p: 0, m: 0 }}
                            >
                              {item.items?.map((subItem) => (
                                <Box component="li" key={subItem.label}>
                                  <MenuItem
                                    role="menuitem"
                                    onClick={() => {
                                      handleCloseMobileMenu();
                                      navigate(subItem.href);
                                    }}
                                    sx={{
                                      pl: 4,
                                      "&:hover, &:focus": {
                                        backgroundColor: `${theme.palette.primary.main}10`,
                                      },
                                    }}
                                    aria-label={`Navigate to ${subItem.label}`}
                                  >
                                    <Typography variant="body2">
                                      {subItem.label}
                                    </Typography>
                                  </MenuItem>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </React.Fragment>
                      );
                    })}
                  </Box>
                </Menu>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>
    </>
  );
};

export default Header;
