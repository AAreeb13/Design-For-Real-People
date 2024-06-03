import React from 'react';
import { Link } from 'react-router-dom';
import Graph from "../components/Graph";

const Home = ({ graphData }) => {
  const ourExploreButton = {
    width: "275px"
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
      <div style={{ flex: 1, margin: '10px' }}>
        <h1>StudyChain</h1>
        <h3>Studying Made Simple</h3>
        <Link to="/grid-menu">
          <button type="button" className="btn btn-dark" style={ourExploreButton}>Explore Our Topics</button>
        </Link>
      </div>

      <div style={{ flex: 2, margin: '10px' }}>
        <Graph 
          nodes={graphData.nodes}
          links={graphData.relationships}
          subject={"calculus"} 
        />
      </div>
    </div>
  );
};

export default Home;
