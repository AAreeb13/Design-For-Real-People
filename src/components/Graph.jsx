import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import { getMiniSubjectInSubject, getOrder, getTopicsInSubject } from "../../database/graphData";
import { getCurrentUserData, getUserSubjectProgress } from "../../database/firebase";

const Graph = ({ nodes, links, subject = null, width, height, style }) => {
  const svgRef = useRef();
  const navigate = useNavigate();
  const [totalTopicCount, setTotalTopicCount] = useState(0);
  const [ourTopicCount, setOurTopicCount] = useState(0);
  const [loading, setLoading] = useState(true); // loading status
  const [userLoggedIn, setUserLoggedIn] = useState(false); // user login status

  const [nodesToUse, setNodesToUse] = useState([]);
  const [linksToUse, setLinksToUse] = useState([]);

  useEffect(() => {

    const checkUserLoginStatus = async () => {
      const userIsLoggedIn = getCurrentUserData(); 
      setUserLoggedIn(userIsLoggedIn);
    };

    checkUserLoginStatus();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [totalTopicsCount, ourTopicsCount] = await Promise.all([
        getTotalNodesForSubject(subject),
        getNodesCompleteForSubject(subject)
      ]);
      setTotalTopicCount(totalTopicsCount);
      setOurTopicCount(ourTopicsCount);
      setLoading(false); //  once data is fetched
    };

    const validNodes = subject == null
      ? nodes
      : nodes.filter((n) => n.name === subject || n.subject === subject);

    const nodesToUse = validNodes.map((n) => {
      return { name: n.name, type: n.type };
    });
    setNodesToUse(nodesToUse);

    let linksToUse = links.map((link) => {
      if (link.source == null) {
        return { source: link.source.source, target: link.source.target };
      }
      return { source: link.source, target: link.target };
    });

    const nodeNameList = nodesToUse.map((n) => n.name);
    linksToUse = subject == null
      ? linksToUse
      : linksToUse.filter((link) => {
          return (
            nodeNameList.includes(link.source) &&
            nodeNameList.includes(link.target)
          );
        });
    setLinksToUse(linksToUse);

    const svg = d3.select(svgRef.current);

    const zoom = d3
      .zoom()
      .scaleExtent([0.05, 4]) // Minimum and maximum zoom levels
      .on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    svg.selectAll("*").remove();

    const svgGroup = svg.append("g");
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 50) // Increase this value to move the arrowhead closer to the end of the line
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none");

    const simulation = d3
      .forceSimulation(nodesToUse)
      .force(
        "link",
        d3
          .forceLink(linksToUse)
          .id((d) => d.name)
          .distance(90) // distance = link length
      )
      .force(
        "charge",
        subject == null
          ? d3.forceManyBody().strength(-5000)
          : d3.forceManyBody().strength(-500000)
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svgGroup
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(linksToUse)
      .enter()
      .append("line")
      .attr("stroke-width", 15) // number = thickness of lines
      .attr("marker-end", "url(#arrowhead)");

    const node = svgGroup
      .append("g")
      .selectAll("g")
      .data(nodesToUse)
      .enter()
      .append("g")
      .attr("class", "node");

    const highlightLinks = (d) => {
      const highlightedNodes = new Set();
      const highlightRecursive = (currentNode) => {
        highlightedNodes.add(currentNode.name);
        link
          .filter((l) => l.target.name === currentNode.name)
          .attr("stroke", "blue")
          .each(function (l) {
            if (!highlightedNodes.has(l.source.name)) {
              highlightRecursive(l.source);
            }
          });
      };
      highlightRecursive(d);
    };

    node
      .append("ellipse")
      .filter((d) => d.type === "topic")
      .attr("rx", 300) // ellipse width
      .attr("ry", 100) // ellipse height
      .attr("fill", "#69b3a2")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("click", (event, d) => {
        navigate("/topic/" + d.name);
      })
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", "#508a7c")
          .attr("stroke", "#666");

        // Highlight connected links recursively
        highlightLinks(d);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", "#69b3a2")
          .attr("stroke", "#fff");

        // Reset all links
        link.attr("stroke", "#999").attr("stroke-width", 15);
      });

    node
      .append("rect")
      .filter((d) => d.type === "subject" && d.name === subject)
      .attr("width", 800) // rectangle width (2x larger)
      .attr("height", 200) // rectangle height (2x larger
      .attr("fill", "#f86d6d")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("x", -400) // to center rectangle
      .attr("y", -100); // to center rectangle

    node
      .append("rect")
      .filter(
        (d) => d.type === "subject" && (subject == null || d.name !== subject)
      )
      .attr("width", 500) // rectangle width
      .attr("height", 200) // rectangle height
      .attr("fill", "#86e399")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("x", -250) // to center rectangle
      .attr("y", -100)
      .style("cursor", "pointer") // Change cursor to pointer for clickable rectangles
      .on("click", (event, d) => {
        navigate("/graph/" + d.name);
      })
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(50) 
          .attr("fill", "#ff9999")
          .attr("stroke", "#666");

        // Highlight connected links recursively
        highlightLinks(d);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(50)
          .attr("fill", "#86e399")
          .attr("stroke", "#fff");

        link.attr("stroke", "#999").attr("stroke-width", 15);
      });

    node
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("font-size", (d) =>
        subject == null ? "40" : d.name === subject ? "60px" : "40px"
      )
      .attr("fill", "#000")
      .style("pointer-events", "none")
      .text((d) => d.name);

    const text = svgGroup
      .selectAll("text.link-order")
      .data(linksToUse)
      .enter()
      .append("text")
      .attr("class", "link-order")
      .attr("font-size", "150px")
      .attr("fill", "red")
      .style("font-weight", "bold")
      .style("stroke", "black")
      .style("stroke-width", "3px")
      .style("pointer-events", "none");

    if (userLoggedIn) {
      const progressBar = svg
      .append("rect")
      .attr("width", 150) 
      .attr("height", 20)
      .attr("fill", "#ddd") 
      .attr("stroke", "#444")
      .attr("stroke-width", 1)
      .attr("rx", 10) 
      .attr("ry", 10) 
      .attr("x", width - 180)
      .attr("y", 20); 

    const progressBarIndicator = svg
      .append("rect")
      .attr("width", 0)
      .attr("height", 20)
      .attr("fill", "green") 
      .attr("stroke", "#444")
      .attr("stroke-width", 1)
      .attr("rx", 10) 
      .attr("ry", 10) 
      .attr("y", 20) 
      .attr("x", width - 180); 

    const updateProgressBar = (completionPercentage) => {
      const width = 150 * (completionPercentage / 100);
      progressBarIndicator.attr("width", width);
    };

    updateProgressBar((ourTopicCount / totalTopicCount) * 100);

    const completionText = svg
      .append("text")
      .attr("x", width - 180) 
      .attr("y", 60) 
      .attr("font-family", "Arial, sans-serif") 
      .attr("font-size", "16px")
      .attr("fill", "#333") 
      .attr("text-anchor", "start") 
      .text(ourTopicCount + " out of " + totalTopicCount + " complete");
    }



    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      text
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(0.20);
    svg.call(zoom.transform, initialTransform);

    const updateText = async () => {
      const promises = linksToUse.map((d) => getOrder(d));
      const orders = await Promise.all(promises);

      text.text((d, i) => orders[i]);
    };

    updateText();
    fetchData();
  }, [nodes, links, ourTopicCount, totalTopicCount, subject, userLoggedIn]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <svg ref={svgRef} width={width} height={height} style={style}></svg>;
};

