import { Google, Microsoft } from "react-bootstrap-icons";
import Footer from "../Footer";
import axios from "axios";
import React, { useState } from "react"; // Import React
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
     const [username, setUsername] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [errorMessage, setErrorMessage] = useState("");
     const navigate = useNavigate()

     const { t } = useTranslation()

     const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          try {
               const response = await axios.post(`/api/user`, {
                    username,
                    email,
                    password
               });
               console.log(`Response message : ${response.data.message}`);
               if (response.data.isCreated) {
                    setUsername("");
                    setEmail("");
                    setPassword("");
                    navigate("/login")
               }
               setErrorMessage(response.data.error ? response.data.error : "")
          } catch (error) {
               if (axios.isAxiosError(error)) {
                    // Handle Axios error
                    if (error.response) {
                         // The request was made and the server responded with a status code
                         console.error(`Error response data : ${error.response.data}\n\n`);
                         console.error("Error status : ", error.response.status);
                         console.error("Error headers : ", error.response.headers);
                    } else if (error.request) {
                         // The request was made but no response was received
                         console.error("Error request:", error.request);
                    } else {
                         // Something happened in setting up the request that triggered an Error
                         console.error("Error message:", error.message);
                    }
               } else {
                    // Handle non-Axios errors
                    console.error("Unexpected error:", error);
               }
          }
     };

     return (
          <>
               <div className="h-screen flex justify-center items-center">
                    <form onSubmit={handleSignup} method="post" className="p-10 flex flex-col space-y-5 bg-gradient-to-b via-transparent from-gray-50 to-transparent shadow-lg rounded-lg screen320:w-72 screen320:p-5">
                         <center>
                              <h1 className="font-semibold text-2xl screen320:text-sm">{t("register")}</h1>
                              <p className="text-red-600 font-medium text-sm">{errorMessage}</p>
                         </center>
                         <div className="w-96 screeen320:w-64">
                              <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Pseudo..." className="text-sm p-3 focus:rounded-md focus:border-2 w-full border-b border-1 focus:outline-none screen320:w-64 placeholder:text-xs" />
                         </div>
                         <div className="w-96 screeen320:w-64">
                              <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@email.com" className="text-sm p-3 focus:rounded-md focus:border-2 w-full border-b border-1 focus:outline-none screen320:w-64 placeholder:text-xs" />
                         </div>
                         <div className="w-96 screen320:w-64">
                              <input type="password" name="password" id="password" value={password} onChange={(e) => {
                                   setPassword(e.target.value)
                                   if (e.target.value.length < 8) {
                                        setErrorMessage("Password lenght must be 8")
                                   } else {
                                        setErrorMessage("")
                                   }
                              }} className="text-sm p-3 focus:rounded-md focus:border-2 w-full border-b border-1 focus:outline-none screen320:text-xs screen320:w-64" placeholder="Mot de passe..." />
                         </div>
                         <button type="submit" className="w-96 bg-green-600 rounded-md text-sm font-semibold py-3 text-white screen320:text-sm screen320:w-64">{t("register")}</button>
                         <Link to="/login" className="text-blue-500 screen320:text-sm">{t("login")}</Link>
                         <div className=" hidden flex-row gap-x-5 justify-center w-96">
                              <a href="">
                                   <div className="bg-light-700 shadow-md px-5 py-3 space-x-2 rounded-md flex flex-row justify-center items-center">
                                        <Google className="text-yellow-500" /> <p className="text-xs font-semibold text-gray-500">Utiliser Google</p>
                                   </div>
                              </a>
                              <a href="">
                                   <div className="bg-light-700 shadow-md px-5 py-3 space-x-2 rounded-md flex flex-row justify-center items-center">
                                        <Microsoft className="text-blue-600" />
                                        <p className="text-xs text-center font-semibold text-gray-500">Utiliser Microsoft</p>
                                   </div>
                              </a>
                         </div>
                    </form>
               </div>
               <Footer />
          </>
     );
};

export default Register;