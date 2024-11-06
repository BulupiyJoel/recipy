import { CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { useEffect, useState } from 'react';
import VITE_API_URL from './env/envKey';


interface Recipe {
     title: string;
     description: string;
     image_url: string;
     username: string;
}

interface Props {
     trendings: Recipe[]
}

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

const TrendingRecipes = ({ trendings }: Props) => {
     const windowWidth = useWindowWidth();

     const windowBreakPoint = (value: number): number => {
          if (value <= 640) {
               return 70; // Height for small screens
          } else if (value <= 768) {
               return 30; // Height for medium screens
          } else if(value <= 810){
               return 38
          }
          return 32; // Height for larger screens
     }

     return (
          <CarouselProvider
               naturalSlideWidth={100}
               naturalSlideHeight={windowBreakPoint(windowWidth)}
               totalSlides={trendings.length}
               isPlaying={true}
               interval={5000}
               step={1}
               playDirection="forward"
               infinite={false}
               visibleSlides={2}
          >
               <div className="relative">
                    <Slider>
                         {trendings.map((trending, index) => (
                              <Slide index={index} key={index}>
                                   <div className="relative h-52 mr-1 tablet:h-60"> {/* Set a fixed height for the slide */}
                                        <img
                                             src={`${VITE_API_URL}/api/images/${trending.image_url}`}
                                             alt={`Image of ${trending.description}`}
                                             className={`w-full lg:h-52 object-cover rounded-xl tablet:rounded-none tablet:h-64`}
                                        />
                                        <div className={`absolute top-0 left-0 w-full h-full flex flex-col lg:justify-between p-4 rounded-xl tablet:rounded-none bg-black bg-opacity-50 tablet:p-2`}> {/* Added background for better text visibility */}
                                             <p className="text-orange-600 font-medium lg:text-3xl sm:text-sm screen320:text-xs tablet:text-xs">Trendings</p>
                                             <p className="text-white">
                                                  <span className="font-semibold lg:text-2xl sm:text-sm screen320:text-xs tablet:text-mobile">{trending.description}</span> <br />
                                                  <span className="screen320:text-xs font-semibold lg:text-sm sm:text-xs tablet:text-mobile">By {trending.username}</span>
                                             </p>
                                        </div>
                                   </div>
                              </Slide>
                         ))}
                    </Slider>
               </div>
          </CarouselProvider>
     );
};

export default TrendingRecipes;