import React, { useState, useEffect } from "react";
function TopicEntry(topic) {

    let topic_node = getTopic(topic.title);

    return <div>
        <h1 className="topic-header">{topic_node.subject + "/" + topic_node.name}</h1>
        <h2 className="topic-name">{topic_node.name}</h2>

            <h3>Description:</h3>
            <p className="topic-description">{topic_node.description}</p>
            
                <h3>Learning Objectives:</h3>
                <ul>
                    {topic.learning_objectives.map((o,index) => <li key={index}>{o}</li>)}
                </ul>

                <h3>Prerequisites:</h3>
                <ul>
                    {topic.requires.map((o,index) => <li key={index}>{o}</li>)}
                </ul>
                <h3>Resources:</h3>
                <ul>
                    {topic.resources.map((o,index) => <li key={index}>{o}</li>)}
                </ul>        
    </div>
}

export default TopicEntry

const getTopic = async (name) => {
    let { nodes, relationships } = await getGraphData();
    nodes = nodes.filter((n) => n.name === name);
    return nodes;
  };
  

  
// CREATE (n:Subject{
// 	name: 'proofs',
// 	subject: 'calculus',
// 	type: 'topic',
// 	description: 'The art of verifying mathematical statements ',
// 	requires: ['basic arithmetic'],
// 	links: 'www.example.com',
// 	approvals: 102,
// 	rejections: 23,
// 	comments: [],
// 	suggestions: [],
// 	resources: [],
// 	learning_objectives: []
// });