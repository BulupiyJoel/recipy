import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import "../../../../../../i18n.ts"

const LanguageMobile = () => {

    const { i18n ,t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    const handleChangeLanguage = (newLanguage: string) => {
        setCurrentLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className="flex flex-row space-x-1 justify-center items-center">
            <button
                className={`px-1 py-0.5 text-xs font-medium ${currentLanguage === 'fr' ? 'bg-gray-200' : 'text-gray-700 hover:bg-gray-100'} rounded-md`}
                onClick={() => handleChangeLanguage('fr')}
            >
                {t("french")}
            </button>
            <button
                className={`px-1 py-0.5 text-xs font-medium ${currentLanguage === 'en' ? 'bg-gray-200' : 'text-gray-700 hover:bg-gray-100'} rounded-md`}
                onClick={() => handleChangeLanguage('en')}
            >
                {t("english")}
            </button>
        </div>
    );
};

export default LanguageMobile;