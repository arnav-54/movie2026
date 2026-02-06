import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/movies');
                setMovies(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="container page-container">
            <h1>Now Showing</h1>
            <div className="movie-grid">
                {movies.map(movie => (
                    <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                        <img src={movie.poster || 'https://via.placeholder.com/300x450'} alt={movie.title} className="movie-poster" />
                        <div className="movie-info">
                            <div className="movie-title">{movie.title}</div>
                            <div className="movie-rating">★ {movie.rating || 'N/A'}</div>
                        </div>
                    </Link>
                ))}
            </div>
            {movies.length === 0 && <p>No movies found. Please seed the database.</p>}
        </div>
    );
};

export default Home;
