import { useTranslation } from "react-i18next"
import { Link,useLocation } from "react-router-dom"

const PublicLinks = () => {

     const { t } = useTranslation()

     const linksData = [
          {
               title: "home",
               route: "/"
          },
          {
               title: "about",
               route: "/about"
          },
          {
               title : "new_recipe",
               route : "/recipe"
          },
          {
               title : "myrecipes",
               route : "/myrecipes"
          }
     ]

     const actualRoute = useLocation()

     return <>
          <div className="flex flex-row space-x-3 ml-10 screen320:hidden">
               {linksData.map((link, i) => (
                    <Link to={link.route} key={i} className={`hover:text-green-600 font-semibold ${actualRoute.pathname === link.route ? 'text-green-600' : '' }`}>
                         {t(link.title)}
                    </Link>
               ))}
          </div>
     </>
}

export default PublicLinks