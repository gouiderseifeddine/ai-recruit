import { lazy, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Recruitment from "./scenes/Recruitment";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import Quiz from "./scenes/quiz/index";
import FormQuiz from "./scenes/quiz/addquiz";
import DetailQuiz from "./scenes/quiz/detailQuiz";
import ShowQuiz from "./scenes/quiz/showquiz";
import Result from "./scenes/quiz/index2.jsx";
import TestQuiz from "./scenes/quiz/testquiz";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AuthContext } from "./scenes/authentication/AuthContext.jsx";
import Loadable from "./layouts/full/shared/loadable/Loadable";
import ProfilePage from "./scenes/authentication/ProfilePage.js";
const Error = Loadable(lazy(() => import('./scenes/authentication/Error')));
const Register = Loadable(lazy(() => import('./scenes/authentication/Register')));
const Login = Loadable(lazy(() => import('./scenes/authentication/Login')));
const Pricing = Loadable(lazy(() => import('./scenes/authentication/Pricing')));
const Payment = Loadable(lazy(() => import('./scenes/authentication/payment')));

function AuthRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<Login />} />
        </Routes>
    );
}

function MainRoutes() {
    const [isSidebar, setIsSidebar] = useState(true);

    return (
        <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                    <Route path="/" element={<Team />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/recruitment" element={<Recruitment />} />

                    <Route path="/quizs" element={<Quiz />} />
                    <Route path="/formQuiz" element={<FormQuiz />} />
                    <Route path="/detailquiz/:th" element={<DetailQuiz />} />
                    <Route path="/voirquiz/:id" element={<ShowQuiz />} />
                    <Route path="/testquiz/" element={< TestQuiz />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/Result" element={<Result />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/form" element={<Form />} />
                    <Route path="/pie" element={<Pie />} />
                    <Route path="/line" element={<Line />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/geography" element={<Geography />} />
                    <Route path="/Pricing" element={<Pricing />} />
                    <Route path="/Payment" element={<Payment />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    const [theme, colorMode] = useMode();
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {isAuthenticated ? <MainRoutes /> : <AuthRoutes />}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
