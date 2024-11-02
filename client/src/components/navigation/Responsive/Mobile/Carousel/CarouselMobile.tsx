import { CarouselProvider, ButtonBack, ButtonNext, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons"
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Slide {
     src: string;
     // Add other properties of the slide object here
}

const CarouselMobile = () => {

     // const API_URL = import.meta.env.VITE_API_URL;
     const [slides, setSlide] = useState<Slide[]>([]);
     const [currentButton, setButton] = useState(0)
     // const slideLenght = slides.length
     const [currentIndex, setCurrentIndex] = useState(0);

     const handleNext = () => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
     };

     const handleBack = () => {
          setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
     };
     const handleButton = (index: number) => {
          setButton(index)
          console.log(currentButton);
     }

     useEffect(() => {
          axios.get(`/api/slides`)
               .then(response => {
                    const slides = response.data;
                    setSlide(slides);
                    console.log("Slides : ", slides); // Output: Array of food objects
               })
               .catch(error => {
                    console.error(error);
               });
     }, []);


     return <>
          <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={20} totalSlides={3}>
               <div className="relative">
                    <Slider>
                         {slides.map((slide, index) => (
                              <Slide onCanPlay={() => handleButton(index)} index={index} key={index}><img src={slide.src} alt="Slide 1" className="w-full h-full object-cover rounded-xl" /></Slide>
                         ))}
                    </Slider>
                    <div className="absolute top-0 left-0 w-full flex flex-col justify-between h-full p-4 bg-gradient-to-r from-black via-transparent to-transparent rounded-l-xl">
                         <p className="text-orange-600 font-medium text-xl">Recettes à la une</p>
                         <p className="text-white">
                              <span className="font-semibold text-5xl">Mike's famous salad <br /> with cheese</span> <br />
                              <span className="font-semibold text-sm">By John Mike</span>
                         </p>
                         <div className="flex justify-center items-center space-x-2 text-white mt-4">
                              {currentIndex > 0 && (
                                   <ButtonBack onClick={handleBack}>
                                        <ArrowLeftCircle size={35} />
                                   </ButtonBack>
                              )}

                              {currentIndex < slides.length - 1 && (
                                   <ButtonNext onClick={handleNext}>
                                        <ArrowRightCircle size={35} />
                                   </ButtonNext>
                              )}
                         </div>
                    </div>
               </div>
          </CarouselProvider>
     </>
};

export default CarouselMobile;