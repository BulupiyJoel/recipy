import { useTranslation } from "react-i18next"
import { id as ussId } from "../../../../../components/auth/sessionData"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import VITE_API_URL from "../../../../env/envKey"

const ProfileMobile = () => {

     const { t } = useTranslation()
     const navigate = useNavigate()

     const handleLogout = () => {
          sessionStorage.removeItem("sessionData")
          navigate("/login")
     }

     const toProfile = async (id: number) => {
          try {
               const response = await axios.get(`${VITE_API_URL}/api/user/${id}`);
               const userData = response.data;
               navigate('/profile', { state: { user: userData } });
          } catch (error) {
               console.error(`Error: ${error}`);
          }
     };

     return (<div className="flex items-center justify-center cursor-pointer text-green-800 rounded-xl w-48 p-2 relative">
          <div className="flex space-x-2">
               <button onClick={handleLogout} className="text-xs font-medium bg-green-100 hover:bg-gray-200 px-1 py-0.5 rounded">
                    {t('log out')}
               </button>
               <button onClick={() => toProfile(ussId)} className="text-xs font-medium bg-green-100 hover:bg-gray-200 px-1 py-0.5 rounded">
                    {t('profile')}
               </button>
          </div>
     </div>)
}

export default ProfileMobile