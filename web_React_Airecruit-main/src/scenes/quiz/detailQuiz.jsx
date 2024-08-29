import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Navigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "../../constants/config";

const DetailQuiz = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedOptions, setEditedOptions] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [redirectToQuizs, setRedirectToQuizs] = useState(false);
  const { th } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/generer_quiz/${th}`);
        console.log("Response:", response.data);

        // Ensure the response is as expected and set the questions
        if (response.data && Array.isArray(response.data.questions)) {
          setQuestions(response.data.questions);
        } else {
          console.error("Expected questions to be an array");
          setQuestions([]); // Set to empty array to avoid further errors
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };

    const fetchJob = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/jobs`);
        console.log("Response:", response.data);
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    fetchQuiz();
    fetchJob();
  }, [th]);

  const handleEditClick = (questionIndex) => {
    setSelectedQuestion(questionIndex);
    setEditedQuestion(questions[questionIndex].question);
    setEditedOptions([...questions[questionIndex].options]);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[selectedQuestion] = {
      ...updatedQuestions[selectedQuestion],
      question: editedQuestion,
      options: editedOptions,
    };
    setQuestions(updatedQuestions);
    setEditDialogOpen(false);
  };

  const saveQuiz = async (values) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(
        `${BASE_URL}/add_quiz`,
        {
          idRecruter: userId, // Example id, replace with actual
          idjob: values.job,
          theme: th,
          questions: questions,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Quiz added successfully!");
      Swal.fire({
        icon: "success",
        title: "Quiz Saved Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        setRedirectToQuizs(true);
      }, 1500);
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };

  useEffect(() => {
    const isFormFilled =
      editedQuestion.trim() !== "" &&
      editedOptions.every((option) => option.trim() !== "");
    setIsFormValid(isFormFilled);
  }, [editedQuestion, editedOptions]);

  if (redirectToQuizs) {
    return <Navigate to="/quizs" />;
  }
  if (loading) {
    return <Box>Loading...</Box>;
  }

  const validationSchema = Yup.object().shape({
    job: Yup.string().required("Job required"),
  });
  const initialValues = {
    job: "",
  };

  return (
    <Box m="20px">
      {Array.isArray(questions) && questions.length > 0 ? (
        questions.map((question, index) => (
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
                Edit
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Box>No questions available</Box>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={saveQuiz}
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
              {/* Job Selection Field */}
              <FormControl
                sx={{ width: "200px" }}
                error={!!touched.job && !!errors.job}
              >
                <InputLabel id="job-label">Job</InputLabel>
                <Field
                  as={Select}
                  labelId="job-label"
                  id="job-select"
                  name="job"
                  value={values.job}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Job"
                >
                  {jobs.map((j) => (
                    <MenuItem key={j._id} value={j._id}>
                      {j.jobTitle}
                    </MenuItem>
                  ))}
                </Field>
                {touched.job && errors.job && (
                  <Typography color="error">{errors.job}</Typography>
                )}
              </FormControl>

              {/* Save Button */}
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            margin="normal"
            error={editedQuestion.trim() === ""}
            helperText={editedQuestion.trim() === "" ? "Question required" : ""}
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
              error={option.trim() === ""}
              helperText={option.trim() === "" ? "Option required" : ""}
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
            disabled={!isFormValid}
            sx={{ bgcolor: colors.greenAccent[600] }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DetailQuiz;
