import React, { useState } from 'react';
import { Box, Container, Typography, Button, Paper, useTheme, IconButton } from '@mui/material';
import { Upload, FileText, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { motion } from 'framer-motion';

const PdfMerger = () => {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
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

  const handleMerge = () => {
    // Implement PDF merging logic here
    console.log('Merging files:', selectedFiles);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          PDF Merger
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Combine multiple PDF files into a single document. Arrange them in any order you want.
        </Typography>

        <Paper
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            border: `2px dashed ${theme.palette.primary.main}40`,
            backgroundColor: `${theme.palette.primary.main}08`,
            textAlign: 'center',
          }}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".pdf"
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
              Select PDF Files
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary">
            Drag and drop your PDF files here, or click to select files
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
                    <FileText size={20} />
                    <Typography>{file.name}</Typography>
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

            <Button
              variant="contained"
              size="large"
              onClick={handleMerge}
              sx={{ mt: 4 }}
              disabled={selectedFiles.length < 2}
            >
              Merge PDFs
            </Button>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default PdfMerger;