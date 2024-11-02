import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ClientLayout from '../../layout/ClientLayout';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import VITE_API_URL from '../env/envKey';

const Profile = () => {

     const location = useLocation();
     const user = location.state?.user;
     const { t } = useTranslation();

     const [username, setUsername] = useState(user.username);
     const [email, setEmail] = useState(user.email);
     const [message, setMessage] = useState("");
     const id = user.id;

     if (!user) {
          return (
               <div className="flex justify-center items-center h-screen">
                    <div className="text-2xl font-bold">{t('user_not_found')}</div>
               </div>
          );
     }

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               const response = await axios.put(`${VITE_API_URL}/api/user/updateUser`, {
                    username,
                    email,
                    id,
               });
               console.log(response.data.message);
               if (response.data.userUpdated) {
                    setMessage(response.data.message)
                    const sessionData = {
                         userdata: { username: username, email: email, id: id },
                         isLoggedIn: true
                    }
                    sessionStorage.setItem("sessionData", JSON.stringify(sessionData))
                    setTimeout(() => {
                         setMessage("")
                    }, 2500)
               }
          } catch (error) {
               if (axios.isAxiosError(error)) {
                    console.error(`Error: ${error.message}`);
                    console.error(`Error response data: ${error.response?.data.error}`);
                    console.error(`Error status: ${error.response?.status}`);
                    console.error(`Error headers: ${error.response?.headers}`);
               } else {
                    console.error('Unexpected error:', error);
               }
          }
     };

     return (
          <ClientLayout>
               <div className="max-w-md mx-auto p-4 mt-10 bg-white rounded-lg shadow-md">
                    <h1 className="lg:text-2xl text-xl font-semibold mb-4 sm:text-3xl">
                         {t('profile')}
                    </h1>
                    <div className="flex flex-col mb-4">
                         <p className="text-base font-medium mb-2 sm:text-lg">
                              {t('username')} : {username}
                         </p>
                         <p className="text-base font-medium mb-2 sm:text-lg">
                              {t('email')} : {email}
                         </p>
                         <p className="text-blue-600 font-semibold">{message}</p>
                    </div>
                    <hr className="vr bg-gray-400" />
                    <form onSubmit={handleSubmit} className="flex flex-col" method="post">
                         <label className="block mb-2">
                              <span className="text-base font-medium sm:text-lg">
                                   {t('username')}
                              </span>
                              <input type="hidden" name="id" value={id} />
                              <input
                                   type="text"
                                   name="username"
                                   value={username}
                                   onChange={(e) => setUsername(e.currentTarget.value)}
                                   className="block w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none"
                              />
                         </label>
                         <label className="block mb-2">
                              <span className="text-base font-medium sm:text-lg">
                                   {t('email')}
                              </span>
                              <input
                                   type="email"
                                   name="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.currentTarget.value)}
                                   className="block w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none"
                              />
                         </label>
                         {/* Add other input fields for user details */}
                         <button
 type="submit"
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mt-4 sm:text-lg"
                         >
                              {t('update_profile')}
                         </button>
                    </form>
               </div>
          </ClientLayout>
     );
};

export default Profile;