import React from "react";

const TopicEditForm = ({ match }) => {
  const { topicName } = match.params;

  // Your edit form logic here

  return (
    <div>
      <h1>Edit Topic: {topicName}</h1>
      {/* Your edit form components and logic */}
    </div>
  );
};

export default TopicEditForm;
