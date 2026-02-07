import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Search, MapPin, Menu, User, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [location, setLocation] = useState('New York');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search logic or navigate to search page
        console.log('Searching for:', searchTerm);
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flex: 1 }}>
                    <Link to="/" className="logo">
                        <span style={{ color: '#fff' }}>MOVIE</span><span style={{ background: 'var(--secondary)', color: 'white', padding: '0 5px', borderRadius: '4px' }}>TIX</span>
                    </Link>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Search for Movies, Events, Plays, Sports and Activities"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                borderRadius: '4px',
                                border: '1px solid #444',
                                background: '#fff',
                                color: '#333',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>

                <div className="nav-links">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginRight: '15px', color: '#ccc' }}>
                        <span style={{ fontSize: '0.9rem' }}>{location}</span>
                        <ChevronDown size={14} />
                    </div>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Link to="/my-bookings" style={{ fontSize: '0.9rem' }}>Bookings</Link>
                            {/* <Link to="/admin" style={{fontSize: '0.9rem'}}>Admin</Link> */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold' }}>
                                    {user.name[0].toUpperCase()}
                                </div>
                                <button onClick={logout} className="btn-icon" title="Logout"><LogOut size={18} /></button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-secondary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>Sign In</Link>
                    )}

                    <div className="menu-icon" style={{ marginLeft: '10px', cursor: 'pointer' }}>
                        <Menu size={24} color="white" />
                    </div>
                </div>
            </div>

            {/* Sub-header for categories similar to BMS */}
            <div style={{
                background: '#222',
                height: '40px',
                width: '100%',
                position: 'absolute',
                top: '64px',
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#ccc' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link to="/">Movies</Link>
                        <span>Stream</span>
                        <span>Events</span>
                        <span>Plays</span>
                        <span>Sports</span>
                        <span>Activities</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem' }}>
                        <span>ListYourShow</span>
                        <span>Corporates</span>
                        <span>Offers</span>
                        <span>Gift Cards</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
