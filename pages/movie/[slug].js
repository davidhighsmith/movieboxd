import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";

const SingleMovie = ({ movie }) => {
  const found = movie === null ? false : true;

  return (
    <>
      { found ? <h1>Movie</h1> : <h1>Movie Not Found</h1> }
      <p>Summary</p>
    </>
  )
}

export async function getServerSideProps({ query }) {
  await dbConnect();

  const movie = await Movie.findOne({ "slug": query.slug });

  return { props: { movie: movie } }
}

export default SingleMovie;