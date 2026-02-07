import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('movies');

    // Movie Form State
    const [movieForm, setMovieForm] = useState({
        tmdbId: '', title: '', description: '', poster: '', duration: '', rating: '', genres: ''
    });

    // Show Form State
    const [showForm, setShowForm] = useState({
        movieId: '', screenId: '', startTime: '', price: ''
    });

    // Data for dropdowns
    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login'); // Basic protection
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [moviesRes, theatresRes] = await Promise.all([
                axios.get('http://localhost:5000/api/movies'),
                axios.get('http://localhost:5000/api/infra/theatres')
            ]);
            setMovies(moviesRes.data);
            setTheatres(theatresRes.data);

            // Flatten screens for easier selection
            const allScreens = [];
            theatresRes.data.forEach(t => {
                t.screens.forEach(s => {
                    allScreens.push({ ...s, theatreName: t.name });
                });
            });
            setScreens(allScreens);
        } catch (e) { console.error(e); }
    };

    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...movieForm,
                tmdbId: parseInt(movieForm.tmdbId),
                duration: parseInt(movieForm.duration),
                rating: parseFloat(movieForm.rating),
                genres: movieForm.genres.split(',').map(g => g.trim())
            };
            await axios.post('http://localhost:5000/api/movies', payload);
            alert('Movie Added!');
            setMovieForm({ tmdbId: '', title: '', description: '', poster: '', duration: '', rating: '', genres: '' });
            fetchData();
        } catch (e) { alert('Error adding movie'); }
    };

    const handleShowSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...showForm,
                price: parseFloat(showForm.price)
            };
            await axios.post('http://localhost:5000/api/shows', payload);
            alert('Show Scheduled!');
            setShowForm({ movieId: '', screenId: '', startTime: '', price: '' });
        } catch (e) { alert('Error scheduling show'); }
    };

    // TMDB Fetch Helper
    const fetchFromTMDB = async () => {
        if (!movieForm.tmdbId) return alert('Enter TMDB ID first');
        try {
            // Note: In a real app, this call might go through your backend to hide the API key, 
            // or you'd use a client-side key. For this demo, we'll assume manual entry or a public key.
            // Since we don't have a configured TMDB key in frontend env, I'll simulate or ask user to fill.
            // Actually, let's try to hit the backend if we had an endpoint, but we don't.
            // I will implement a quick fetch if they provide a key, or just alert.
            const apiKey = prompt("Enter TMDB API Key (or cancel to fill manually):");
            if (!apiKey) return;

            const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieForm.tmdbId}?api_key=${apiKey}`);
            const data = res.data;

            setMovieForm({
                tmdbId: data.id,
                title: data.title,
                description: data.overview,
                poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
                duration: data.runtime,
                rating: data.vote_average,
                genres: data.genres.map(g => g.name).join(', ')
            });
        } catch (e) { alert('Failed to fetch from TMDB'); console.error(e); }
    };

    return (
        <div className="container page-container">
            <h1>Admin Dashboard</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #333' }}>
                <button
                    className={`btn ${activeTab === 'movies' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('movies')}
                >
                    Add Movie
                </button>
                <button
                    className={`btn ${activeTab === 'shows' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('shows')}
                >
                    Schedule Show
                </button>
            </div>

            {activeTab === 'movies' && (
                <div className="auth-card" style={{ maxWidth: '800px', margin: '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Add New Movie</h2>
                        <button type="button" onClick={fetchFromTMDB} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Autofill from TMDB</button>
                    </div>

                    <form onSubmit={handleMovieSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label>TMDB ID</label>
                            <input value={movieForm.tmdbId} onChange={e => setMovieForm({ ...movieForm, tmdbId: e.target.value })} required placeholder="e.g. 550" />
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input value={movieForm.title} onChange={e => setMovieForm({ ...movieForm, title: e.target.value })} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                            <label>Description</label>
                            <textarea
                                value={movieForm.description}
                                onChange={e => setMovieForm({ ...movieForm, description: e.target.value })}
                                style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #444', color: 'white', borderRadius: '4px', minHeight: '100px' }}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Poster URL</label>
                            <input value={movieForm.poster} onChange={e => setMovieForm({ ...movieForm, poster: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Duration (mins)</label>
                            <input type="number" value={movieForm.duration} onChange={e => setMovieForm({ ...movieForm, duration: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Rating (0-10)</label>
                            <input type="number" step="0.1" value={movieForm.rating} onChange={e => setMovieForm({ ...movieForm, rating: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Genres (comma separated)</label>
                            <input value={movieForm.genres} onChange={e => setMovieForm({ ...movieForm, genres: e.target.value })} required />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <button type="submit" className="btn btn-primary">Add Movie</button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'shows' && (
                <div className="auth-card" style={{ maxWidth: '600px', margin: '0' }}>
                    <h2>Schedule New Show</h2>
                    <form onSubmit={handleShowSubmit}>
                        <div className="form-group">
                            <label>Movie</label>
                            <select
                                value={showForm.movieId}
                                onChange={e => setShowForm({ ...showForm, movieId: e.target.value })}
                                style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #444', color: 'white', borderRadius: '4px' }}
                                required
                            >
                                <option value="">Select Movie</option>
                                {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Screen</label>
                            <select
                                value={showForm.screenId}
                                onChange={e => setShowForm({ ...showForm, screenId: e.target.value })}
                                style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #444', color: 'white', borderRadius: '4px' }}
                                required
                            >
                                <option value="">Select Screen</option>
                                {screens.map(s => <option key={s.id} value={s.id}>{s.theatreName} - {s.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Start Time</label>
                            <input
                                type="datetime-local"
                                value={showForm.startTime}
                                onChange={e => setShowForm({ ...showForm, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input
                                type="number"
                                value={showForm.price}
                                onChange={e => setShowForm({ ...showForm, price: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Create Show</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
