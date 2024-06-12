import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import "../styles/NotificationAside.css";

const NotificationAside = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "You have a new message" },
    { id: 2, text: "Your topic suggestion was approved" },
    { id: 3, text: "alot of text here that should span multiple lines so that the user will either need to see a different ddisplay or this will get dotted out using ..."}
  ]);

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  return (
    <>
      <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
        <FaBell />
      </div>
      {showNotifications && (
        <aside className="notification-aside">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Notifications</h2>
            <Button variant="outline-dark" onClick={() => setShowNotifications(false)}>Close</Button>
          </div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-message">
                <span>{notification.text}</span>
                <button className="delete-button" onClick={() => handleDeleteNotification(notification.id)}>x</button>
              </div>
            ))
          ) : (
            <div>No new notifications</div>
          )}
        </aside>
      )}
    </>
  );
};

export default NotificationAside;
