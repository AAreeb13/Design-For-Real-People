import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/BookmarkMenu.css";
import { getCurrentUserData, getUserBookmarks } from "../../database/firebase";
import { getGraphData } from "../../database/graphData";

const BookmarkMenu = () => {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const userData = await getCurrentUserData();
        
        if (userData) {
          const bookmarkedNames = await getUserBookmarks(userData.email);
          const { nodes } = await getGraphData();
          const items = nodes.filter((node) => bookmarkedNames[node.name])
          setBookmarkedItems(items);
        }
      } catch (err) {
        setError("Failed to fetch bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bookmarked-container">
      <h1>Bookmarked Items</h1>
      <ul className="bookmarked-list">
        {bookmarkedItems.map((item) => (
          <li key={item.name} className="bookmarked-item">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
      <Link to="/" className="btn btn-dark">
        Back to Home
      </Link>
    </div>
  );
};

export default BookmarkMenu;
