import { Link } from 'react-router-dom';
import ClientLayout from '../layout/ClientLayout';
import CEO from "../assets/img/CEO.jpg";
import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const About = () => {

  const { t } = useTranslation();

  return (
    <ClientLayout>
      <div className="about-page p-6">
        <h1 className="lg:text-3xl font-bold mb-4 sm:text-2xl">
          {t("about_.welcome")}
        </h1>
        <p className="mb-6 text-base sm:text-sm">
          {t("about_.description")}
        </p>

        <section className="about-section mb-6">
          <h2 className="lg:text-2xl font-semibold mb-2 sm:text-xl">
            {t("about_.ourStory")}
          </h2>
          <p className="text-base sm:text-sm">
            {t("about_.story")}
          </p>
        </section>

        <section className="about-section mb-6">
          <h2 className="lg:text-2xl font-semibold mb-2 sm:text-xl">
            {t("about_.features")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-base sm:text-sm">
            <li><i className="fas fa-search"></i>{t("about_.feature1")}</li>
            <li><i className="fas fa-bookmark"></i>{t("about_.feature2")}</li>
            <li><i className="fas fa-share-alt"></i>{t("about_.feature3")}</li>
            <li><i className="fas fa-utensils"></i>{t("about_.feature4")}</li>
          </ul>
        </section>

        <section className="about-section mb-6">
          <h2 className="lg:text-2xl font-semibold mb-2 sm:text-xl">
            {t("about_.meetTheTeam")}
          </h2>
          <div className="flex flex-col space-y-2 md:flex-col lg:flex-row items-center justify-center">
            <div className="bg-white shadow-md rounded p-4 w-64">
              <img src={CEO} alt="Joel Bulupiy" className="h-80 object-cover w-full rounded" />
              <h3 className="text-lg font-bold mt-2">{t("about_.ceo")}</h3>
            </div>
            <div className="flex flex-col ml-4 sm:mt-2">
              <span className="bg-green-500 text-white text-sm px-3 py-1 rounded mb-1">
                {t("about_.founder")}
              </span>
              <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded mb-1">
                {t("about_.headOfContent")}
              </span>
              <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded mb-1">
                {t("about_.leadDeveloper")}
              </span>
              <span className="bg-teal-500 text-white text-sm px-3 py-1 rounded mb-1">
                {t("about_.communityManager")}
              </span>
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded mb-1">
                {t("about_.marketingSpecialist")}
              </span>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="lg:text-2xl font-semibold mb-2 sm:text-xl">
            {t("about_.getInTouch")}
          </h2>
          <p className="text-base sm:text-sm">
            {t("about_.contact")}
            <a href="mailto:bulupiyjoel@gmail.com" className="text-blue-500 underline"> {t("about_.email")}</a> {t("about_.socialMedia")}:
          </p>
          <div className="social-links flex space-x-4 mt-2">
            <Link to="https://www.facebook.com/recipehub" target="_blank">
              <FacebookOutlined className="lg:text-2xl" />
            </Link>
            <Link to="https://www.instagram.com/recipehub" target="_blank">
              <InstagramOutlined className="lg:text-2xl" />
            </Link>
            <Link to="https://www.twitter.com/recipehub" target="_blank">
              <TwitterOutlined className="lg:text-2xl" />
            </Link>
          </div>
        </section>
      </div>
    </ClientLayout>
  );
};

export default About;