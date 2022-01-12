import BaseModel, { checkProperty } from "@/models/_base";
import getDbInstance from "@/lib/getDbInstance";

const schema = {
  backdrop_path: {
    name: 'backdrop_path',
    type: 'string',
    nullable: true,
  },
  moviedb_id: {
    name: 'moviedb_id',
    type: 'number',
  },
  overview: {
    name: 'overview',
    type: 'string',
    nullable: true,
  },
  poster_path: {
    name: 'poster_path',
    type: 'string',
    nullable: true,
  },
  release_date: {
    name: 'release_date',
    type: 'string',
  },
  runtime: {
    name: 'runtime',
    type: 'number',
    nullable: true,
  },
  title: {
    name: 'title',
    type: 'string',
  },
}

class Movie extends BaseModel {
  static collectionName = 'movies'

  constructor(movie) {
    super();
    Object.keys(schema).forEach(key => {
      if (key !== 'moviedb_id') this[key] = movie[key];
      else this['moviedb_id'] = movie.id;
    });
  }

  async save() {
    const db = await getDbInstance();
    await db.collection(Movie.collectionName).insertOne(this);
    const movieInserted = {
      ...this,
    }
    return movieInserted;
  }

  // checks all the items in the object that was passed in
  // ensures that a movie is created only when valid
  // not sure if this should be in or out of class
  static checkValidMovie(movie) {
    const validObj = {
      valid: true,
      errors: [],
    }

    // Checks every property in the schema
    Object.keys(schema).forEach(key => {
      checkProperty(validObj, movie, schema[key]);
    });

    return validObj;
  }

  /////////////////////// static database methods go below this comment ///////////////////////

  // gets all movies
  static async find(params = {}) {
    return await super.find(this.collectionName, params);
  }

  // inserts one movie that has been manually made
  static async insertOne(movie) {
    const { valid, errors } = this.checkValidMovie(movie);

    // return errors if movie object isn't valid
    if (!valid) return {
      success: false,
      errors: errors
    }

    // insert movie and create newMovie variable with the id added
    const inserted = await super.insertOne(this.collectionName, movie);
    const newMovie = {
      ...movie,
      id: inserted.insertedId
    }

    return {
      inserted: newMovie,
      success: true,
    }
  }
}

export default Movie;