const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const mongoUri = process.env.MONGO_URI || "mongodb://hadi:hadi_7990@ac-3b3rymf-shard-00-00.z0w2jij.mongodb.net:27017,ac-3b3rymf-shard-00-01.z0w2jij.mongodb.net:27017,ac-3b3rymf-shard-00-02.z0w2jij.mongodb.net:27017/AI_MCQS_DB?ssl=true&replicaSet=atlas-6gkk7g-shard-0&authSource=admin&appName=Cluster0/AI_MCQS_DB";
connectDB(mongoUri).catch(() => {});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/results', require('./routes/results'));

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`running on port ${port}`);
    
});
