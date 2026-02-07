import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Search, User, LogOut, Ticket, Menu, Bell } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="navbar" style={{
            background: scrolled ? 'rgba(15, 16, 20, 0.95)' : 'transparent',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
            transition: 'all 0.4s ease'
        }}>
            <div className="container nav-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
                    <Link to="/" className="logo">
                        <span>CINE</span><span style={{ color: 'white' }}>VERSE</span>
                    </Link>

                    <div className="nav-links hidden-mobile" style={{ display: 'flex', gap: '30px' }}>
                        <Link to="/" className="active">Movies</Link>
                        <Link to="/theatres">Theatres</Link>
                        <Link to="/events">Events</Link>
                        <Link to="/sports">Sports</Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            style={{
                                padding: '10px 10px 10px 40px',
                                background: 'rgba(255,255,255,0.08) !important',
                                border: '1px solid transparent !important',
                                borderRadius: '30px !important',
                                width: '240px',
                                fontSize: '0.9rem',
                                color: 'white'
                            }}
                        />
                    </div>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Link to="/my-bookings" style={{ position: 'relative' }}>
                                <Ticket size={22} color="#ccc" />
                            </Link>
                            <div className="user-dropdown" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(45deg, #e50914, #ff5e62)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                                    {user.name[0]}
                                </div>
                                <LogOut size={20} color="#ccc" onClick={logout} style={{ cursor: 'pointer', transition: '0.2s', ':hover': { color: 'white' } }} />
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '8px 24px', borderRadius: '4px' }}>Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
