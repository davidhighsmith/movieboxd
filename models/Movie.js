import BaseModel, { checkProperty } from "@/models/_base";

const properties = {
  title: 'title',
}

class Movie extends BaseModel {
  static collectionName = 'movies'

  // checks all the items in the object that was passed in
  // ensures that a movie is created only when valid
  // not sure if this should be in or out of class
  static checkValidMovie(movie) {
    const validObj = {
      valid: true,
      errors: [],
    }

    // Title
    checkProperty(validObj, movie, { name: properties.title, type: 'string' });

    return validObj;
  }

  /////////////////////// database methods go below this comment ///////////////////////

  // gets all movies
  static async find(params = {}) {
    return await super.find(this.collectionName, params);
  }

  // inserts one movie
  static async insertOne(movie) {
    const { valid, errors} = this.checkValidMovie(movie);

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