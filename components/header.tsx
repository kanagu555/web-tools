"use client"

import type React from "react"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
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
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import HomeIcon from "@mui/icons-material/Home"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import TextFieldsIcon from "@mui/icons-material/TextFields"
import PaletteIcon from "@mui/icons-material/Palette"
import SettingsIcon from "@mui/icons-material/Settings"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import DescriptionIcon from "@mui/icons-material/Description"
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill"
import ImageIcon from "@mui/icons-material/Image"
import TextFormatIcon from "@mui/icons-material/TextFormat"
import SpellcheckIcon from "@mui/icons-material/Spellcheck"
import PersonIcon from "@mui/icons-material/Person"
import LogoutIcon from "@mui/icons-material/Logout"
import DashboardIcon from "@mui/icons-material/Dashboard"
import { useHeaderStyles } from "@/styles/styles"

// Tool categories
const pdfTools = [
  { name: "PDF Converter", path: "/pdf-converter", icon: <PictureAsPdfIcon fontSize="small" /> },
  { name: "PDF Merger", path: "/pdf-merger", icon: <DescriptionIcon fontSize="small" /> },
  // Add more PDF tools as needed
]

const textTools = [
  { name: "Word Count", path: "/word-count", icon: <TextFieldsIcon fontSize="small" /> },
  { name: "Text Formatter", path: "/text-formatter", icon: <TextFormatIcon fontSize="small" /> },
  { name: "Spell Check", path: "/spell-check", icon: <SpellcheckIcon fontSize="small" /> },
  // Add more text tools as needed
]

const designTools = [
  { name: "Color Palette", path: "/color-palette", icon: <PaletteIcon fontSize="small" /> },
  { name: "Image Editor", path: "/image-editor", icon: <ImageIcon fontSize="small" /> },
  { name: "Color Picker", path: "/color-picker", icon: <FormatColorFillIcon fontSize="small" /> },
  // Add more design tools as needed
]

