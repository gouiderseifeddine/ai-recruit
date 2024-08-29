import {
  Box,
  Typography,
  useTheme,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Swal from "sweetalert2";
import { BASE_URL } from "../../constants/config";

const TestQuiz = () => {
  const [testquizs, setTestQuizs] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idRecruiter: "",
    idCandidat: "",
    jobTitle: "",
    interviewDate: "",
    interviewLocation: "",
  });

  useEffect(() => {
    fetchTestQuizs();
  }, []);

  const fetchTestQuizs = async () => {
    try {
      const idRecruter = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/testQuizByRecruter/${idRecruter}`
      );
      console.log("Response:", response.data);
      setTestQuizs(response.data);
    } catch (error) {
      console.error("Error fetching testquizs:", error);
    }
  };

  const fetchQuiz = async (idquiz) => {
    try {
      const response = await axios.get(`${BASE_URL}/onequiz/${idquiz}`);
      console.log("quiz:", response.data);
      return response.data.theme;
    } catch (error) {
      console.error("Error fetching quiz:", error);
      return null;
    }
  };

  const fetchCandidat = async (idcandidat) => {
    try {
      const response = await axios.get(`${BASE_URL}/onecandidat/${idcandidat}`);
      console.log("candidat:", response.data);
      return response.data.name;
    } catch (error) {
      console.error("Error fetching candidat:", error);
      return null;
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this test quiz!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`${BASE_URL}/delete_test_quiz/${id}`);
        Swal.fire("Deleted!", "Test quiz has been deleted.", "success");
        fetchTestQuizs();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleScheduleClick = (quiz) => {
    setFormData({
      idRecruiter: quiz.idRecruter,
      idCandidat: quiz.idCandidat,
      jobTitle: quiz.theme_quiz, // Replace with actual job title from quiz data
      interviewDate: "",
      interviewLocation: "",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/interviews`, formData);
      setIsModalOpen(false);
      alert("Interview scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  useEffect(() => {
    const createTableData = async () => {
      const newTableData = [];
      for (const testquiz of testquizs) {
        const idTestQuiz = testquiz._id;
        const date = testquiz.date;
        const score = testquiz.score;
        const status = testquiz.status;

        const nomCandidat = await fetchCandidat(testquiz.idCandidat);
        const themeQuiz = await fetchQuiz(testquiz.idQuiz);

        newTableData.push({
          _id: idTestQuiz,
          nom_candidat: nomCandidat,
          theme_quiz: themeQuiz,
          date: date,
          score: score * 10,
          status: status,
        });
      }
      setTableData(newTableData);
    };

    createTableData();
  }, [testquizs]);

  const determineScoreTextColor = (score) => {
    if (score <= 50) return "red";
    else if (score > 50 && score <= 70) return "orange";
    else return "green";
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "nom_candidat", headerName: "Candidat", flex: 1 },
    { field: "theme_quiz", headerName: "Theme Quiz", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "score",
      headerName: "Score",
      flex: 1,
      renderCell: (params) => {
        return (
          <div style={{ color: determineScoreTextColor(params.value) }}>
            {params.value} %
          </div>
        );
      },
    },
    {
      field: "delete",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={() => handleDelete(row._id)}
            sx={{ marginRight: 1 }}
          >
            Delete
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              handleScheduleClick(row);
              console.log(row);
            }}
          >
            Schedule Interview
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="AI Recruit" subtitle="Managing Test Quizs" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          checkboxSelection
          rows={tableData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row._id}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        />
      </Box>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Schedule Interview
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Interview Date"
              name="interviewDate"
              type="date"
              value={formData.interviewDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Interview Location"
              name="interviewLocation"
              value={formData.interviewLocation}
              onChange={handleInputChange}
            />
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary">
                Schedule
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default TestQuiz;
