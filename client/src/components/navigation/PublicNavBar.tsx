// "use client"

import { AiOutlineSearch } from "react-icons/ai";
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


const getInitials = (username: string): string => {
     const words = username.split(' ');
     const initials = words.map(word => word.charAt(0).toUpperCase());
     return initials.join('');
}

const handleLogout = () => {
     sessionStorage.removeItem("sessionData");
     window.location.href = "/login";
}

interface Category {
     id: number,
     name: string
}

const PublicNavBar = () => {
     const navigate = useNavigate();
     const [initials, setInitials] = useState<string>();
     const [categories, setCategories] = useState<Category[]>([]);

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
          const fetchCategories = async () => {
               await axios.get(`/api/category`)
                    .then(response => {
                         const categories = response.data;
                         setCategories(categories);
                         console.log("Categories : ", categories);
                    })
                    .catch(error => {
                         console.error(error);
                    });
          }

          setInitials(getInitials(sessionDataJson.userdata.username))

          fetchCategories()
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
                         <div className="flex flex-row justify-between mt-3">
                              <LanguageMobile />
                              <ProfileMobile />
                         </div>
                    </NavbarCollapse>
               </MegaMenu>

               {/* Desktop */}
               <div className="screen320:hidden flex flex-row justify-between items-center tablet:hidden">
                    {/* AppName */}
                    <AppLogo />

                    {/* SearchBar */}
                    <div className="flex-grow max-w-xs hidden">
                         <form action="" method="post" className="flex flex-row">
                              <div className="bg-gray-200 flex flex-row py-1 px-3 space-x-2 rounded-l">
                                   <select name="" id="" className="bg-transparent font-medium text-sm">
                                        <option value="">{t('every_categories')}</option>
                                        {categories.map((category, index) => (
                                             <option key={index} value={category.id}>{category.name}</option>
                                        ))}
                                   </select>
                                   <div className="h-8 w-0.5 rounded-full bg-gray-400"></div>
                                   <input
                                        type="text"
                                        name=""
                                        id=""
                                        placeholder={`${t("keyword")}...`}
                                        className="placeholder:text-gray-400 text-sm border-0 bg-transparent focus:outline-none"
                                        maxLength={20}
                                   />
                              </div>
                              <button type="submit">
                                   <AiOutlineSearch className="bg-green-600 text-white p-2 rounded-r" size={40} />
                              </button>
                         </form>
                    </div>

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