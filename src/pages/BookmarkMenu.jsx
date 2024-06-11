import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/BookmarkMenu.css";

const BookmarkMenu = () => {
  
  const bookmarkedItems = [
    { id: 1, title: "Hello world", description: "Lorem ipsum" },
    { id: 2, title: "Programming", description: "Some programming stuff here" },
    { id: 3, title: "Math", description: "Some math stuff here" },
  ];

  return (
    <div className="bookmarked-container">
      <h1>Bookmarked Items</h1>
      <ul className="bookmarked-list">
        {bookmarkedItems.map(item => (
          <li key={item.id} className="bookmarked-item">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
      <Link to="/" className="btn btn-dark">Back to Home</Link>
    </div>
  );
};

export default BookmarkMenu;
