import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/movies/${id}`);
                setMovie(data);
            } catch (error) { console.error(error); }
        };
        fetchMovie();
    }, [id]);

    if (!movie) return <div className="container page-container">Loading...</div>;

    const handleShowSelect = (showId) => {
        navigate(`/booking/${showId}`);
    };

    return (
        <div className="container page-container">
            <div style={{ display: 'flex', gap: '40px', marginTop: '20px', flexWrap: 'wrap' }}>
                <img src={movie.poster || 'https://via.placeholder.com/300x450'} style={{ width: '300px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{movie.title}</h1>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>{movie.description}</p>
                    <p style={{ marginTop: '10px' }}><strong>Genre:</strong> {movie.genres.join(', ')}</p>
                    <p><strong>Rating:</strong> ⭐ {movie.rating}</p>
                    <p><strong>Duration:</strong> {movie.duration} mins</p>

                    <h3 style={{ marginTop: '30px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>Showtimes</h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
                        {movie.shows?.map(show => (
                            <button key={show.id} className="btn btn-outline" onClick={() => handleShowSelect(show.id)}>
                                <div>{new Date(show.startTime).toLocaleDateString()}</div>
                                <div style={{ fontSize: '1.2rem' }}>{new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{show.screen.name}</div>
                            </button>
                        ))}
                        {(!movie.shows || movie.shows.length === 0) && <p>No shows available.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MovieDetails;
