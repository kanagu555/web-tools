"use client";

import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    useTheme,
    IconButton,
    Tooltip,
    Alert,
    Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import { Download, Image as ImageIcon, Copy } from "lucide-react";
import JSZip from "jszip";
import AdSense from "../AdSense";
import Navigation from "@/components/Navigation";

const ICON_SIZES = [16, 32, 48, 128];

const ChromeExtensionIconGenerator = () => {
    const theme = useTheme();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [generatedIcons, setGeneratedIcons] = useState<{ [key: number]: string }>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.type.startsWith("image/")) {
                setSelectedFile(file);
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                generatePreviews(url);
            }
        }
    };

    const generatePreviews = (url: string) => {
        const img = new Image();
        img.onload = () => {
            const newIcons: { [key: number]: string } = {};
            ICON_SIZES.forEach((size) => {
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, size, size);
                    newIcons[size] = canvas.toDataURL("image/png");
                }
            });
            setGeneratedIcons(newIcons);
        };
        img.src = url;
    };

    const handleDownload = async () => {
        if (!selectedFile) return;
        setIsGenerating(true);

        try {
            const zip = new JSZip();
            const iconsFolder = zip.folder("icons");

            if (iconsFolder) {
                // We can use the generated data URLs to create blobs
                for (const size of ICON_SIZES) {
                    const dataUrl = generatedIcons[size];
                    if (dataUrl) {
                        const response = await fetch(dataUrl);
                        const blob = await response.blob();
                        iconsFolder.file(`icon${size}.png`, blob);
                    }
                }

                const content = await zip.generateAsync({ type: "blob" });
                const url = URL.createObjectURL(content);
                const link = document.createElement("a");
                link.href = url;
                link.download = "chrome-extension-icons.zip";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setSnackbarMessage("Icons downloaded successfully!");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error generating zip:", error);
            setSnackbarMessage("Error generating icons. Please try again.");
            setSnackbarOpen(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setGeneratedIcons({});
    };

    const copyManifestCode = () => {
        const code = `"icons": {
  "16": "icons/icon16.png",
  "32": "icons/icon32.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}`;
        navigator.clipboard.writeText(code);
        setSnackbarMessage("Manifest code copied to clipboard!");
        setSnackbarOpen(true);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }} component="main">
            <Navigation />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    fontWeight={700}
                    sx={{ fontSize: "2.5rem" }}
                >
                    Chrome Extension Icon Generator
                </Typography>
                <Typography
                    variant="h3"
                    component="h2"
                    color="text.secondary"
                    paragraph
                    sx={{ fontSize: "1.25rem", fontWeight: 400 }}
                >
                    Generate all required icon sizes for your Chrome Extension in one click.
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                height: "100%",
                            }}
                        >
                            <Typography variant="h5" gutterBottom fontWeight={600}>
                                Upload Image
                            </Typography>

                            {!previewUrl ? (
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: 300,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: theme.palette.background.default,
                                        borderRadius: 2,
                                        border: `2px dashed ${theme.palette.divider}`,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            borderColor: theme.palette.primary.main,
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }}
                                    component="label"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        style={{ display: "none" }}
                                    />
                                    <ImageIcon size={48} color={theme.palette.text.secondary} />
                                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                                        Click or drag image here
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Recommended: 512x512px or larger
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: "center" }}>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: 300,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: theme.palette.background.default,
                                            borderRadius: 2,
                                            mb: 2,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <img
                                            src={previewUrl}
                                            alt="Original"
                                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                        />
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleReset}
                                    >
                                        Remove & Upload New
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                height: "100%",
                            }}
                        >
                            <Typography variant="h5" gutterBottom fontWeight={600}>
                                Generated Icons
                            </Typography>

                            {Object.keys(generatedIcons).length > 0 ? (
                                <Box>
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        {ICON_SIZES.map((size) => (
                                            <Grid item xs={3} key={size} sx={{ textAlign: "center" }}>
                                                <Box
                                                    sx={{
                                                        p: 1,
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 1,
                                                        display: "inline-block",
                                                        mb: 1,
                                                        backgroundColor: "#fff", // Checkerboard pattern could be better but white is fine
                                                    }}
                                                >
                                                    <img
                                                        src={generatedIcons[size]}
                                                        alt={`${size}x${size}`}
                                                        width={size}
                                                        height={size}
                                                    />
                                                </Box>
                                                <Typography variant="caption" display="block">
                                                    {size}x{size}
                                                </Typography>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        startIcon={<Download />}
                                        onClick={handleDownload}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? "Generating..." : "Download Icons (ZIP)"}
                                    </Button>

                                    <Box sx={{ mt: 4 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                manifest.json snippet
                                            </Typography>
                                            <Tooltip title="Copy to clipboard">
                                                <IconButton size="small" onClick={copyManifestCode}>
                                                    <Copy size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Box
                                            component="pre"
                                            sx={{
                                                p: 2,
                                                borderRadius: 1,
                                                backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
                                                overflowX: "auto",
                                                fontSize: "0.875rem",
                                                border: `1px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            {`"icons": {
  "16": "icons/icon16.png",
  "32": "icons/icon32.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}`}
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        height: 300,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        Upload an image to see generated icons
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                <AdSense adSlot="4552615729" />

                <Box sx={{ mt: 6 }}>
                    {/* Features Section */}
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: "background.paper",
                            border: "1px solid divider",
                            mb: 4,
                        }}
                    >
                        <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
                            Why Use Our Chrome Extension Icon Generator?
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: "center", p: 2 }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: "50%",
                                            backgroundColor: "primary.main",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mx: "auto",
                                            mb: 2,
                                        }}
                                    >
                                        <Download size={24} color="white" />
                                    </Box>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Instant Generation
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Generate all required icon sizes (16, 32, 48, 128) instantly
                                        from a single image upload.
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: "center", p: 2 }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: "50%",
                                            backgroundColor: "success.main",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mx: "auto",
                                            mb: 2,
                                        }}
                                    >
                                        <Copy size={24} color="white" />
                                    </Box>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Manifest Snippet
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Get the exact JSON code snippet for your manifest.json file
                                        ready to copy and paste.
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: "center", p: 2 }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: "50%",
                                            backgroundColor: "warning.main",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mx: "auto",
                                            mb: 2,
                                        }}
                                    >
                                        <img src="/favicon.ico" width={24} height={24} alt="Free" />
                                    </Box>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Completely Free
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Free to use with no limits. All processing happens locally in
                                        your browser for maximum privacy.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* How It Works Section */}
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: "background.paper",
                            border: "1px solid divider",
                            mb: 4,
                        }}
                    >
                        <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
                            How to Generate Chrome Extension Icons
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: "center", p: 2 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: "bold",
                                            mb: 2,
                                        }}
                                    >
                                        1
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Upload Image
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Upload your high-resolution logo or icon image (recommended
                                        512x512px).
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: "center", p: 2 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: "bold",
                                            mb: 2,
                                        }}
                                    >
                                        2
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Preview
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Instantly see how your icon looks in all required Chrome
                                        extension sizes.
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: "center", p: 2 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: "bold",
                                            mb: 2,
                                        }}
                                    >
                                        3
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Download ZIP
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Download all icons neatly organized in a ZIP file with correct
                                        filenames.
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: "center", p: 2 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: "bold",
                                            mb: 2,
                                        }}
                                    >
                                        4
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Copy JSON
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Copy the generated manifest.json snippet and paste it into your
                                        project.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Benefits Section */}
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: "background.paper",
                            border: "1px solid divider",
                            mb: 4,
                        }}
                    >
                        <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
                            Key Benefits
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: "success.main",
                                            mt: 1,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Standard Compliant
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Generates icons in 16x16, 32x32, 48x48, and 128x128 sizes as
                                            required by the Chrome Web Store.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: "success.main",
                                            mt: 1,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Privacy First
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Your images are processed locally in your browser. No data is
                                            uploaded to any server.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: "success.main",
                                            mt: 1,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Time Saving
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Skip manual resizing in Photoshop. Get all assets and code
                                            in seconds.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: "success.main",
                                            mt: 1,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Developer Friendly
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Includes a ready-to-use JSON snippet for your manifest.json
                                            "icons" object.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* FAQ Section */}
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: "background.paper",
                            border: "1px solid divider",
                        }}
                    >
                        <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
                            Frequently Asked Questions
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                What image format should I upload?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                We recommend uploading a high-quality PNG or JPG image. A square
                                image of at least 128x128 pixels (ideally 512x512) works best to
                                ensure quality across all sizes.
                            </Typography>

                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Why do I need multiple icon sizes?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Chrome uses different sizes for different contexts: 16x16 for the
                                favicon, 32x32 for Windows, 48x48 for the extensions page, and
                                128x128 for the Chrome Web Store and installation. For more details,
                                check the{" "}
                                <a
                                    href="https://developer.chrome.com/docs/extensions/reference/manifest/icons"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: theme.palette.primary.main, textDecoration: "none" }}
                                >
                                    official documentation
                                </a>
                                .
                            </Typography>

                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Is this tool free?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Yes, this tool is completely free to use for both personal and
                                commercial projects.
                            </Typography>

                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Where do I put the icons in my project?
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Typically, you create an "icons" folder in your extension's root
                                directory and place the generated images there. Then update your
                                manifest.json with the provided snippet.
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
                <AdSense adSlot="6613251015" />
            </motion.div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ChromeExtensionIconGenerator;
