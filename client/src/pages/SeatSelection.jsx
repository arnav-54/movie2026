import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import { ArrowLeft, ArrowUp, Zap } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

const SeatSelection = () => {
    const { showId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [show, setShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const socketRef = useRef();

    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join_show', showId);

        socketRef.current.on('seat_locked', (seats) => {
            // In a real app we would merge this, simpler for now
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
            // Max 10 seats
            if (selectedSeats.length >= 10) return alert('Max 10 seats allowed');
            const newSeats = [...selectedSeats, seat];
            setSelectedSeats(newSeats);
            socketRef.current.emit('select_seat', { showId, seats: newSeats });
        }
    };

    const confirmBooking = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/bookings', {
                showId, seats: selectedSeats, totalPrice: selectedSeats.length * show.price
            }, config);
            navigate('/my-bookings');
        } catch (e) {
            alert('Booking Failed: ' + (e.response?.data?.message || 'Unknown error'));
            setShowPayment(false);
        }
    };

    if (!show) return <div className="container page-container">Loading...</div>;

    // Generate grid: Gold (Front), Platinum (Middle), Diamond (Back)
    // We will simulate this by dividing rows.
    // Rows A-D: Gold ($price), E-H: Platinum (+$5), I-J: Diamond (+$10)
    // For simplicity, we stick to one price for now but visually separate them.

    const rows = show.screen.rows || 10;
    const cols = show.screen.cols || 10;

    // Group rows
    const goldRows = [];
    const platinumRows = [];

    for (let r = 0; r < rows; r++) {
        const rowSeats = [];
        for (let c = 0; c < cols; c++) {
            rowSeats.push(`${String.fromCharCode(65 + r)}${c + 1}`);
        }
        if (r < 4) goldRows.push({ name: String.fromCharCode(65 + r), seats: rowSeats });
        else platinumRows.push({ name: String.fromCharCode(65 + r), seats: rowSeats });
    }

    return (
        <div style={{ background: '#f2f2f2', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{ background: '#1f2533', padding: '15px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: '500' }}>{show.movie.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{show.screen.theatre.name} | {new Date(show.startTime).toLocaleString()}</div>
                    </div>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {selectedSeats.length} Tickets
                </div>
            </div>

            {/* Booking Area */}
            <div className="container" style={{ paddingTop: '30px', maxWidth: '800px' }}>

                {/* Legend */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px', fontSize: '0.85rem', color: '#666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="seat"></div> Available</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="seat selected" style={{ background: '#1ea83c', borderColor: '#1ea83c' }}></div> Selected</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="seat booked" style={{ background: '#eee' }}></div> Sold</div>
                </div>

                {/* Seats */}
                <div style={{ background: 'white', padding: '40px 20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>

                    {platinumRows.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '10px', paddingLeft: '20px' }}>PLATINUM - ${show.price + 5}</div>
                            {platinumRows.map(row => (
                                <div key={row.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                    <div style={{ width: '20px', color: '#999', fontSize: '0.8rem' }}>{row.name}</div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {row.seats.map(seat => (
                                            <div key={seat}
                                                className={`seat ${bookedSeats.includes(seat) ? 'booked' : ''} ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                            >
                                                {seat.substring(1)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ borderTop: '1px dashed #ddd', margin: '20px 0' }}></div>

                    <div style={{ marginBottom: '50px' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '10px', paddingLeft: '20px' }}>GOLD - ${show.price}</div>
                        {goldRows.map(row => (
                            <div key={row.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                <div style={{ width: '20px', color: '#999', fontSize: '0.8rem' }}>{row.name}</div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {row.seats.map(seat => (
                                        <div key={seat}
                                            className={`seat ${bookedSeats.includes(seat) ? 'booked' : ''} ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                                            onClick={() => handleSeatClick(seat)}
                                        >
                                            {seat.substring(1)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="screen-visual"></div>
                </div>
            </div>

            {/* Bottom Bar */}
            {selectedSeats.length > 0 && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, width: '100%',
                    background: 'white', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                    padding: '15px 40px', display: 'flex', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '15px', fontSize: '1rem', background: '#f84464', borderRadius: '8px' }}
                            onClick={() => setShowPayment(true)}
                        >
                            Pay ${selectedSeats.length * show.price}
                        </button>
                    </div>
                </div>
            )}

            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                totalAmount={selectedSeats.length * show.price}
                onConfirm={confirmBooking}
            />
        </div>
    );
};
export default SeatSelection;
