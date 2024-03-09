import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Friends.scss';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Retrieve currentUser object from local storage
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser || !currentUser.id) {
          console.error('Current user information not found.');
          return;
        }
  
        // Fetch friends using the id of the current user
        const response = await axios.get(`http://localhost:8000/api/relationships/friends/${currentUser.id}`);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
      console.log("ff",friends);
    };
    fetchFriends();
  }, []);
  
  return (
    <div className="friend-list-container">
      <h2>My Friends</h2>
      <div className="friend-list">
        {friends.map((friend) => (
          <div key={friend.id} className="friend">
            <img src={"/upload/" + friend.img} alt="Friends" className="item-image" />
            <span className="friend-username">{friend.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
