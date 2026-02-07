import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Info, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [hero, setHero] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            const { data } = await axios.get('http://localhost:5000/api/movies');
            setMovies(data);
            if (data.length > 0) setHero(data[0]);
        };
        fetchMovies();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'transparnt' }}>
            <Navbar />

            {/* Immersive Hero Section */}
            {hero && (
                <div className="hero-wrapper">
                    <div className="hero-bg" style={{ backgroundImage: `url(${hero.backdrop || hero.poster})` }}></div>
                    <div className="hero-overlay"></div>
                    <div className="container hero-content">
                        <div className="hero-meta">
                            <span className="hero-badge">Original</span>
                            <span className="hero-badge">4K HDR</span>
                            <span>{hero.year || "2024"}</span>
                            <span>{hero.duration} min</span>
                            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>★ {hero.rating}</span>
                        </div>
                        <h1 className="hero-title">{hero.title}</h1>
                        <p style={{ maxWidth: '500px', lineHeight: '1.6', color: '#ccc', marginBottom: '30px', fontSize: '1.1rem' }}>
                            {hero.description.substring(0, 150)}...
                        </p>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Link to={`/movie/${hero.id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                <Ticket size={20} /> Get Tickets
                            </Link>
                            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <PlayCircle size={20} /> Watch Trailer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: '100px' }}>

                {/* Section 1: Now Showing */}
                <div className="section-header">
                    <div className="section-title">Now In Theatres</div>
                    <div style={{ color: '#888', cursor: 'pointer', fontSize: '0.9rem' }}>View All</div>
                </div>

                <div className="movie-grid">
                    {movies.map(movie => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                            <div className="poster-wrapper">
                                <img src={movie.poster} alt={movie.title} loading="lazy" />
                                <div className="poster-overlay"></div>
                                <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', display: 'flex', justifyContent: 'center', opacity: 0, transition: '0.3s' }} className="hover-btn">
                                    <button className="btn btn-primary" style={{ padding: '8px 20px', width: '100%' }}>Book Now</button>
                                </div>
                            </div>
                            <div className="movie-info">
                                <h3 className="movie-title">{movie.title}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888' }}>
                                    <span>{movie.genres[0]}</span>
                                    <span style={{ color: '#ffd700' }}>★ {movie.rating}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Section 2: Coming Soon (Mock) */}
                <div className="section-header" style={{ marginTop: '80px' }}>
                    <div className="section-title">Coming Soon</div>
                </div>
                <div style={{ display: 'flex', overflowX: 'auto', gap: '30px', paddingBottom: '20px' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ minWidth: '280px', height: '160px', background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                            Coming Soon
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
import { Ticket } from 'lucide-react';

export default Home;
