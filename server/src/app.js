import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: "Backened is running successfully"});
});

app.listen(PORT, () => {
    console.log('Server executing live on http://localhost:5000');
});