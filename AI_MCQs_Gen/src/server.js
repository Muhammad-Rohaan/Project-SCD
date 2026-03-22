const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || "mongodb+srv://bscs2380246_db_user:mr123@cluster0.f0xzxvb.mongodb.net/AZ_MCQsDB";
connectDB(mongoUri).catch(() => {});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/results', require('./routes/results'));

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`running on port ${port}`);
    
});
