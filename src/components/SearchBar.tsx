import React, { useState } from "react";
import { InputBase, Paper, IconButton, useTheme } from "@mui/material";
import { Search, X } from "lucide-react";
import { Helmet } from "react-helmet";

const SearchBar: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your search submission logic here
    console.log("Search submitted:", searchTerm);
  };

  return (
    <>
      <Helmet>
        {/* Structured data for search functionality */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://kodekit.in",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://kodekit.in/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </Helmet>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        role="search"
        aria-label="Site search"
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
        <IconButton
          type="submit"
          sx={{ p: "10px" }}
          aria-label="Search"
          disabled={!searchTerm.trim()}
        >
          <Search
            size={20}
            color={
              searchTerm.trim()
                ? theme.palette.primary.main
                : theme.palette.text.secondary
            }
            aria-hidden="true"
          />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for tools..."
          inputProps={{
            "aria-label": "Search developer tools",
            role: "searchbox",
          }}
          value={searchTerm}
          onChange={handleChange}
          aria-required="true"
        />
        {searchTerm && (
          <IconButton
            size="small"
            onClick={handleClear}
            sx={{ p: "10px" }}
            aria-label="Clear search"
          >
            <X size={18} aria-hidden="true" />
          </IconButton>
        )}
      </Paper>
    </>
  );
};

export default SearchBar;
