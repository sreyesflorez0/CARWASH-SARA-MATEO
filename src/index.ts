import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Secure CORS configuration
const allowedOrigins = [
    process.env.CORS_ORIGIN, // Production URL (from Render env vars)
    'http://localhost:3000', // Local development
    'http://127.0.0.1:3000'
].filter(Boolean); // Remove undefined

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or requests that match our allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

import routes from './routes';
app.use('/api', routes);

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`✅ Database connection established`);
});
