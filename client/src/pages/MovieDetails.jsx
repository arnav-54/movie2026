import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, CalendarDays } from 'lucide-react';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/movies/${id}`);
                setMovie(data);
                if (data.shows && data.shows.length > 0) {
                    const today = new Date(data.shows[0].startTime).setHours(0, 0, 0, 0);
                    setSelectedDate(today);
                }
            } catch (error) { console.error(error); }
        };
        fetchMovie();
    }, [id]);

    if (!movie) return <div className="container page-container">Loading...</div>;

    // Group shows by date
    const showsByDate = movie.shows ? movie.shows.reduce((acc, show) => {
        const date = new Date(show.startTime).setHours(0, 0, 0, 0);
        if (!acc[date]) acc[date] = [];
        acc[date].push(show);
        return acc;
    }, {}) : {};

    const dates = Object.keys(showsByDate).sort();

    const handleShowSelect = (showId) => {
        navigate(`/booking/${showId}`);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#121212', paddingBottom: '50px' }}>
            {/* Backdrop Banner */}
            <div style={{ height: '400px', position: 'relative', background: `url(${movie.backdrop || movie.poster}) center/cover fixed`, marginBottom: '-100px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #121212)' }}></div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                    <img
                        src={movie.poster || 'https://via.placeholder.com/300x450'}
                        style={{ width: '280px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                    />

                    <div style={{ paddingTop: '60px', flex: 1 }}>
                        <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', fontWeight: '800' }}>{movie.title}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', color: '#ccc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1.2rem', color: 'white' }}>
                                <Star fill="var(--primary)" color="var(--primary)" />
                                <span style={{ fontWeight: 'bold' }}>{movie.rating}</span>/10
                            </div>
                            <div style={{ background: '#333', padding: '4px 10px', borderRadius: '4px' }}>{movie.duration}m</div>
                            <div>{movie.genres.join(', ')}</div>
                        </div>

                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '800px', marginBottom: '40px' }}>{movie.description}</p>

                        <div style={{ background: '#1f1f1f', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '20px', borderLeft: '4px solid var(--secondary)', paddingLeft: '10px' }}>Select Date & Showtime</h3>

                            {/* Date Selector */}
                            <div className="date-selector">
                                {dates.map(dateStr => {
                                    const date = new Date(parseInt(dateStr));
                                    const isActive = selectedDate === parseInt(dateStr);
                                    return (
                                        <div
                                            key={dateStr}
                                            className={`date-card ${isActive ? 'active' : ''}`}
                                            onClick={() => setSelectedDate(parseInt(dateStr))}
                                            style={{
                                                background: isActive ? 'var(--secondary)' : '#333',
                                                color: isActive ? 'white' : '#aaa',
                                                padding: '10px 20px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                border: isActive ? 'none' : '1px solid #444',
                                                minWidth: '60px'
                                            }}
                                        >
                                            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{date.getDate()}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Shows Grid */}
                            <div style={{ marginTop: '25px' }}>
                                {selectedDate && showsByDate[selectedDate]?.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                        {showsByDate[selectedDate].map(show => (
                                            <button
                                                key={show.id}
                                                className="btn btn-outline"
                                                onClick={() => handleShowSelect(show.id)}
                                                style={{
                                                    padding: '12px 20px',
                                                    borderColor: '#4fa94d',
                                                    color: '#4fa94d',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    background: 'rgba(79, 169, 77, 0.05)'
                                                }}
                                            >
                                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                                    {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                                                    {show.screen.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#666' }}>No shows available for this date.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
export default MovieDetails;
