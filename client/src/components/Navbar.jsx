import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Film, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <Film size={24} /> <span>MovieTicket</span>
                </Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <span className="user-info"><User size={18} /> {user.name}</span>
                            <Link to="/my-bookings">My Bookings</Link>
                            <button onClick={logout} className="btn-icon"><LogOut size={18} /></button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary">Login</Link>
                            <Link to="/register" className="btn btn-outline">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
