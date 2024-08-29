import { Box, Button, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Link, useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";

const FormQuiz = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate(); // Utiliser useNavigate pour la redirection

    const handleFormSubmit = (values) => {
        navigate(`/detailquiz/${values.theme}`)
    };


    return (
        <Box m="20px">
            <Header title="CREATE QUIZ" subtitle="Create a New Quiz" />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >


                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="theme"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.theme}
                                name="theme"
                                error={!!touched.theme && !!errors.theme}
                                helperText={touched.theme && errors.theme}
                                sx={{ gridColumn: "span 4" }}
                            />

                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">

                            <Button type="submit" color="secondary" variant="contained" sx={{ bgcolor: colors.greenAccent[600] }}  >
                                Create New Quiz
                            </Button>

                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};


const checkoutSchema = yup.object().shape({

    theme: yup.string().required("required"),
});
const initialValues = {
    theme: "",

};

export default FormQuiz;