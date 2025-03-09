import '../styles/_navbar.scss';
import Badge from '@mui/material/Badge';
import logo from '../assets/logo-trans.svg';
import { LocalMallOutlined} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const cartCount = useSelector(selectCartCount); // Hämtar antalat från varukorgens räknare

    return (
        <div>
            <div className="menu-header">

                {/* Vänsterlogga */}
                <div
                    className="menu-logo"
                    onClick={() => navigate('/menu')}
                    style={{ cursor: 'pointer' }}
                >
                    <img src={logo} alt="Logotyp" />
                </div>

                {/* Höger: Kundvagn med badge */}
                <div
                    className="menu-cart"
                    onClick={() => navigate('/cart')}
                    style={{ cursor: 'pointer' }}
                >
                    <Badge badgeContent={cartCount} color="error">
                        <LocalMallOutlined fontSize="large" />
                    </Badge>

                </div>
            </div>
        </div>
    );
};

export default Navbar;