import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ArrowLeft, Clock, Film, Star, Ticket } from 'lucide-react';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get(`http://localhost:5000/api/movies/${id}`);
            setMovie(data);
            if (data.shows && data.shows.length > 0) {
                const dates = [...new Set(data.shows.map(s => new Date(s.startTime).setHours(0, 0, 0, 0)))];
                setSelectedDate(dates[0]);
            }
        };
        fetch();
    }, [id]);

    if (!movie) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading...</div>;

    // Filter shows
    const shows = movie.shows ? movie.shows.filter(s => new Date(s.startTime).setHours(0, 0, 0, 0) === selectedDate) : [];

    // Group shows by Theatre
    const showsByTheatre = shows.reduce((acc, show) => {
        const theatreName = show.screen.theatre.name;
        if (!acc[theatreName]) acc[theatreName] = [];
        acc[theatreName].push(show);
        return acc;
    }, {});

    return (
        <div style={{ background: '#0f1014', minHeight: '100vh', color: 'white' }}>
            <Navbar />

            {/* Backdrop */}
            <div style={{ height: '50vh', position: 'relative', marginTop: '-80px' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `url(${movie.backdrop || movie.poster}) center/cover fixed`,
                    filter: 'brightness(0.6)'
                }}></div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #0f1014)' }}></div>
            </div>

            <div className="container" style={{ position: 'relative', marginTop: '-150px', zIndex: 10, display: 'flex', gap: '50px' }}>
                {/* Poster */}
                <div style={{ width: '300px', flexShrink: 0 }}>
                    <img src={movie.poster} style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }} />
                </div>

                <div style={{ paddingTop: '60px', flex: 1 }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '15px' }}>{movie.title}</h1>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', color: '#ccc', fontSize: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {movie.duration}m</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Film size={16} /> {movie.genres.join(', ')}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffd700' }}><Star size={16} fill="#ffd700" /> {movie.rating}</span>
                    </div>

                    <p style={{ lineHeight: '1.8', color: '#aaa', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '800px' }}>{movie.description}</p>

                    {/* Booking Section */}
                    <div style={{ background: '#1b1c22', padding: '30px', borderRadius: '20px', border: '1px solid #2f303a' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.4rem' }}>Showtimes</h3>

                        {/* Date Tabs */}
                        <div style={{ display: 'flex', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #2f303a', marginBottom: '25px', overflowX: 'auto' }}>
                            {[...new Set(movie.shows?.map(s => new Date(s.startTime).setHours(0, 0, 0, 0)))].sort().map(dateTs => {
                                const date = new Date(dateTs);
                                const isSelected = selectedDate === dateTs;
                                return (
                                    <button
                                        key={dateTs}
                                        onClick={() => setSelectedDate(dateTs)}
                                        style={{
                                            padding: '10px 20px',
                                            background: isSelected ? 'var(--primary)' : 'transparent',
                                            border: isSelected ? 'none' : '1px solid #444',
                                            borderRadius: '8px',
                                            color: isSelected ? 'white' : '#aaa',
                                            cursor: 'pointer',
                                            minWidth: '80px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{date.getDate()}</div>
                                    </button>
                                )
                            })}
                        </div>

                        {Object.entries(showsByTheatre).map(([theatre, shows]) => (
                            <div key={theatre} style={{ marginBottom: '25px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{theatre}</div>
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    {shows.map(show => (
                                        <button
                                            key={show.id}
                                            onClick={() => navigate(`/booking/${show.id}`)}
                                            style={{
                                                padding: '12px 20px',
                                                background: 'transparent',
                                                border: '1px solid #4fa94d',
                                                color: '#4fa94d',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: '0.2s',
                                                ':hover': { background: '#4fa94d', color: 'black' }
                                            }}
                                        >
                                            <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>{show.screen.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
