import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		await db.query('SELECT NOW()');
		res.status(200).json({ message: 'Database connection is healthy' });
	} catch (error) {
		console.error('Database connection error:', error);
		res.status(500).json({ message: 'Database connection error' });
	}
}