const userSettings = [
  { name: "Profile", icon: <PersonIcon fontSize="small" /> },
  { name: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
  { name: "Settings", path: "/settings", icon: <SettingsIcon fontSize="small" /> },
  { name: "Logout", icon: <LogoutIcon fontSize="small" /> },
]

interface HeaderProps {
  colorMode: {
    toggleColorMode: () => void
  }
  mode: "light" | "dark"
}

export default function Header({ colorMode, mode }: HeaderProps) {
  const classes = useHeaderStyles()
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [pdfMenuAnchor, setPdfMenuAnchor] = useState<null | HTMLElement>(null)
  const [textMenuAnchor, setTextMenuAnchor] = useState<null | HTMLElement>(null)
  const [designMenuAnchor, setDesignMenuAnchor] = useState<null | HTMLElement>(null)

  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()

  const handleOpenMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleCloseMobileMenu = () => {
    setMobileMenuAnchor(null)
  }

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null)
  }

  const handleNavigate = (path: string) => {
    handleCloseMobileMenu()
    closeCategoryMenus()
    router.push(path)
  }

  const closeCategoryMenus = () => {
    setPdfMenuAnchor(null)
    setTextMenuAnchor(null)
    setDesignMenuAnchor(null)
  }

  const isActiveCategory = (paths: string[]) => {
    return paths.some((path) => pathname === path)
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              alignItems: "center",
            }}
          >
            <HomeIcon sx={{ mr: 1 }} />
            Utility Tools
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenMobileMenu}
              color="inherit"
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
            >
              <MenuItem onClick={() => handleNavigate("/")}>
                <ListItemIcon>
                  <HomeIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Home</Typography>
              </MenuItem>

              <Divider />
              <Typography className={classes.categoryHeader}>PDF TOOLS</Typography>
              {pdfTools.map((tool) => (
                <MenuItem key={tool.path} onClick={() => handleNavigate(tool.path)} selected={pathname === tool.path}>
                  <ListItemIcon>{tool.icon}</ListItemIcon>
                  <Typography>{tool.name}</Typography>
                </MenuItem>
              ))}

              <Divider />
              <Typography className={classes.categoryHeader}>TEXT TOOLS</Typography>
              {textTools.map((tool) => (
                <MenuItem key={tool.path} onClick={() => handleNavigate(tool.path)} selected={pathname === tool.path}>
                  <ListItemIcon>{tool.icon}</ListItemIcon>
                  <Typography>{tool.name}</Typography>
                </MenuItem>
              ))}

              <Divider />
              <Typography className={classes.categoryHeader}>DESIGN TOOLS</Typography>
              {designTools.map((tool) => (
                <MenuItem key={tool.path} onClick={() => handleNavigate(tool.path)} selected={pathname === tool.path}>
                  <ListItemIcon>{tool.icon}</ListItemIcon>
                  <Typography>{tool.name}</Typography>
                </MenuItem>
              ))}

              <Divider />
              <MenuItem onClick={() => handleNavigate("/settings")} selected={pathname === "/settings"}>
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
            noWrap
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              alignItems: "center",
            }}
          >
            <HomeIcon sx={{ mr: 1, display: { xs: "flex", md: "none" } }} />
            Utility Tools
          </Typography>

          {/* Desktop Menu */}
          <Box className={classes.desktopMenu}>
            <Button
              onClick={() => handleNavigate("/")}
              className={`${classes.navButton} ${pathname === "/" ? classes.activeNavButton : ""}`}
              startIcon={<HomeIcon />}
            >
              Home
            </Button>

            {/* PDF Tools Dropdown */}
            <Box
              sx={{
                position: "relative",
                "&:hover > div": { display: "block" },
              }}
            >
              <Button
                className={`${classes.navButton} ${isActiveCategory(pdfTools.map((t) => t.path)) ? classes.activeNavButton : ""}`}
                endIcon={<KeyboardArrowDownIcon />}
                startIcon={<PictureAsPdfIcon />}
                aria-haspopup="true"
              >
                PDF Tools
              </Button>
              <Box
                sx={{
                  display: "none",
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  width: 220,
                  backgroundColor: "background.paper",
                  boxShadow: 3,
                  borderRadius: 1,
                  mt: 0.5,
                }}
              >
                {pdfTools.map((tool) => (
                  <MenuItem key={tool.path} onClick={() => handleNavigate(tool.path)} selected={pathname === tool.path}>
                    <ListItemIcon>{tool.icon}</ListItemIcon>
                    <Typography>{tool.name}</Typography>
                  </MenuItem>
                ))}
              </Box>
            </Box>

            {/* Text Tools Dropdown */}
            <Box
              sx={{
                position: "relative",
                "&:hover > div": { display: "block" },
              }}
            >
              <Button
                className={`${classes.navButton} ${isActiveCategory(textTools.map((t) => t.path)) ? classes.activeNavButton : ""}`}
                endIcon={<KeyboardArrowDownIcon />}
                startIcon={<TextFieldsIcon />}
                aria-haspopup="true"
              >
                Text Tools
              </Button>
              <Box
                sx={{
                  display: "none",
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  width: 220,
                  backgroundColor: "background.paper",
                  boxShadow: 3,
                  borderRadius: 1,
                  mt: 0.5,
                }}
              >
                {textTools.map((tool) => (
                  <MenuItem key={tool.path} onClick={() => handleNavigate(tool.path)} selected={pathname === tool.path}>
                    <ListItemIcon>{tool.icon}</ListItemIcon>
                    <Typography>{tool.name}</Typography>
                  </MenuItem>
                ))}
              </Box>
            </Box>

            {/* Design Tools Dropdown */}
            <Box
              sx={{
                position: "relative",
                "&:hover > div": { display: "block" },
              }}
            >
              <Button
                className={`${classes.navButton} ${isActiveCategory(designTools.map((t) => t.path)) ? classes.activeNavButton : ""}`}
                endIcon={<KeyboardArrowDownIcon />}
                startIcon={<PaletteIcon />}
                aria-haspopup="true"
              >
                Design Tools
              </Button>
              <Box
                sx={{
                  display: "none",
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  width: 220,
                  backgroundColor: "background.paper",
                  boxShadow: 3,
                  borderRadius: 1,
                  mt: 0.5,
                }}
              >
                {designTools.map((tool) => (
                  <MenuItem key={tool.path} onClick={() => handleNavigate(tool.path)} selected={pathname === tool.path}>
                    <ListItemIcon>{tool.icon}</ListItemIcon>
                    <Typography>{tool.name}</Typography>
                  </MenuItem>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right side icons */}
          <Box className={classes.rightSection}>
            {/* Theme toggle */}
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Settings button */}
            <Button
              className={`${classes.navButton} ${pathname === "/settings" ? classes.activeNavButton : ""}`}
              startIcon={<SettingsIcon />}
              onClick={() => handleNavigate("/settings")}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              Settings
            </Button>

            {/* User menu */}
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    <AccountCircleIcon />
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
              >
                {userSettings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => {
                      handleCloseUserMenu()
                      if (setting.path) {
                        router.push(setting.path)
                      }
                    }}
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
  )
}

