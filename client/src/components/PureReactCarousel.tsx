import { CarouselProvider, ButtonBack, ButtonNext, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";
import axios from 'axios';
import { useEffect, useState } from 'react';
import carouselImg from "../assets/img/me.jpg"
import VITE_API_URL from './env/envKey';

// Define the Slide interface
interface Slide {
     src: string;
     // Add other properties of the slide object here if needed
}

// Custom hook to get the window width
const useWindowWidth = () => {
     const [windowWidth, setWindowWidth] = useState(window.innerWidth);

     useEffect(() => {
          const handleResize = () => {
               setWindowWidth(window.innerWidth);
          };

          window.addEventListener('resize', handleResize);
          return () => {
               window.removeEventListener('resize', handleResize);
          };
     }, []);

     return windowWidth;
};

const PureReactCarousel = () => {
     const [slides, setSlides] = useState<Slide[]>([]);
     const [currentIndex, setCurrentIndex] = useState(0);
     const windowWidth = useWindowWidth(); // Get the current window width

     const windowBreakPoint = (value: number): number => {
          if (value <= 640) {
               return 60
          } else if (value <= 768) {
               return 30
          }
          return 30
     }

     const arrowSize = (value: number): number => {
          if (value <= 320) {
               return 11
          } else if (value <= 768) {
               return 25
          }
          return 35
     }
     // Fetch slides from the API
     useEffect(() => {
          const fetchSlides = async () => {
               try {
                    const response = await axios.get(`${VITE_API_URL}/api/slides`);
                    setSlides(response.data);
                    console.log("Slides: ", response.data);
               } catch (error) {
                    console.error("Error fetching slides:", error);
               }
          };

          fetchSlides();
     }, []);

     const handleNext = () => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
     };

     const handleBack = () => {
          setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
     };

     return (
          <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={windowBreakPoint(windowWidth)} totalSlides={slides.length}>
               <div className="relative">
                    <Slider>
                         {slides.map((slide,index) => (
                              <Slide index={index} key={index}>
                                   <img src={carouselImg} alt={`Slide ${slide.src + 1}`} className="w-full h-full object-cover rounded-xl" />
                              </Slide>
                         ))}
                    </Slider>
                    <div className="absolute top-0 left-0 w-full flex flex-col justify-between h-full p-4 bg-gradient-to-r from-black via-transparent to-transparent rounded-l-xl">
                         <p className="text-orange-600 font-medium text-3xl sm:text-sm screen320:text-sm">Recettes à la une</p>
                         <p className="text-white">
                              <span className="font-semibold lg:text-2xl sm:text-sm">Mike's famous salad <br /> with cheese</span> <br />
                              <span className="font-semibold lg:text-sm  sm:text-xs">By John Mike</span>
                         </p>
                         <div className="flex justify-center items-center space-x-2 text-white mt-4 sm:mt-2">
                              {currentIndex > 0 && (
                                   <ButtonBack onClick={handleBack} aria-label="Previous Slide">
                                        <ArrowLeftCircle size={arrowSize(windowWidth)} />
                                   </ButtonBack>
                              )}
                              {currentIndex < slides.length - 1 && (
                                   <ButtonNext onClick={handleNext} aria-label="Next Slide">
                                        <ArrowRightCircle size={arrowSize(windowWidth)} />
                                   </ButtonNext>
                              )}
                         </div>
                    </div>
               </div>
          </CarouselProvider>
     );
};

export default PureReactCarousel;