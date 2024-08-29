import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, IconButton } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Link } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PageviewIcon from "@mui/icons-material/Info";
import Swal from "sweetalert2";
import { BASE_URL } from "../../constants/config";

const Quiz = () => {
  const [quizs, setquizs] = useState([]);

  useEffect(() => {
    fetchQuizs();
  }, []);

  const fetchQuizs = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `${BASE_URL}/allQuizByRecruter/${userId}`
      );
      console.log("Response:", response.data); // Log the response data
      setquizs(response.data); // Set the state with response data
    } catch (error) {
      console.error("Error fetching quizs:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Afficher une alerte de confirmation avant la suppression
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this quiz!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      // Si l'utilisateur clique sur "Oui"
      if (result.isConfirmed) {
        await axios.delete(`${BASE_URL}/delete_quiz/${id}`);
        // Afficher une alerte de suppression réussie
        Swal.fire("Deleted!", "Your quiz has been deleted.", "success");
        // Re-fetch quizs after deletion
        fetchQuizs();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "theme", headerName: "THEME", flex: 1 },
    {
      field: "Show",
      headerName: "SHOW",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          startIcon={<PageviewIcon />}
          component={Link}
          to={`/voirquiz/${row._id}`}
          color="success"
        >
          Show
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "DELETE",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          startIcon={<DeleteOutlineOutlinedIcon />}
          onClick={() => handleDelete(row._id)}
          color="error"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="AI Recruit" subtitle="Managing the Quiz" />
      <Box m="20px">
        <Button
          variant="contained"
          color="grey"
          startIcon={<AddOutlinedIcon />}
          component={Link}
          to="/formQuiz"
        >
          Add Quiz
        </Button>
      </Box>
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
          checkboxSelection
          rows={quizs}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  );
};

export default Quiz;
