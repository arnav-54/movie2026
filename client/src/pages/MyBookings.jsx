import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
                setBookings(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBookings();
    }, [user, navigate]);

    return (
        <div className="container page-container">
            <h1 style={{ marginBottom: '30px', borderLeft: '4px solid var(--primary)', paddingLeft: '15px' }}>My Ticket History</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {bookings.map(booking => (
                    <div key={booking.id} style={{
                        background: '#1f1f1f',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        gap: '20px',
                        border: '1px solid #333'
                    }}>
                        <img
                            src={booking.show.movie.poster}
                            alt={booking.show.movie.title}
                            style={{ width: '100px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{booking.show.movie.title}</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', color: '#ccc' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Theatre</div>
                                    <div>{booking.show.screen.theatre.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Showtime</div>
                                    <div>{new Date(booking.show.startTime).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Seats</div>
                                    <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{booking.seats.join(', ')}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Amount Paid</div>
                                    <div>${booking.totalPrice}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #444' }}>
                                <span style={{
                                    background: 'rgba(0,255,0,0.1)',
                                    color: '#4ade80',
                                    padding: '5px 10px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {booking.status}
                                </span>
                                <span style={{ marginLeft: '10px', color: '#666', fontSize: '0.8rem' }}>Booking ID: {booking.id}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {bookings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <h3>No bookings found</h3>
                        <p>Go catch a movie!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
