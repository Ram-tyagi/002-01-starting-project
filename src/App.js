import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovies';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  


  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {

      const response = await fetch('https://react-b75b7-default-rtdb.firebaseio.com//movies.json');



      if (!response.ok) {
        throw new Error('Something Went Wrong!!')
      }
      const data = await response.json();

      const loadedMvoies = [];

      for(const key in data) 
      {
        loadedMvoies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate,
        });
      }

      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      // setMovies(transformedMovies);
      setMovies(loadedMvoies);
    }
    catch (error) {
      setError(error.message);
    }
    setIsLoading(false);

  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {

    const response = await fetch('https://react-b75b7-default-rtdb.firebaseio.com//movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }
  
  async function deleteMovieHandler(movie) {
      
      const response = await fetch('https://react-b75b7-default-rtdb.firebaseio.com//movies.json', {
        method: 'DELETE',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data);
    }


  let content = <p>Found No Movies</p>

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />; 
  

  }
  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading....</p>;
  }
  






  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
       <button onClick={deleteMovieHandler}>Delete Movies</button>
      </section>
    </React.Fragment>
  );
}

export default App;