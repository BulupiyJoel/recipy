import cors from 'cors';

const corsConfig = cors({
     origin: ['http://localhost:5173'], // Allow requests from this origin
     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
     allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
     maxAge: 3600, // Set the maximum age of the CORS configuration
     credentials: true, // Allow credentials to be sent in the request
});

export default corsConfig;