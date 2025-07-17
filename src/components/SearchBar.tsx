/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  InputBase,
  Paper,
  IconButton,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Popper,
  ClickAwayListener,
  Typography,
} from "@mui/material";
import {
  Search,
  X,
  FileText,
  Text,
  Palette,
  Code,
  Calculator,
  DollarSign,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toolsData, toolCategories } from "../data/toolsData";

const SearchBar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (categoryId: string) => {
    const iconProps = { size: 20, color: theme.palette.primary.main };
    const icons: { [key: string]: React.ReactNode } = {
      pdf: <FileText {...iconProps} />,
      text: <Text {...iconProps} />,
      design: <Palette {...iconProps} />,
      developer: <Code {...iconProps} />,
      math: <Calculator {...iconProps} />,
      finance: <DollarSign {...iconProps} />,
      health: <Activity {...iconProps} />,
    };
    return icons[categoryId] || <Search {...iconProps} />;
  };

  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      const filtered = [
        // Search in tools
        ...toolsData
          .filter(
            (tool) =>
              tool.route && // Only show tools that have routes (are implemented)
              (tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tool.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
          )
          .map((tool) => ({ ...tool, type: "tool" })),
        // Search in categories
        ...toolCategories
          .filter((category) =>
            category.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((category) => ({ ...category, type: "category" })),
      ].slice(0, 6); // Limit to 6 results for better UX

      setFilteredResults(filtered);
      setIsOpen(true);
    } else {
      setFilteredResults([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleResultClick = (result: any) => {
    if (result.type === "tool" && result.route) {
      navigate(result.route);
    } else if (result.type === "category" && result.route) {
      navigate(result.route);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredResults.length > 0) {
      handleResultClick(filteredResults[0]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative", width: "100%" }}>
        <Paper
          ref={anchorRef}
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            p: "4px 12px",
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
              borderColor: theme.palette.primary.main,
            },
            "&:focus-within": {
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="search">
            <Search size={20} color={theme.palette.text.secondary} />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search tools (min 3 characters)..."
            inputProps={{ "aria-label": "search for tools" }}
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <IconButton size="small" onClick={handleClear} sx={{ p: "10px" }}>
              <X size={18} />
            </IconButton>
          )}
        </Paper>

        <Popper
          open={isOpen && filteredResults.length > 0}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{
            width: anchorRef.current?.offsetWidth || "auto",
            zIndex: 1300,
            mt: 1,
          }}
        >
          <Paper
            elevation={12}
            sx={{
              maxHeight: 400,
              overflow: "auto",
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <List sx={{ py: 1 }}>
              {filteredResults.map((result) => (
                <ListItem
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}08`,
                      transform: "translateX(4px)",
                      boxShadow: `inset 3px 0 0 ${theme.palette.primary.main}`,
                    },
                    py: 2,
                    px: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: `${theme.palette.primary.main}10`,
                      borderRadius: 2,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getCategoryIcon(result.category || result.id)}
                  </ListItemIcon>
                  <ListItemText
                    primary={result.title}
                    secondary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {result.description ||
                            `Browse ${result.title.toLowerCase()}`}
                        </Typography>
                        {result.type === "category" && (
                          <Box
                            component="span"
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              backgroundColor: `${theme.palette.secondary.main}20`,
                              color: theme.palette.secondary.main,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Category
                          </Box>
                        )}
                        {result.popular && (
                          <Box
                            component="span"
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              backgroundColor: `${theme.palette.success.main}20`,
                              color: theme.palette.success.main,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            Popular
                          </Box>
                        )}
                      </Box>
                    }
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "1rem",
                      color: theme.palette.text.primary,
                    }}
                    secondaryTypographyProps={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                      component: "div",
                    }}
                    sx={{ ml: 2 }}
                  />
                </ListItem>
              ))}
              {searchTerm.length >= 3 && filteredResults.length === 0 && (
                <ListItem sx={{ py: 3, textAlign: "center" }}>
                  <ListItemText
                    primary="No tools found"
                    secondary="Try different keywords"
                    primaryTypographyProps={{
                      color: theme.palette.text.secondary,
                      textAlign: "center",
                    }}
                    secondaryTypographyProps={{
                      color: theme.palette.text.disabled,
                      textAlign: "center",
                    }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
