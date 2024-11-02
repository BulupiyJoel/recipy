import AppLogo from "./AppLogo"
import { useLocation } from "react-router-dom"

const Footer = () => {
     const getYear = new Date().getFullYear()
     const location = useLocation()
     const { pathname } = location

     return <>
          <hr className="mt-5" />
          { pathname === "login" &&
          <div className="flex flex-row justify-between mt-5">
               <div className="flex flex-col gap-y-4">
                    <AppLogo />
                    <p className="font-medium text-sm">
                         LambaLia est un site pour offre une grande varieter des recettes delicieuses
                         ,<br />faciles è faire. Rejoingner notre unité et LambaLia </p>
               </div>
               {/* Contact*/}
               <div className="flex flex-col space-y-4">
                    <AppLogo />
                    <p className="text-gray-400 font-medium text-sm">
                         S'abonner pour recevoir les dérnierès mises à jour <br /> et tendances de la communauté
                    </p>
                    <div className="flex gap-x-4">
                         <form action="" method="post" className="flex flex-row gap-x-2">
                              <div className="flex flex-row items-center border-gray-400 border-2 px-2 py-1 rounded-lg">
                                   <input type="email" name="" id="" placeholder="Votre email" className="placeholder:font-medium border-0 outline-none" />
                                   <span className="text-gray-800 text-xl">@</span>
                              </div>
                              <button type="submit" className="bg-green-600 rounded-md txt-sm font-normal text-white p-2">Valider</button>
                         </form>
                    </div>
               </div>
          </div>
          }
          <div className={`flex justify-center ${pathname == 'login' ? '' : 'my-3' }`}>
               <p className="text-gray-400 font-semibold screen320:text-xs sm:text-xs">&copy; {getYear} <a href="https://ast-tech.netlify.app/"> Developed by <span className="text-green-600">AST-TECH</span></a></p>
          </div>
     </>
}

export default Footer