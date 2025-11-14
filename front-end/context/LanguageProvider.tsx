import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n, { getAppLanguage, setAppLanguage } from './i18n';

interface LanguageContextType {
    language: string;
    changeLanguage: (lang: string) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'vi',
    changeLanguage: () => { },
    t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState('vi');

    useEffect(() => {
        const loadLang = async () => {
            const lang = await getAppLanguage();
            setLanguage(lang);
        };
        loadLang();
    }, []);

    const changeLanguage = async (lang: string) => {
        await setAppLanguage(lang);
        setLanguage(lang);
    };

    const t = (key: string) => (i18n as any).t(key);


    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