const getTotalNodesForSubject = async (subject) => {
  const totalTopics = await getTopicsInSubject(subject);
  const totalMiniSubjects = await getMiniSubjectInSubject(subject);
  return totalTopics.length + totalMiniSubjects.length;
};

const getNodesCompleteForSubject = async (subject) => {
  const user = await getCurrentUserData();
  if (!user || !user.email) {
    // Handle case where user or user.email is null
    console.error("User data or user email is null.");
    return 0; // Return a default value or handle the error as needed
  }
  const subjectProgress = await getUserSubjectProgress(user.email);
  let progCount = 0;

  const totalTopics = await getTopicsInSubject(subject);
  const totalMiniSubjects = await getMiniSubjectInSubject(subject);

  totalTopics.forEach((topic) => {
    progCount = progCount + (subjectProgress[topic.name] ? 1 : 0);
  });

  await Promise.all(totalMiniSubjects.map(async (miniSubject) => {
    const miniSubjectNodeCount = await getTotalNodesForSubject(miniSubject.name);
    const ourMiniSubjectCount = await getNodesCompleteForSubject(miniSubject.name);
    progCount = progCount + ((miniSubjectNodeCount === ourMiniSubjectCount) ? 1 : 0);
  }));

  return progCount;
};

export default Graph;

