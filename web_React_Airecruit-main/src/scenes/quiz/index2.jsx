import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { tokens } from "../../theme";

const Result = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching applications
        const applicationsResponse = await axios.get(
          "http://192.168.1.108:8000/applications"
        );
        const applications = applicationsResponse.data;

        const enrichedData = await Promise.all(
          applications.map(async (application) => {
            // Fetching candidate details
            const candidateResponse = await axios.get(
              `http://192.168.1.108:8000/onecandidat/${application.idCandidat}`
            );
            const candidate = candidateResponse.data;

            // Fetching quiz details by recruiter ID
            const idRecruiter = localStorage.getItem("userId");
            const quizResponse = await axios.get(
              `http://192.168.1.108:8000/testQuizByRecruter/${idRecruiter}`
            );
            const quizzes = quizResponse.data.filter(
              (quiz) => quiz.idCandidat === application.idCandidat
            );
            const quizScore = quizzes.length > 0 ? quizzes[0].score : 0;

            // Fetching job details
            const jobResponse = await axios.get(
              `http://192.168.1.108:8000/jobs/${application.idJob}`
            );
            const job = jobResponse.data;

            // Calculate final score
            const interviewScore = 90; // Static value for now
            const finalScore = (
              (application.totalScore + quizScore + interviewScore) /
              3
            ).toFixed(2);

            return {
              id: application._id,
              user_name: candidate.name || "Unknown",
              job_title: job.jobTitle || "Unknown",
              application_score: application.totalScore,
              quiz_score: quizScore,
              interview_score: interviewScore,
              final_score: finalScore,
              application_status: application.applicationStatus,
            };
          })
        );

        setRows(enrichedData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === "accepted") {
        await axios.put(`http://192.168.1.108:8000/acceptApplication/${id}`);
      } else {
        await axios.put(`http://192.168.1.108:8000/refuseApplication/${id}`);
      }
      // Optionally, refresh the data or update the state after the action
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, application_status: action } : row
      );
      setRows(updatedRows);
    } catch (error) {
      console.error(`Failed to ${action} application with ID ${id}`, error);
    }
  };

  const columns = [
    { field: "user_name", headerName: "User Name", flex: 1 },
    { field: "job_title", headerName: "Job Title", flex: 1 },
    { field: "application_score", headerName: "Application Score", flex: 1 },
    { field: "quiz_score", headerName: "Quiz Score", flex: 1 },
    { field: "interview_score", headerName: "Interview Score", flex: 1 },
    { field: "final_score", headerName: "Final Score", flex: 1 },
    {
      field: "application_status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const { id, application_status } = params.row;

        if (application_status === "in progress") {
          return (
            <Box display="flex" justifyContent="space-evenly">
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAction(id, "accepted")}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleAction(id, "refused")}
              >
                Refuse
              </Button>
            </Box>
          );
        } else if (application_status === "accepted") {
          return (
            <Typography color="green" fontWeight="bold">
              Accepted
            </Typography>
          );
        } else if (application_status === "refused") {
          return (
            <Typography color="red" fontWeight="bold">
              refused
            </Typography>
          );
        } else {
          return <Typography>{application_status}</Typography>;
        }
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="AI Recruit" subtitle="Managing the Final Result" />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default Result;
