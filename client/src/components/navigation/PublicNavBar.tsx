import PublicLinks from "./PublicLinks";
import AppLogo from "../AppLogo";
import { useEffect, useState } from "react";
import LanguageDropdown from "../LanguageDropdown";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MegaMenu, NavbarBrand, NavbarCollapse, NavbarToggle } from "flowbite-react";
import MobileLinks from "./Responsive/Mobile/Links/MobileLinks";
import LanguageMobile from "./Responsive/Mobile/Lang/LanguageDropdown";
import ProfileMobile from "./Responsive/Mobile/Profile/ProfileMobile";
// import VITE_API_URL from "../env/envKey";


const getInitials = (username: string): string => {
     const words = username.split(' ');
     const initials = words.map(word => word.charAt(0).toUpperCase());
     return initials.join('');
}

const handleLogout = () => {
     sessionStorage.removeItem("sessionData");
     window.location.href = "/login";
}

const PublicNavBar = () => {
     const navigate = useNavigate();
     const [initials, setInitials] = useState<string>();

     const toProfile = async (id: number) => {
          try {
               const response = await axios.get(`/api/user/${id}`);
               const userData = response.data;
               navigate('/profile', { state: { user: userData } });
          } catch (error) {
               console.error(`Error: ${error}`);
          }
     };

     const sessionDataJson = JSON.parse(sessionStorage.getItem("sessionData") ?? '{}');
     const { t } = useTranslation();

     if (sessionStorage.getItem("sessionData") == null) {
          window.location.href = "/login";
     }

     useEffect(() => {
          setInitials(getInitials(sessionDataJson.userdata.username))
     }, [initials, sessionDataJson.userdata.username])


     const [hover, setHover] = useState(false);

     return (
          <>
               {/* Mobile-Menu */}
               <MegaMenu className="lg:hidden">
                    <NavbarBrand>
                         <AppLogo />
                    </NavbarBrand>
                    <NavbarToggle>
                         <span className="sr-only"></span>
                    </NavbarToggle>
                    <NavbarCollapse>
                         <MobileLinks />
                         <div className="flex flex-row justify-between mt-3 md:mt-0">
                              <LanguageMobile />
                              <ProfileMobile />
                         </div>
                    </NavbarCollapse>
               </MegaMenu>

               {/* Desktop */}
               <div className="hidden lg:flex flex-row justify-between items-center">
                    {/* AppName */}
                    <AppLogo />

                    {/* Routes */}
                    <PublicLinks />

                    {/* Profile */}
                    <div className="flex flex-row space-x-1 justify-center items-center">
                         <div
                              className="bg-green-100 hover:cursor-pointer text-green-800 rounded-full w-10 h-10 p-2 relative"
                              onClick={() => setHover(!hover)}
                         >
                              <p className="text-sm font-semibold text-center pt-p">{initials}</p>

                              {hover && (
                                   <div className="absolute w-max top-full right-0 bg-white shadow-md rounded z-10">
                                        <button className="text-sm font-medium block w-full text-left hover:bg-gray-200 px-3 py-1 rounded" onClick={handleLogout}>{t('log out')}</button>
                                        <button className="text-sm font-medium block w-full text-left hover:bg-gray-200 px-3 py-1 rounded" onClick={() => toProfile(sessionDataJson.userdata.id)}>{t('profile')}</button>
                                   </div>
                              )}
                         </div>

                         {/* Language */}
                         <LanguageDropdown />
                    </div>
               </div>
          </>
     );
};

export default PublicNavBar;