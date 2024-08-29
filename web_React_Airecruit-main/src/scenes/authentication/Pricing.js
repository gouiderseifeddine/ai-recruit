import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, useTheme, Switch, FormControlLabel } from "@mui/material";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const theme = useTheme();
  const colors = theme.palette;
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false); // State to track whether the price is annual or monthly

  const handleToggle = () => {
    setIsAnnual(!isAnnual);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/payment');
  };

  return (
    <Box m="20px" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header title="Pricing Plans" subtitle="Choose the plan that suits your needs" />
      <FormControlLabel
        control={
          <Switch
            checked={isAnnual}
            onChange={handleToggle}
            color="primary"

          />
        }
        label={
          <Typography variant="h5" sx={{ color: colors.info.dark, fontWeight: 'bold' }} >
            {isAnnual ? "Yearly" : "Monthly"}
          </Typography>
        }
        labelPlacement="start"
        sx={{
          margin: 0,
          '.MuiFormControlLabel-label': {
            ml: 1,
            fontWeight: 'bold',
          }
        }}
      />
      <Box display="flex" justifyContent="space-around" flexWrap="wrap" p={2} sx={{ width: '100%', maxWidth: 1200 }}>
        {/* Basic Plan Card */}
        <Card sx={{
          width: 360,
          m: 2,
          bgcolor: colors.background.paper,
          boxShadow: 6,
          borderRadius: 2,
          transition: '0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 10,
          }
        }}>
          <CardContent>
            <Typography gutterBottom variant="h1" component="div" sx={{ color: colors.primary.dark }}>
              Starter
            </Typography>
            <Typography variant="h2" color="secondary" sx={{ fontWeight: 'bold' }}>
              {isAnnual ? "$90/Year" : "$9/Month"}
            </Typography>
            <Typography sx={{ my: 2, fontSize: 20 }} color="text.secondary">
              Includes:
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
              30 Limited Job Postings
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
              Manage Job Applications
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
              No IA Analysis
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
              No IA Quiz Generation
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
              No IA Meeting Interview
            </Typography>
            <Button onClick={handleSubmit} variant="contained" fullWidth sx={{
              bgcolor: colors.grey[400],
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: colors.grey[700]
              }
            }}>
              Choose Starter
            </Button>
          </CardContent>
        </Card>

        {/* Premiered Plan Card */}
        <Card sx={{
          width: 360,
          m: 2,
          bgcolor: colors.background.paper,
          boxShadow: 6,
          borderRadius: 2,
          transition: '0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 10,
          }
        }}>
          <CardContent>
            <Typography gutterBottom variant="h1" component="div" sx={{ color: colors.secondary.dark }}>
              Pro
            </Typography>
            <Typography variant="h2" color="secondary" sx={{ fontWeight: 'bold' }}>
              {isAnnual ? "$290/year" : "$29/Month"}
            </Typography>
            <Typography sx={{ my: 2, fontSize: 20 }} color="text.secondary">
              Includes:
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
              Unlimited Job Postings
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
              IA Analysis
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
              CV Analysis
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
              IA Quiz Generation
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
              IA Meeting Interview
            </Typography>
            <Button onClick={handleSubmit} variant="contained" fullWidth sx={{
              bgcolor: colors.secondary.main,
              fontWeight: 'bold',

              '&:hover': {
                bgcolor: colors.secondary.dark
              }
            }}>
              Choose Pro
            </Button>

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Pricing;
