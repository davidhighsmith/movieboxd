import dbConnect from '@/lib/mongodb';
import Movie from '@/models/Movie';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const movies = await Movie.find({});
        res.status(200).json({ success: true, data: movies });
      } catch (error) {
        res.status.json({ success: false });
      }
      break;
    default:
      res.status.json({ success: false });
      break;
  }
}