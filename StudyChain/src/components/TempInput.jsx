// AddTopics.jsx

import React, { useState } from 'react';
import { runQuery, nodeExists } from '../../database/graphData';

const AddTopics = () => {
  const [firstTopic, setNextTopic] = useState('');
  const [secondTopic, setNextTopicCategory] = useState('');
  const [message, setMessage] = useState('');


  const handleNextTopicChange = (e) => {
    setNextTopic(e.target.value);
  };

  const handleNextTopicCategoryChange = (e) => {
    setNextTopicCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let query;
      let params;

      // Check if first topic exists
      const newTopicExists = await nodeExists('Subject', { name: firstTopic });
      if (!newTopicExists) {
        query = `
          CREATE (a:Subject {name: $firstTopic})
        `;
        params = { firstTopic };
        await runQuery(query, params);
      }

      // Check if next topic exists
      const nextTopicExists = await nodeExists('Subject', { name: secondTopic });
      if (!nextTopicExists) {
        query = `
          CREATE (b:Subject {name: $secondTopic})
        `;
        params = { secondTopic};
        await runQuery(query, params);
      }

      // Create relationship
      query = `
        MATCH (a:Subject {name: $firstTopic}), (b:Subject {name: $secondTopic})
        MERGE (a)-[:IS_USED_IN]->(b)
      `;
      params = { firstTopic, secondTopic };
      await runQuery(query, params);

      setMessage('Topics and relationship added successfully!');
    } catch (error) {
      console.error('Error adding topics and relationship:', error);
      setMessage('Failed to add topics and relationship.');
    }
  };

  return (
    <div>
      <h3>Add Link</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Topic:
            <input type="text" value={firstTopic} onChange={handleNextTopicChange} required />
          </label>
        </div>
        <div>
          <label>
            Is Used By:
            <input type="text" value={secondTopic} onChange={handleNextTopicCategoryChange} required />
          </label>
        </div>
        <button type="submit">Add Topics</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddTopics;
