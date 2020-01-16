const mode = process.env.NODE_ENV;
const dev = mode === 'development';

if (dev) require('dotenv').config();