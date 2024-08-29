import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  useTheme,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../theme";
import { BASE_URL } from "../../constants/config";

const ShowQuiz = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [quiz, setQuiz] = useState(null);
  const [candidats, setCandidats] = useState([]);
  const { id } = useParams();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedOptions, setEditedOptions] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/onequiz/${id}`);
        console.log("Response:", response.data);
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    const fetchCandidats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/all_candidat`);
        setCandidats(response.data);
      } catch (error) {
        console.error("Error fetching candidats:", error);
      }
    };

    fetchQuiz();
    fetchCandidats();
  }, [id]);

  const updateQuestions = async (q) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/update_quiz/${id}`,
        {
          questions: q,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCandidats(response.data);
    } catch (error) {
      console.error("Error fetching candidats:", error);
    }
  };
  const handleEditClick = (index) => {
    const question = quiz.questions[index];
    setSelectedQuestionIndex(index);
    setEditedQuestion(question.question);
    setEditedOptions([...question.options]);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[selectedQuestionIndex] = {
      ...updatedQuestions[selectedQuestionIndex],
      question: editedQuestion,
      options: editedOptions,
    };
    //setQuiz({ ...quiz, questions: updatedQuestions });
    updateQuestions(updatedQuestions);
    setEditDialogOpen(false);
    setSelectedQuestionIndex(null);
  };

  const handleAffecter = async (values) => {
    try {
      const idRecruter = localStorage.getItem("userId");
      await axios.post(
        `${BASE_URL}/affecter`,
        {
          // njib idrecruter min token
          idRecruter: idRecruter,
          idcandidat: values.candidat,
          idquiz: quiz._id,
          date: values.date,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(" added successfully!");
      Swal.fire({
        icon: "success",
        title: "Test Quiz Affected Successfully!",
        showConfirmButton: false,
        timer: 1500, // Durée de l'alerte en millisecondes
      });
    } catch (error) {
      console.error("Error adding :", error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = formatDate(new Date());

  const validationSchema = Yup.object().shape({
    candidat: Yup.string().required("Candidat required"),
    date: Yup.date().required("Date required").min(today, "invalid date"),
  });

  const initialValues = {
    candidat: "",
    date: "",
  };

  return (
    <Box m="20px">
      <Header title="AI Recruit" subtitle="Detail Quiz" />
      <Box
        m="40px 0 0 0"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {quiz === null ? (
          <Typography>Loading...</Typography>
        ) : (
          quiz.questions.map((question, index) => (
            <Card key={index} sx={{ width: "80%", mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="div" mb={1}>
                  Question {index + 1}:
                </Typography>
                <Typography variant="body1" component="div" mb={2}>
                  {question.question}
                </Typography>
                <List>
                  {question.options.map((option, optionIndex) => (
                    <ListItem key={optionIndex} disablePadding>
                      <ListItemText primary={option} />
                      {optionIndex === question.correct && (
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                      )}
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditClick(index)}
                  sx={{ bgcolor: colors.greenAccent[600] }}
                >
                  Edit Question
                </Button>
              </CardContent>
            </Card>
          ))
        )}

        {/* Formulaire avec Formik */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleAffecter}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                {/* Champ de sélection des candidats */}
                <FormControl
                  sx={{ width: "200px" }}
                  error={!!touched.candidat && !!errors.candidat}
                >
                  <InputLabel id="candidat-label">Candidat</InputLabel>
                  <Field
                    as={Select}
                    labelId="candidat-label"
                    id="candidat-select"
                    name="candidat"
                    value={values.candidat}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Candidat"
                  >
                    {candidats.map((candidat) => (
                      <MenuItem key={candidat._id} value={candidat._id}>
                        {candidat.name}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.candidat && errors.candidat && (
                    <Typography color="error">{errors.candidat}</Typography>
                  )}
                </FormControl>

                {/* Champ de sélection de la date */}
                <TextField
                  type="date"
                  label="Date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="date"
                  error={!!touched.date && !!errors.date}
                  helperText={touched.date && errors.date}
                  sx={{ width: "200px" }}
                  InputLabelProps={{ shrink: true }}
                />

                {/* Bouton d'affectation */}
                <Button type="submit" variant="contained" color="grey">
                  Affecter
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            margin="normal"
          />
          {editedOptions.map((option, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const updatedOptions = [...editedOptions];
                updatedOptions[index] = e.target.value;
                setEditedOptions(updatedOptions);
              }}
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ bgcolor: "gray" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            sx={{ bgcolor: colors.greenAccent[600] }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShowQuiz;
