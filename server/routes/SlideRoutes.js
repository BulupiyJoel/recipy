import app from "./RouteConfig.js"

const SlideRoutes = () => {
     const slides = [
          {
               src: '/src/assets/img/me.jpg',
               alt: 'Slide 1',
          },
          {
               src: '/src/assets/img/me.jpg',
               alt: 'Slide 2',
          },
          {
               src: '/src/assets/img/me.jpg',
               alt: 'Slide 3',
          },
     ];

     // // Define the API endpoint to fetch foods
     // app.get('/api/recipies', (req, res) => {
     //      res.json(foods); // Send the foods array as JSON response
     // });

     app.get('/api/slides', (req, res) => {
          res.json(slides);
     });
}

export default SlideRoutes;