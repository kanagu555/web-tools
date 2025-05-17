import React from "react";
import { Card, Typography, Box, useTheme, CardActionArea } from "@mui/material";
import {
  FileText,
  Text,
  Palette,
  Code,
  FileStack,
  Scissors,
  FileMinus,
  FileEdit,
  AlignCenter,
  Languages,
  TextCursor,
  Quote,
  Image,
  Projector as VectorBezier,
  Braces,
  FileJson,
  Calculator,
} from "lucide-react";
import { ToolItem } from "../data/toolsData";
import { useNavigate } from "react-router-dom";

interface ToolCardProps {
  tool: ToolItem;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    const iconProps = { size: 24, color: theme.palette.primary.main };
    const icons: { [key: string]: React.ReactNode } = {
      "file-text": <FileText {...iconProps} />,
      "file-stack": <FileStack {...iconProps} />,
      scissors: <Scissors {...iconProps} />,
      "file-minus": <FileMinus {...iconProps} />,
      "file-edit": <FileEdit {...iconProps} />,
      text: <Text {...iconProps} />,
      "align-center": <AlignCenter {...iconProps} />,
      languages: <Languages {...iconProps} />,
      "text-cursor": <TextCursor {...iconProps} />,
      quote: <Quote {...iconProps} />,
      palette: <Palette {...iconProps} />,
      image: <Image {...iconProps} />,
      "vector-bezier": <VectorBezier {...iconProps} />,
      braces: <Braces {...iconProps} />,
      code: <Code {...iconProps} />,
      "file-json": <FileJson {...iconProps} />,
      "calculator": <Calculator {...iconProps} />,
    };

    return icons[iconName] || <FileText {...iconProps} />;
  };

  const handleClick = () => {
    if (tool.route) {
      navigate(tool.route);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
          borderColor: theme.palette.primary.main,
          "& .tool-icon": {
            backgroundColor: `${theme.palette.primary.main}20`,
          },
        },
      }}
      onClick={handleClick}
    >
      <CardActionArea
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          height: "100%",
          padding: 2,
          pb: 3,
        }}
      >
        <Box
          className="tool-icon"
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            p: 1.5,
            mb: 2,
            transition: "background-color 0.3s ease",
          }}
        >
          {getIcon(tool.icon)}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
          {tool.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tool.description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default ToolCard;
