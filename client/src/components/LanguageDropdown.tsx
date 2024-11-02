import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import "../../i18n.ts"

const LanguageDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const languages = [
        { code: 'en', label: 'english' },
        { code: 'fr', label: 'french' },
    ];

    const handleChangeLanguage = (newLanguage: string) => {
        setCurrentLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
        setIsOpen(false);
    };

    const nonCurrentLanguages = languages.filter((language) => language.code !== currentLanguage);

    return (
        <div className="relative inline-block screen320:hidden">
            <button
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:rounded-md border-gray-400 border-2 rounded-md hover:text-gray-700"
                onClick={toggleDropdown}
            >
                {t(currentLanguage === 'en' ? 'english' : 'french')}
            </button>
            {isOpen && (
                <ul className="absolute z-10 w-full bg-white divide-y rounded-b-md divide-gray-100 shadow">
                    {nonCurrentLanguages.map((language) => (
                        <li key={language.code}>
                            <button
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                                onClick={() => handleChangeLanguage(language.code)}
                            >
                                {t(language.label)}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageDropdown;