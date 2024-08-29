import React from 'react';
import { Box, Card, CardContent, Typography, Button, useTheme } from "@mui/material";
import Header from "../../components/Header";

const Pricing = () => {
  const theme = useTheme();
  const colors = theme.palette;

  return (
    <Box m="20px" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header title="Pricing Plans" subtitle="Choose the plan that suits your needs" color="grey" />
      <Box display="flex" justifyContent="space-around" color="grey" flexWrap="wrap" p={2} sx={{ width: '100%', maxWidth: 1200 }}>
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
              Basic
            </Typography>
            <Typography variant="h2" color="secondary" sx={{ fontWeight: 'bold' }}>
              100$
            </Typography>
            <Typography sx={{ my: 2, fontSize: 20 }} color="text.secondary">
              Includes:
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
              30 Limited Job Postings
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
              Manage Job Applications
            </Typography>
            <Button variant="contained" fullWidth sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark }, }}>
              Choose Basic
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
              Premiered
            </Typography>
            <Typography variant="h2" color="secondary" sx={{ fontWeight: 'bold' }}>
              300$
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
            <Button variant="contained" fullWidth sx={{ bgcolor: colors.secondary.main, '&:hover': { bgcolor: colors.secondary.dark } }}>
              Choose Premiered
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Pricing;
