import { useEffect, useState } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import listPlugin from "@fullcalendar/list";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { BASE_URL } from "../../constants/config";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    userEmail: "",
  });
  const navigate = useNavigate();
  const [jobTitles, setJobTitles] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/interviews`);
        const events = response.data.map((interview) => ({
          id: interview.idInterview,
          title: interview.jobTitle,
          start: interview.interviewDate,
          userEmail: interview.idCandidat,
        }));
        setCurrentEvents(events);
        console.log("Interviews fetched:", events);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    const fetchJobTitles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/jobs`);
        const titles = response.data.map((job) => job.jobTitle);
        setJobTitles(titles);
        console.log("Job titles fetched:", titles);
      } catch (error) {
        console.error("Error fetching job titles:", error);
      }
    };

    fetchEvents();
    fetchJobTitles();
  }, []);

  const handleDateClick = (selectInfo) => {
    const start = new Date(selectInfo.startStr);
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + 30); // Adjust end time to +30 minutes

    setNewEvent({
      title: "",
      start: start.toISOString(),
      end: end.toISOString(),
      userEmail: "",
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/interviews`, {
        interviewDate: newEvent.start,
        interviewTitle: newEvent.title,
        idCandidat: newEvent.userEmail,
      });
      setCurrentEvents([
        ...currentEvents,
        { ...newEvent, id: response.data.idInterview },
      ]);
      setOpenModal(false);
      setNewEvent({ title: "", start: "", end: "", userEmail: "" });
      console.log("Interview created:", response.data);
    } catch (error) {
      console.error("Error creating interview:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="center" mb={2}>
        <IconButton onClick={() => navigate("/bar")}>
          <BarChartOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/pie")}>
          <PieChartOutlineOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/line")}>
          <TimelineOutlinedIcon />
        </IconButton>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Interviews</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.grey[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            events={currentEvents}
          />
        </Box>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Interview</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Job Title</InputLabel>
            <Select
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            >
              {jobTitles.map((title, index) => (
                <MenuItem key={index} value={title}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            label="Candidate Email"
            type="email"
            value={newEvent.userEmail}
            onChange={(e) =>
              setNewEvent({ ...newEvent, userEmail: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Interview Date"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={newEvent.start}
            onChange={(e) =>
              setNewEvent({ ...newEvent, start: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="End Time"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
