export const BACKEND_URL = process.env.NODE_ENV === 'production'
    ? 'https://linkjob-back.onrender.com'
    : 'http://localhost:8000';