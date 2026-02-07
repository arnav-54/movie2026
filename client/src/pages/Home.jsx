import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, Calendar } from 'lucide-react';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [genres, setGenres] = useState(['All']);
    const [heroMovie, setHeroMovie] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/movies');
                setMovies(data);
                setFilteredMovies(data);
                if (data.length > 0) setHeroMovie(data[0]);

                // Extract unique genres
                const allGenres = new Set(['All']);
                data.forEach(m => m.genres.forEach(g => allGenres.add(g)));
                setGenres(Array.from(allGenres));
            } catch (error) {
                console.error(error);
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        let result = movies;
        if (selectedGenre !== 'All') {
            result = result.filter(m => m.genres.includes(selectedGenre));
        }
        if (search) {
            result = result.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredMovies(result);
    }, [search, selectedGenre, movies]);

    return (
        <div className="container page-container">
            {/* Hero Section */}
            {heroMovie && (
                <div className="hero-section">
                    <div
                        className="hero-bg"
                        style={{ backgroundImage: `url(${heroMovie.poster})` }}
                    ></div>
                    <div className="hero-content">
                        <img src={heroMovie.poster} alt={heroMovie.title} className="hero-poster" />
                        <div className="hero-details">
                            <div className="hero-tags">
                                {heroMovie.genres.map(g => <span key={g} className="tag">{g}</span>)}
                                <span className="tag" style={{ background: 'var(--primary)', color: '#000', fontWeight: 'bold' }}>★ {heroMovie.rating}</span>
                            </div>
                            <h1>{heroMovie.title}</h1>
                            <p style={{ maxWidth: '600px', lineHeight: '1.6', color: '#ddd', fontSize: '1.1rem' }}>{heroMovie.description}</p>
                            <div style={{ marginTop: '20px' }}>
                                <Link to={`/movie/${heroMovie.id}`} className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>Book Tickets</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
                <div className="filter-bar">
                    {genres.map(g => (
                        <div
                            key={g}
                            className={`filter-chip ${selectedGenre === g ? 'active' : ''}`}
                            onClick={() => setSelectedGenre(g)}
                        >
                            {g}
                        </div>
                    ))}
                </div>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ padding: '10px 20px', width: '250px', borderRadius: '30px', border: '1px solid #444', background: '#222' }}
                    />
                </div>
            </div>

            {/* Movie Grid */}
            <h2 style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '15px', marginTop: '40px' }}>Now Showing</h2>
            <div className="movie-grid">
                {filteredMovies.map(movie => (
                    <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                        <img src={movie.poster || 'https://via.placeholder.com/300x450'} alt={movie.title} className="movie-poster" />
                        <div className="movie-info">
                            <div className="rating-badge" style={{ marginBottom: '5px', fontSize: '0.8rem' }}>
                                <Star size={14} className="star-icon" fill="var(--primary)" /> {movie.rating}
                            </div>
                            <div className="movie-title">{movie.title}</div>
                            <div className="movie-meta">
                                <span>{movie.genres.slice(0, 2).join('/')}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {filteredMovies.length === 0 && <p style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>No movies found matching your criteria.</p>}
        </div>
    );
};

export default Home;
