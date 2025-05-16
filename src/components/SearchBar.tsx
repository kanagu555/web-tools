import React, { useState } from "react";
import { InputBase, Paper, IconButton, useTheme } from "@mui/material";
import { Search, X } from "lucide-react";

const SearchBar: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <Paper
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
        placeholder="Search for tools..."
        inputProps={{ "aria-label": "search for tools" }}
        value={searchTerm}
        onChange={handleChange}
      />
      {searchTerm && (
        <IconButton size="small" onClick={handleClear} sx={{ p: "10px" }}>
          <X size={18} />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBar;
