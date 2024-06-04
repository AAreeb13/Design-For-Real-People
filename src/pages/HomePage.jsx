import { Link } from "react-router-dom";
import Graph from "../components/Graph";

function HomePage({ graphData }) {
  const ourExploreButton = {
    width: "275px",
  };

  const graphStyle = {
    marginLeft: "17%",
    border: "1px solid black",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    borderRadius: "10px",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <div style={{ flex: 1, margin: "10px" }}>
        <h1>StudyChain</h1>
        <h3>Studying Made Simple</h3>
        <Link to="/grid-menu">
          <button
            type="button"
            className="btn btn-dark"
            style={ourExploreButton}
          >
            Explore Our Topics
          </button>
        </Link>
      </div>

      <div style={{ flex: 2, margin: "10px" }}>
        <Graph
          nodes={graphData.nodes}
          links={graphData.relationships}
          subject={"calculus"}
          width={1000}
          height={800}
          style={graphStyle}
        />
      </div>
    </div>
  );
}

export default HomePage;
