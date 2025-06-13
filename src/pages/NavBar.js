import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Bored Type</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/test">Test</Link></li>
        <li><a href="https://github.com/175552/typingtest/tree/main" target="_blank" rel="noopener noreferrer">GitHub</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;