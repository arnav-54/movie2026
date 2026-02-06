import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';

const SeatSelection = () => {
    const { showId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [show, setShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        // Socket init
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join_show', showId);

        socketRef.current.on('seat_locked', (seats) => {
            // Real-time update logic could be more complex here
            console.log('Seats locked by others:', seats);
        });

        return () => socketRef.current.disconnect();
    }, [showId]);

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/shows/${showId}`);
                setShow(data);
                setBookedSeats(data.bookedSeats);
            } catch (e) { console.error(e); }
        };
        fetchShow();
    }, [showId]);

    const handleSeatClick = (seat) => {
        if (!user) {
            alert('Please login to book seats');
            navigate('/login');
            return;
        }
        if (bookedSeats.includes(seat)) return;

        if (selectedSeats.includes(seat)) {
            const newSeats = selectedSeats.filter(s => s !== seat);
            setSelectedSeats(newSeats);
            socketRef.current.emit('select_seat', { showId, seats: newSeats });
        } else {
            const newSeats = [...selectedSeats, seat];
            setSelectedSeats(newSeats);
            socketRef.current.emit('select_seat', { showId, seats: newSeats });
        }
    };

    const handleBooking = async () => {
        try {
            // In a real app we would attach token to axios interceptors
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            await axios.post('http://localhost:5000/api/bookings', {
                showId,
                seats: selectedSeats,
                totalPrice: selectedSeats.length * show.price
            }, config);

            alert('Booking Confirmed!');
            navigate('/'); // Or to a success page
        } catch (e) {
            alert('Booking Failed: ' + (e.response?.data?.message || e.message));
        }
    };

    if (!show) return <div className="container page-container">Loading...</div>;

    // Generate grid
    const rows = show.screen.rows || 10;
    const cols = show.screen.cols || 10;
    const grid = [];
    for (let r = 0; r < rows; r++) {
        const rowSeats = [];
        for (let c = 0; c < cols; c++) {
            const seatId = `${String.fromCharCode(65 + r)}${c + 1}`;
            rowSeats.push(seatId);
        }
        grid.push(rowSeats);
    }

    return (
        <div className="container page-container" style={{ textAlign: 'center' }}>
            <h2>Select Seats for {show.movie.title}</h2>
            <p>{show.screen.name} - {new Date(show.startTime).toLocaleString()}</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '30px', overflowX: 'auto' }}>
                <div style={{ width: '600px', height: '30px', background: 'linear-gradient(to bottom, #fff, transparent)', opacity: 0.1, marginBottom: '20px', borderRadius: '50% 50% 0 0' }}></div>
                <div style={{ marginBottom: '20px', color: '#888', letterSpacing: '5px' }}>SCREEN</div>

                {grid.map((row, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px' }}>
                        {row.map(seat => {
                            const isBooked = bookedSeats.includes(seat);
                            const isSelected = selectedSeats.includes(seat);
                            return (
                                <div
                                    key={seat}
                                    onClick={() => handleSeatClick(seat)}
                                    title={seat}
                                    style={{
                                        width: '32px', height: '32px',
                                        background: isBooked ? '#444' : isSelected ? 'var(--primary)' : '#fff',
                                        color: isBooked ? '#666' : isSelected ? 'white' : '#222',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: isBooked ? 'not-allowed' : 'pointer',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {/* {seat} - maybe too small text, hide if zoomed out */}
                                </div>
                            );
                        })}
                    </div>
                ))}

                <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '4px' }}></div> Available</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '4px' }}></div> Selected</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '20px', height: '20px', background: '#444', borderRadius: '4px' }}></div> Booked</div>
                </div>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#222', borderRadius: '8px', display: 'inline-block', minWidth: '300px' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Selected: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '20px' }}>Total: ${selectedSeats.length * show.price}</p>
                <button className="btn btn-primary" onClick={handleBooking} disabled={selectedSeats.length === 0} style={{ padding: '10px 40px', fontSize: '1.1rem' }}>Confirm Booking</button>
            </div>
        </div>
    );
};
export default SeatSelection;
