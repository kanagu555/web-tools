import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, useTheme, IconButton } from '@mui/material';
import { Upload, FileUp, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageToPdfConverter = () => {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).filter(file => file.type.startsWith('image/'));
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      if (direction === 'up' && index > 0) {
        [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
      } else if (direction === 'down' && index < newFiles.length - 1) {
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      }
      return newFiles;
    });
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsConverting(true);
    setDownloadLink(null);
    
    try {
      // Create a new jsPDF instance
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Process each image sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Convert the file to a data URL
        const dataUrl = await readFileAsDataURL(file);
        
        // Add a new page for each image after the first one
        if (i > 0) {
          doc.addPage();
        }
        
        // Add the image to the PDF
        doc.addImage(dataUrl, 'JPEG', 10, 10, 190, 277);
      }
      
      // Generate the PDF blob
      const pdfBlob = doc.output('blob');
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      setDownloadLink(url);
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      alert('Failed to convert images to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };
  
  // Helper function to read a file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Image to PDF Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Convert your images to PDF format quickly and easily. Supports JPG, PNG, and other common image formats.
        </Typography>

        <Paper
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            border: `2px dashed ${theme.palette.primary.main}40`,
            backgroundColor: `${theme.palette.primary.main}08`,
            textAlign: 'center',
            transition: 'all 0.2s ease',
            '&.drag-over': {
              backgroundColor: `${theme.palette.primary.main}15`,
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<Upload />}
              sx={{ mb: 2 }}
            >
              Select Images
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary">
            Drag and drop your images here, or click to select files
          </Typography>
        </Paper>

        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Selected Files ({selectedFiles.length})
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              {selectedFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: index < selectedFiles.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body1">{file.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveFile(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveFile(index, 'down')}
                      disabled={index === selectedFiles.length - 1}
                    >
                      <MoveDown size={16} />
                    </IconButton>
                    <Button
                      startIcon={<Trash2 size={16} />}
                      color="error"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))}
            </Paper>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleConvert}
                disabled={selectedFiles.length === 0 || isConverting}
                startIcon={isConverting ? null : <FileUp size={16} />}
              >
                {isConverting ? 'Converting...' : 'Convert to PDF'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setSelectedFiles([])}
                disabled={selectedFiles.length === 0 || isConverting}
              >
                Clear All
              </Button>
              {downloadLink && (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  href={downloadLink}
                  download="converted-images.pdf"
                >
                  Download PDF
                </Button>
              )}
            </Box>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default ImageToPdfConverter;
