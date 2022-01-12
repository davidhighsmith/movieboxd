import { MovieDb } from 'moviedb-promise';
import { ObjectId } from 'mongodb';
import Movie from '@/models/Movie';

// This endpoint handles both requests to internal mongodb database
// and external calls to TheMovieDB
export default async function handler(req, res) {
  const { method } = req;
  const { movieId } = req.query;

  // no moviedb id can be confused for an ObjectId so no further checks are needed than this
  const checkMyDb = ObjectId.isValid(movieId);

  if (checkMyDb) {
    return res.status(200).json({ success: true });
  }

  // both GET and POST will use this for moviedb
  const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);
  const movie = await moviedb.movieInfo(movieId);
  
  switch (method) {
    case 'GET':
      return res.status(200).json({ data: movie, success: true });
      break;
    case 'POST':
      const newMovie = new Movie(movie);
      const result = await newMovie.save();
      return res.status(200).json({ data: result, success: true });
      break;
    default:
      return res.status(400).json({ success: false });
      break;
  }
}