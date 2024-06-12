import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import "../styles/NotificationAside.css";
import { getCurrentUserData, getNotifications } from "../../database/firebase";

const NotificationAside = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userData = getCurrentUserData()
				console.log("our userdata is", userData)
				const userEmail = userData.email
				const notifications = await getNotifications(userEmail)
				setNotifications(notifications.map((d, i) => {return {id: i, text: d}}))
			} catch (error) {
				console.error("Error fetching messages: ", error)
			}
		}

		fetchData()
	}, [])


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
