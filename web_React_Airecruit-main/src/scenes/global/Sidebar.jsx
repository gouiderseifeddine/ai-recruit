import { useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout'; // Import the logout icon

import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Money, Note, NoteAlt, Quiz, QuizRounded, QuizSharp, Report, ResetTv, WorkHistory, WorkOutlineRounded } from "@mui/icons-material";
import { refreshToken } from '../authentication/tokenUtils';  // Import the refreshToken function
import axios from 'axios';
import { BASE_URL } from '../../constants/config'
const handleLogout = () => {
  localStorage.removeItem('token'); // Clears the stored token
  window.location.href = '/login'; // Redirects user to login page
};

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.primary[500],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [user, setUser] = useState({ name: "Loading...", profile_picture: "" });

  useEffect(() => {
    const fetchData = async () => {
      // Get token from local storage or however it's stored
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/tokenIsValid`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data) {
          setUser({ name: response.data.user.name, profile_picture: response.data.user.profile_picture });
          console.log(user.name)

        }
        if (response.status === 500) {
          console.log('response', response.status)
          try {
            const newToken = await refreshToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            const response = await axios.get('/tokenIsValid', { headers: { Authorization: `Bearer ${newToken}` } });
            setUser({ name: response.data.user.name, profile_picture: response.data.user.profile_picture });
            console.log(user)
          } catch (refreshError) {
            console.error('Error after refreshing token', refreshError);
          }

        }

      } catch (error) {
        if (error.response || error.response.status === 500 || error.response.status === 401) {
          try {
            const newToken = await refreshToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            const response = await axios.get('/tokenIsValid', { headers: { Authorization: `Bearer ${newToken}` } });
            setUser({ name: response.data.user.name, profile_picture: response.data.user.profile_picture });
            console.log(user)
          } catch (refreshError) {
            console.error('Error after refreshing token', refreshError);
          }
        } else {
          console.error('Error fetching user data', error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#878FE9 !important",
        },
        "& .pro-menu-item.active": {
          color: "#2837E5 !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.primary[500]}>
                  Welcome Back
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={user.profile_picture || '../../assets/user.png'}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.primary[500]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.name}
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    width="100px"
                    height="30px"
                    src={'../../assets/logo.png'}
                  />
                </Box>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>


            <Typography
              variant="h6"
              color={colors.primary[500]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Jobs"
              to="/"
              icon={<WorkOutlineRounded />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Interview"
              to="/Recruitment"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="quizs"
              to="/quizs"
              icon={<QuizRounded />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="test quiz"
              to="/testquiz"
              icon={<QuizSharp />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Result Application"
              to="/contacts"
              icon={<WorkHistory />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Final Result"
              to="/result"
              icon={<NoteAlt />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Offre"
              to="/Pricing"
              icon={<Money />}
              selected={selected}
              setSelected={setSelected}
            />
            <MenuItem
              icon={<LogoutIcon />}
              onClick={handleLogout}  // Attach the logout handler
              style={{
                color: colors.primary[500],

                marginTop: 'auto',  // Pushes the logout button to the bottom of the sidebar if desired
              }}
            >
              Logout
            </MenuItem>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
