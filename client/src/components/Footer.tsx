import { useLocation } from "react-router-dom"

const Footer = () => {
     const getYear = new Date().getFullYear()
     const location = useLocation()
     const { pathname } = location

     return <>
          <hr className="mt-5" />
          <div className={`flex justify-center ${pathname == 'login' ? '' : 'my-3' }`}>
               <p className="text-gray-400 font-semibold screen320:text-xs sm:text-xs lg:text-xl">&copy; {getYear} <a href="https://ast-tech.netlify.app/"> Developed by <span className="text-green-600">AST-TECH</span></a></p>
          </div>
     </>
}

export default Footer