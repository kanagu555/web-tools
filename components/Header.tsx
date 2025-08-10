"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
  Divider,
  Button,
  Menu,
  MenuItem,
  Collapse,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { Code } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toolCategories, toolsData } from "@/lib/data/toolsData";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEls, setAnchorEls] = useState<{
    [key: string]: null | HTMLElement;
  }>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  // Create navigation items with tool subcategories
  const navigationItems = toolCategories.slice(0, 4).map((category) => {
    const categoryTools = toolsData
      .filter((tool) => tool.category === category.id)
      .slice(0, 4); // Show top 4 tools per category

    return {
      title: category.title,
      href: `/category/${category.id}`,
      icon: category.icon,
      items: [
        ...categoryTools.map((tool) => ({
          label: tool.title,
          href: tool.route || "#",
        })),
        {
          label: `View All ${category.title}`,
          href: `/category/${category.id}`,
        },
      ],
    };
  });

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Code
          size={34}
          color={theme.palette.primary.main}
          aria-label="KodeKit logo"
          role="img"
        />
        <Typography variant="h3" component="div" className="gradient-text">
          KodeKit
        </Typography>
        <IconButton onClick={handleDrawerToggle} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {/* Home Link */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/"
            selected={pathname === "/"}
            onClick={handleDrawerToggle}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                "& .MuiListItemIcon-root": {
                  color: "primary.contrastText",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        {/* Category Navigation */}
        {navigationItems.map((item) => {
          const isExpanded = expandedCategory === item.title;

          return (
            <React.Fragment key={item.title}>
              {/* Category header with toggle */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => toggleCategoryExpansion(item.title)}
                  sx={{
                    backgroundColor: theme.palette.primary.main + "10",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main + "20",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                  {isExpanded ? <ExpandLessIcon /> : <ChevronRightIcon />}
                </ListItemButton>
              </ListItem>

              {/* Tool links with collapse */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.items?.map((subItem) => (
                    <ListItem key={subItem.label} disablePadding>
                      <ListItemButton
                        component={Link}
                        href={subItem.href}
                        onClick={handleDrawerToggle}
                        sx={{
                          pl: 4,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.main + "10",
                          },
                        }}
                      >
                        <ListItemText
                          primary={subItem.label}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
      <Divider sx={{ my: 2 }} />
    </Box>
  );

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ px: { xs: 0, sm: 0 } }}>
              {/* Mobile menu button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Logo/Title */}
              <Code
                size={32}
                color={theme.palette.primary.main}
                aria-label="KodeKit logo"
                role="img"
              />
              <Typography
                variant="h3"
                component={Link}
                href="/"
                sx={{
                  ml: 1,
                  flexGrow: isMobile ? 1 : 0,
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 700,
                  mr: 4,
                }}
                className="gradient-text"
              >
                KodeKit
              </Typography>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box
                  sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
                >
                  {navigationItems.map((item) => (
                    <Box key={item.title}>
                      <Button
                        color="inherit"
                        startIcon={React.cloneElement(item.icon, {
                          sx: { fontSize: 16 },
                        })}
                        endIcon={
                          <ExpandMoreIcon
                            sx={{
                              fontSize: 16,
                              transform: Boolean(anchorEls[item.title])
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s ease",
                            }}
                          />
                        }
                        onClick={(e) => handleOpenMenu(e, item.title)}
                        sx={{
                          mx: 1,
                          py: 1,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.light + "10",
                          },
                        }}
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorEls[item.title])}
                      >
                        {item.title}
                      </Button>
                      <Menu
                        anchorEl={anchorEls[item.title]}
                        open={Boolean(anchorEls[item.title])}
                        onClose={() => handleCloseMenu(item.title)}
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
                            component={Link}
                            href={subItem.href}
                            onClick={() => handleCloseMenu(item.title)}
                            sx={{
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.primary.main + "10",
                              },
                            }}
                          >
                            {subItem.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ))}
                  <Box
                    component={Link}
                    href="/categories"
                    sx={{
                      mx: 1,
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      textDecoration: "none",
                      color: "text.primary",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      More...
                    </Typography>
                  </Box>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
