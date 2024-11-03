import { useState } from "react";
import axios from "axios";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import SVG from "../../assets/svg/iiisometric.svg"
import { useTranslation } from "react-i18next";
import { toast } from 'react-hot-toast'; // Import toast and Toaster
import { Eye, EyeSlash } from "react-bootstrap-icons";
import VITE_API_URL from "../env/envKey";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate
    const { t } = useTranslation()
    const [loading,setLoading] = useState(false)

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${VITE_API_URL}/api/user/login`, {
                email,
                password
            });
            // console.log(`Login Response : ${response.data.message}`);
            if (response.data.invalidPassword || response.data.userNotFound) {
                toast.error(response.data.message); // Show error message
            }
            if (response.data.isLoggedIn) {
                setEmail("");
                setPassword("");
                const sessionData = {
                    userdata: response.data.user,
                    isLoggedIn: response.data.isLoggedIn
                }
                sessionStorage.setItem("sessionData", JSON.stringify(sessionData));
                toast.success("Login successful!"); // Show success message
                navigate("/", { state: sessionData });
            }

            setLoading(true);
        } catch (error) {
            // console.error(error);
            toast.error(`An error occurred during login : ${error}`); // Show error message
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-green-600 text-white p-4 rounded-md shadow-md">
                    <p>{t('loading')}...</p>
                </div>
            </div>
        );
    }
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
                <form onSubmit={handleLogin} method="post" className="p-10 screen320:p-5 flex flex-col space-y-5 bg-white bg-opacity-80 lg:w-96 shadow-lg rounded-lg sm:shadow-2xl sm:items-center screen320:w-64 sm:p-5">
                    <center>
                        <h1 className="font-semibold lg:text-2xl sm:text-sm screen320:text-sm">{t("login")}</h1>
                    </center>
                    <div className="w-96 lg:w-80 sm:w-64 screen320:w-64">
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..." className="text-sm p-3 focus:rounded-md focus:border-2 w-full border-b border-1 focus:outline-none sm:w-64 lg:w-80 screen320:w-52 placeholder:sm:text-xs" />
                    </div>
                    <div className="relative w-96 sm:w-64 screen320:w-64 lg:w-80">
                        <input type={showPassword ? "text" : "password"} name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-sm p-3 focus:rounded-md focus:border-2 w-full border-b border-1 focus:outline-none lg:w-80 sm:w-64 screen320:w-52 placeholder:sm:text-xs" placeholder="Password..." />
                        <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer">
                            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </span>
                    </div>
                    <button type="submit" className="lg:w-80 bg-green-600 rounded-md text-sm font-semibold py-3 text-white sm:w-64 screen320:w-52 sm:py-2">{t("login")}</button>
                    <Link to='/register' className="text-blue-600 sm:text-sm screen320:text-sm">{t("register")}</Link>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Login;