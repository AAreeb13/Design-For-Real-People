import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGraphData } from "../../database/graphData";

const SearchBar = () => {
  const [nodes, setNodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const { nodes } = await getGraphData();
        setNodes(nodes);
      } catch (error) {
        console.error("Failed to fetch graph data:", error);
      }
    };

    fetchGraphData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filteredNodes = nodes.filter((node) =>
        node.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredNodes);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, nodes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (topicName) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/subgraph/${topicName}`);
  };

  return (
    <div className="search-bar">
      <form className="d-flex" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Enter a Topic"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul className="list-group position-absolute">
          {suggestions.map((node, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleSuggestionClick(node.name)}
              style={{ cursor: "pointer" }}
            >
              {node.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
