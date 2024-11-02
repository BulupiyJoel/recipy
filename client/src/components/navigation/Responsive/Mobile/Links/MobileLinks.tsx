import { NavbarLink } from 'flowbite-react'
import { useTranslation } from 'react-i18next'

const MobileLinks = () => {
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
      title: "new_recipe",
      route: "/recipe"
    },
    {
      title: "myrecipes",
      route: "/myrecipes"
    }
  ]

  return (
    linksData.map((link, index) => (
      <NavbarLink href={link.route} key={index}>
        {t(link.title)}
      </NavbarLink>
    ))
  )
}

export default MobileLinks