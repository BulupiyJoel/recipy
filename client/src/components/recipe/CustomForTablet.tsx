import { useEffect, useState } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { customCarouselArrow } from './customCarouselArrow';
import { useTranslation } from 'react-i18next';

type Props = {
     windowWidth : number;
     pageIndex : number;
     totalSlides : number;
}
const CustomForTablet = ({windowWidth, pageIndex,totalSlides} : Props) => {

     const [hasRendered, setHasRendered] = useState(false);
     const { t } = useTranslation();

     useEffect(() => {
          if (!hasRendered) {
               setHasRendered(true);
          }
     }, [hasRendered]);

     return (
          <>
               {!(customCarouselArrow(windowWidth) && hasRendered) && (
                    <p className="text-gray-800">
                         Total slides : {pageIndex + 1}/{totalSlides} <WarningOutlined className="text-blue-600" /> {t('swipe_to_see')}
                    </p>
               )}
          </>
     );
};

export default CustomForTablet;