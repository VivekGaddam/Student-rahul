import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const Header = () => {
  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#1a237e',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: '0.5rem 2rem'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '1rem'
        }}>
          <SchoolIcon sx={{ 
            fontSize: '2.5rem',
            color: '#ffffff'
          }} />
          <Typography variant="h4" component="h1" sx={{
            fontWeight: '600',
            letterSpacing: '0.5px',
            color: '#ffffff',
            textTransform: 'uppercase',
            fontFamily: '"Roboto Condensed", sans-serif'
          }}>
            Student Management System
          </Typography>
        </Box>
        
        <Typography variant="subtitle1" sx={{
          fontWeight: '500',
          color: 'rgba(255,255,255,0.9)',
          fontStyle: 'italic',
          fontSize: '1.1rem'
        }}>
          WT Assignment 2 - MERN Stack
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;