import React, { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import Backtrack from "./Backtrack";
import { getGraphData, getPaths, getFormData } from "../../database/graphData";
import {
  getCurrentUserData,
  getCurrentUserDocData,
  updateBookmarkStatus,
  updateCompletionStatus,
} from "../../database/firebase";
import "../styles/TopicEntry.css";
import TopicRatingButtons from "./TopicRatingButtons";
import TopicRatingDisplay from "./TopicRatingDisplay";
import SuggestionOverlay from "./SuggestionOverlay";

const TopicEntry = ({ userData, graphData, node }) => {
  const [topicNode, setTopicNode] = useState(null);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [fullPath, setFullPath] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [privledge, setPrivledge] = useState(null);
  const [formNode, setFormNode] = useState(null);
  const [showSuggestionOverlay, setShowSuggestionOverlay] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const fetchedTopic = await getTopic(node);
        if (fetchedTopic.length > 0) {
          setTopicNode(fetchedTopic[0]);
          setFormNode(await getFormData(fetchedTopic[0].name));
          const userData = await getCurrentUserData();
          if (userData) {
            setUserEmail(userData.email);
            setUserId(userData.uid);
            const userDoc = await getCurrentUserDocData(userData.email);

            if (userDoc && userDoc.subjectProgress) {
              setCompleted(
                userDoc.subjectProgress[fetchedTopic[0].name] || false
              );
              setPrivledge(userDoc.privledge || null);
              if (userDoc.privledge === "member") {
                setIsBookmarked(
                  userDoc.bookmarks[fetchedTopic[0].name] || false
                );
                setIsMember(userDoc.privledge === "member");
              }
            } else {
              setCompleted(false);
            }
          }
        } else {
          setError("Topic not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch topic data.");
      }
    };

    fetchTopic();
  }, [node]);

  useEffect(() => {
    const fetchPaths = async () => {
      if (topicNode) {
        try {
          const paths = await getPaths(topicNode, graphData);
          setFullPath(paths);
        } catch (err) {
          setError("Failed to fetch paths.");
        }
      }
    };

    fetchPaths();
  }, [topicNode, graphData]);

  const toggleCompletion = async () => {
    const newStatus = !completed;
    setCompleted(newStatus);

    if (userEmail && topicNode) {
      const topicKey = topicNode.name;
      await updateCompletionStatus(userEmail, topicKey, newStatus);
    }
  };

  const toggleBookmark = async () => {
    const newStatus = !isBookmarked;
    setIsBookmarked(newStatus);

    if (userEmail && topicNode) {
      const topicKey = topicNode.name;
      await updateBookmarkStatus(userEmail, topicKey, newStatus);
    }
  };

  const handleSuggestTopic = () => {
    console.log("Suggest Topic button clicked");
    toggleSuggestionOverlay();
  };

  const toggleSuggestionOverlay = () => {
    setShowSuggestionOverlay((prev) => !prev);
  };

  const handleRatingChange = async (rating) => {
    console.log("Rating changed to:", rating);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!topicNode || !formNode) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Backtrack paths={fullPath} />
      {privledge === "member" && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: "9999",
            marginTop: "80px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={toggleCompletion}
            className={`btn btn-block ${
              completed ? "btn-dark" : "btn-outline-dark"
            }`}
            style={{ marginTop: "15px" }}
          >
            {completed ? "Completed ✔️" : "Mark as Completed"}
          </button>
          {privledge === "member" && (
            <>
              <button
                className={`btn btn-block ${
                  isBookmarked ? "btn-warning" : "btn-outline-warning"
                }`}
                onClick={toggleBookmark}
              >
                <FaBookmark /> {isBookmarked ? "Bookmarked" : "Bookmark Topic"}
              </button>

              {showSuggestionOverlay && (
                <SuggestionOverlay onClose={toggleSuggestionOverlay} />
              )}
              <button
                className="btn btn-block btn-outline-primary"
                onClick={toggleSuggestionOverlay}
              >
                Suggest Topic
              </button>
            </>
          )}
        </div>
      )}
      <div className="our-topic-div">
        <h2 className="topic-name our-topic-name">{topicNode.name}</h2>

        <h3>Description:</h3>
        <p className="topic-description">{topicNode.description}</p>

        <h3>Learning Objectives:</h3>
        <ul>
          {topicNode.learning_objectives.map((o, index) => (
            <li key={index}>{o}</li>
          ))}
        </ul>

        {console.log("formdata", formNode)}

        <FormDisplay formData={formNode} />

        {privledge === "member" && (
          <TopicRatingButtons
            onRatingChange={handleRatingChange}
            userEmail={userEmail}
            topicName={topicNode.name}
          />
        )}
        {privledge === "moderator" && (
          <TopicRatingDisplay topicName={topicNode.name} />
        )}
      </div>
    </div>
  );
};

const getTopic = async (name) => {
  console.log("we got here");
  const { nodes, relationships } = await getGraphData();
  return nodes.filter((n) => n.name === name);
};

const FormDisplay = ({ formData }) => {
  return (
    <div>
      {Object.entries(formData).map(([key, value]) => (
        <div key={key}>
          <h3>{title(key)}:</h3>
          <ul>
            {typeof value === "string" ? (
              <li>{value}</li>
            ) : (
              value.map((item, index) => <li key={index}>{item}</li>)
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

const title = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default TopicEntry;
