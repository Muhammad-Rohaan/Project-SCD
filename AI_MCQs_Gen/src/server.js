const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/a0project';
connectDB(mongoUri).catch(() => {});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/results', require('./routes/results'));

const port = process.env.PORT || 5000;
app.listen(port, () => {});
