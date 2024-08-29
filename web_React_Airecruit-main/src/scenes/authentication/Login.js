import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Grid,
  Box,
  Card,
  Stack,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/container/PageContainer";
import Logo from "../../layouts/full/shared/logo/Logo";

// import { io } from 'socket.io-client';
import { AuthContext } from "./AuthContext";
import { BASE_URL } from "../../constants/config";
// const socket = io('http://172.20.10.4:8000');

const QRCode = ({ qrCode }) => (
  <div>
    {qrCode ? (
      <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
    ) : (
      <p>Loading QR code...</p>
    )}
  </div>
);

const Login2 = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [qrCode, setQrCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { setToken } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/signin`, {
        email: formData.email,
        password: formData.password,
      });

      setToken(response.data.token);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);

      navigate("/Pricing");
    } catch (error) {
      console.error("Authentication failed:", error);
      localStorage.removeItem("token");
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data); // Set the error message if present in the error response
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/generate_qr`)
      .then((response) => {
        const { qr_code, session_id } = response.data;

        setQrCode(qr_code);
        console.log("Session ID :", session_id); // Log session ID for debugging

        const handleAuthentication = (data) => {
          if (data.session_id === session_id) {
            console.log("Authenticated!");
            setToken(data.user_id);
            localStorage.setItem("token", data.user_id);
            localStorage.setItem("refreshToken", data.refresh_token);
            navigate("/Pricing"); // Assuming you are receiving a token and you have a setToken method available
          }
        };

        //socket.on('authenticated', handleAuthentication);
      })
      .catch((error) => console.error("Error fetching QR code:", error));

    // Clean up socket.io listeners
    return () => {
      //socket.off('authenticated');
    };
  }, [navigate, setToken]); // Add navigate to the dependency array to ensure it doesn't cause re-render issues

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Login
                </Button>
              </form>
              {errorMessage && (
                <Typography color="error" variant="body2" align="center">
                  {errorMessage}
                </Typography>
              )}
              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="500">
                  New to Modernize?
                </Typography>
                <Typography
                  component={Link}
                  to="/register"
                  fontWeight="500"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  Create an account
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <QRCode qrCode={qrCode} />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login2;
