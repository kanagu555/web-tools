"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme as useMuiTheme } from "@mui/material/styles"
import {
  Paper,
  Box,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Tabs,
  Tab,
  Divider,
  Grid,
  useMediaQuery,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import RestoreIcon from "@mui/icons-material/Restore"
import BrushIcon from "@mui/icons-material/Brush"
import TuneIcon from "@mui/icons-material/Tune"
import BuildIcon from "@mui/icons-material/Build"
import { useSettingsFormStyles } from "@/styles/styles"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  const classes = useSettingsFormStyles()

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box className={classes.tabPanel}>{children}</Box>}
    </div>
  )
}

export function SettingsForm() {
  const theme = useMuiTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const classes = useSettingsFormStyles()
  const [tabValue, setTabValue] = useState(0)
  const [settings, setSettings] = useState({
    theme: theme.palette.mode,
    sidebarCollapsed: false,
    notifications: true,
    autoSave: true,
    defaultTool: "pdf-converter",
  })

  // Update settings when theme changes
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      theme: theme.palette.mode,
    }))
  }, [theme.palette.mode])

  const handleSave = () => {
    // In a real app, this would save to localStorage or a backend
    alert("Settings saved successfully!")
  }

  const handleReset = () => {
    setSettings({
      theme: "light",
      sidebarCollapsed: false,
      notifications: true,
      autoSave: true,
      defaultTool: "pdf-converter",
    })
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Paper className={classes.paper}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="settings tabs"
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : undefined}
        >
          <Tab
            icon={isMobile ? undefined : <BrushIcon />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isMobile && <BrushIcon fontSize="small" />}
                <span>Appearance</span>
              </Box>
            }
          />
          <Tab
            icon={isMobile ? undefined : <TuneIcon />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isMobile && <TuneIcon fontSize="small" />}
                <span>Preferences</span>
              </Box>
            }
          />
          <Tab
            icon={isMobile ? undefined : <BuildIcon />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isMobile && <BuildIcon fontSize="small" />}
                <span>Tools</span>
              </Box>
            }
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Customize how the application looks and feels.
        </Typography>

        <FormControl component="fieldset" className={classes.formSection}>
          <FormLabel component="legend">Theme</FormLabel>
          <RadioGroup
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value as "light" | "dark" })}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControlLabel value="light" control={<Radio />} label="Light" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel value="dark" control={<Radio />} label="Dark" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel value="system" control={<Radio />} label="System" />
              </Grid>
            </Grid>
          </RadioGroup>
        </FormControl>

        <Box className={classes.switchItem}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.sidebarCollapsed}
                onChange={(e) => setSettings({ ...settings, sidebarCollapsed: e.target.checked })}
              />
            }
            label="Start with sidebar collapsed"
          />
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Configure your general application preferences.
        </Typography>

        <Box className={classes.switchItem}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              />
            }
            label="Enable notifications"
          />
        </Box>

        <Box className={classes.switchItem}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
              />
            }
            label="Automatically save changes"
          />
        </Box>

      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Tools
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Configure settings for individual tools.
        </Typography>

        <FormControl component="fieldset" className={classes.formSection}>
          <FormLabel component="legend">Default Tool</FormLabel>
          <RadioGroup
            value={settings.defaultTool}
            onChange={(e) => setSettings({ ...settings, defaultTool: e.target.value })}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControlLabel value="pdf-converter" control={<Radio />} label="PDF Converter" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel value="word-count" control={<Radio />} label="Word Count" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel value="color-palette" control={<Radio />} label="Color Palette" />
              </Grid>
            </Grid>
          </RadioGroup>
        </FormControl>
      </TabPanel>

      <Divider />

      <Box className={classes.actionButtons}>
        <Button
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={handleReset}
          className={classes.fullWidthOnMobile}
        >
          Reset to Defaults
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} className={classes.fullWidthOnMobile}>
          Save Changes
        </Button>
      </Box>
    </Paper>
  )
}




