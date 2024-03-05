import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './navbar.scss';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [err, setErr] = useState(null);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      setErr(error.response.data);
    }
  };

  const handleSearch = async () => {
    try {
      console.log('ddgd');
      const response = await axios.post('http://localhost:8000/api/users/searchUser', {
        searchbar: searchTerm
      });
      setSearchResults(response.data);
      if (response.data.length > 0) {
        const userId = response.data[0].id;
        window.location.href = `/profile/${userId}`;
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      try {
        const response = await axios.post('http://localhost:8000/api/users/searchUser', {
          searchbar: value
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span>ConnectiveVerse</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? <WbSunnyOutlinedIcon onClick={toggle} /> : <DarkModeOutlinedIcon onClick={toggle} />}
        <GridViewOutlinedIcon />
        <div className="search">
  <SearchOutlinedIcon onClick={handleSearch} />
  <input
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={handleInputChange}
  />
  {suggestions.length > 0 && (
    <div className="suggestions">
      {suggestions.map((user) => (
        <div className="suggestion-item" key={user.id} onClick={() => window.location.href = `/profile/${user.id}`}>
          {user.username}
        </div>
      ))}
    </div>
  )}
</div>

              </div>

      <div className="right">
        <Link
          to={`/profile/${currentUser.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <PersonOutlinedIcon />
        </Link>
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="logout">
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none',
              outline: 'none',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
