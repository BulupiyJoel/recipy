import { t } from "i18next"
import { ButtonBack, ButtonNext } from "pure-react-carousel"

type Props = {
     dataLenght : number
}

const ButtonCarousel = ({ dataLenght } : Props) => {
     return <>
          {dataLenght > 6 && (
               <div className="flex flex-row justify-between w-full mt-3 gap-x-4 screen320:hidden">
                    <div className="border-gray-300 border-2 rounded-md text-sm font-medium p-2">
                         <ButtonBack>{t("back")}</ButtonBack>
                    </div>
                    <div className="border-gray-300 border-2 rounded-md text-sm font-medium p-2">
                         <ButtonNext>{t("next")}</ButtonNext>
                    </div>
               </div>
          )}
     </>
}

export default ButtonCarousel