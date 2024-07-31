import express from 'express';
import cors from 'cors';
import pool from './db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Health OK');
});

app.get('/data', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM TRY');
		return res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http:localhost:${PORT}/`);
});
