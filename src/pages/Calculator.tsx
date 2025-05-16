import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const Calculator = () => {
  const theme = useTheme();
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const buttons = [
    'C', '(', ')', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '=', 'DEL'
  ];

  const handleClick = (value: string) => {
    switch (value) {
      case 'C':
        setDisplay('0');
        setEquation('');
        setIsNewNumber(true);
        break;
      case '=':
        try {
          const result = eval(equation);
          setDisplay(result.toString());
          setEquation(result.toString());
          setIsNewNumber(true);
        } catch (error) {
          setDisplay('Error');
          setIsNewNumber(true);
        }
        break;
      case 'DEL':
        if (display.length > 1) {
          const newDisplay = display.slice(0, -1);
          setDisplay(newDisplay);
          setEquation(equation.slice(0, -1));
        } else {
          setDisplay('0');
          setEquation('');
          setIsNewNumber(true);
        }
        break;
      default:
        if (isNewNumber) {
          setDisplay(value);
          setEquation(value);
          setIsNewNumber(false);
        } else {
          setDisplay(display + value);
          setEquation(equation + value);
        }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Scientific Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Perform complex mathematical calculations with ease.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              textAlign: 'right',
              minHeight: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography variant="h4" component="div" sx={{ wordBreak: 'break-all' }}>
              {display}
            </Typography>
          </Box>

          <Grid container spacing={1}>
            {buttons.map((btn) => (
              <Grid item xs={3} key={btn}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleClick(btn)}
                  sx={{
                    height: 60,
                    fontSize: '1.25rem',
                    backgroundColor: 
                      btn === '=' ? theme.palette.primary.main :
                      ['C', 'DEL'].includes(btn) ? theme.palette.error.main :
                      ['+', '-', '*', '/', '(', ')'].includes(btn) ? theme.palette.secondary.main :
                      theme.palette.background.default,
                    '&:hover': {
                      backgroundColor: 
                        btn === '=' ? theme.palette.primary.dark :
                        ['C', 'DEL'].includes(btn) ? theme.palette.error.dark :
                        ['+', '-', '*', '/', '(', ')'].includes(btn) ? theme.palette.secondary.dark :
                        theme.palette.action.hover,
                    },
                  }}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Calculator;