import { useState } from "react";
import axios from "axios";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import SVG from "../../assets/svg/iiisometric.svg"
import { useTranslation } from "react-i18next";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate
    const { t } = useTranslation()
    // const API_URL = import.meta.env.VITE_API_URL;

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(`/api/user/login`, {
                email,
                password
            });
            console.log(`Login Response : ${response.data.message}`);
            if (response.data.invalidPassword) {
                setMessage(response.data.message)
            }
            if (response.data.isLoggedIn) {
                setEmail("");
                setPassword("");
                const sessionData = {
                    userdata: response.data.user,
                    isLoggedIn: response.data.isLoggedIn
                }
                sessionStorage.setItem("sessionData", JSON.stringify(sessionData))
                setMessage("")
                navigate("/", { state: sessionData });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div
                className="h-screen flex justify-center items-center"
                style={{
                    backgroundImage: `url(${SVG})`,
                    backgroundSize: '50%', // Adjust the size here
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat' // Prevents the SVG from repeating
                }}
            >
                <form onSubmit={handleLogin} method="post" className="p-10 flex flex-col space-y-5 bg-white bg-opacity-80 shadow-lg rounded-lg screen320:shadow-2xl sm:items-center screen320:w-72 screen320:p-5">
                    <center>
                        <h1 className="font-semibold text-2xl screen320:text-sm">{t("login")}</h1>
                        <p className="text-red-600 font-medium text-sm">{message}</p>
                    </center>
                    <div className="w-96 screen320:w-64">
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..." className="text-sm p-3 focus:rounded-md focus:border-2 w-full border-b border-1 focus:outline-none screen320:w-64 placeholder:screen320:text-xs"/>
                    </div>
                    <div className="w-96 screen320:w-64">
                        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-sm p-3 focus:rounded-md focus:border-2 w-full border-b border-1 focus:outline-none screen320:w-64 placeholder:screen320:text-xs" placeholder="Mot de passe..." />
                    </div>
                    <button type="submit" className="w-96 bg-green-600 rounded-md text-sm font-semibold py-3 text-white screen320:w-64 screen320:py-2">{t("login")}</button>
                    <Link to='/register' className="text-blue-600 screen320:text-sm">{t("register")}</Link>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Login;