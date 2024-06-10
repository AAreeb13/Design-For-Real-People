import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUserData,
  getUserSubjectProgress,
} from "../../database/firebase";
import { getOrder } from "../../database/graphData";

const Graph = ({ nodes, links, subject = null, width, height, style }) => {
  const svgRef = useRef();
  const navigate = useNavigate();
  const [totalTopicCount, setTotalTopicCount] = useState(0);
  const [ourTopicCount, setOurTopicCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const validNodes =
    subject == null
      ? nodes
      : nodes.filter((n) => n.name === subject || n.subject === subject);

  const nodesToUse = validNodes.map((n) => {
    return { name: n.name, type: n.type };
  });

  let linksToUse = links.map((link) => {
    if (link.source == null) {
      return { source: link.source.source, target: link.source.target };
    }
    return { source: link.source, target: link.target };
  });

  const nodeNameList = nodesToUse.map((n) => n.name);
  linksToUse =
    subject == null
      ? linksToUse
      : linksToUse.filter((link) => {
          return (
            nodeNameList.includes(link.source) &&
            nodeNameList.includes(link.target)
          );
        });

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUserData();
      if (user) {
        setUserLoggedIn(true);
        const subjectProgress = await getUserSubjectProgress(user.email);
        const totalTopicsCount = getTotalNodesForSubject(subject, links, nodes);
        const ourTopicsCount = getNodesCompleteForSubject(
          subject,
          links,
          nodes,
          subjectProgress
        );
        setTotalTopicCount(totalTopicsCount);
        setOurTopicCount(ourTopicsCount);
        setLoading(false);
      } else {
        setUserLoggedIn(false);
        setLoading(false);
      }
    };

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
          : d3.forceManyBody().strength(-250000)
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
      .attr("fill", "#69b3a2") // Light green
      .attr("stroke", "#333") // Dark gray
      .attr("stroke-width", 2)
      .on("click", (event, d) => {
        navigate("/topic/" + d.name);
      })
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", "#508a7c"); // Dark green
        // Highlight connected links
          // Highlight connected links recursively
          highlightLinks(d);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", "#69b3a2"); // Light green
        // Reset all links
        link.attr("stroke", "#999").attr("stroke-width", 15);
      });

    node
      .append("rect")
      .filter((d) => d.type === "subject" && d.name === subject)
      .attr("width", 800) // rectangle width (2x larger)
      .attr("height", 200) // rectangle height (2x larger)
      .attr("fill", "#f86d6d") // Light red
      .attr("stroke", "#333") // Dark gray
      .attr("stroke-width", 2)
      .attr("x", -400) // to center rectangle
      .attr("y", -100); // to center rectangle

    node
      .append("rect")
      .filter(
        (d) => d.type === "subject" && (subject == null || d.name !== subject)
      )
      .attr("width", 500) // rectangle width
      .attr("height", 200) // rectangle height
      .attr("fill", "#86e399") // Light green
      .attr("stroke", "#333") // Dark gray
      .attr("stroke-width", 2)
      .attr("x", -250)
      .attr("y", -100)
      .style("cursor", "pointer") // Change cursor to pointer for clickable rectangles
      .on("click", (event, d) => {
        navigate("/graph/" + d.name);
      })
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(50)
          .attr("fill", "#ff9999"); // Light red
        // Highlight connected links recursively
        highlightLinks(d);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(50)
          .attr("fill", "#86e399"); // Light green
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
      .attr("fill", "#333") // Dark gray
      .style("pointer-events", "none")
      .text((d) => d.name);

    const text = svgGroup
      .selectAll("text.link-order")
      .data(linksToUse)
      .enter()
      .append("text")
      .attr("class", "link-order")
      .attr("font-size", "140px")
      .attr("fill", "#ff0000") // Red
      .style("font-weight", "bold")
      .style("stroke", "#000000") // Black
      .style("stroke-width", "2px")
      .style("pointer-events", "none");

    if (userLoggedIn) {
      const progressBar = svg
        .append("rect")
        .attr("width", 250)
        .attr("height", 20)
        .attr("fill", "#ddd") // Light gray
        .attr("stroke", "#333") // Dark gray
        .attr("stroke-width", 1)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("x", (width - 250) / 2)
        .attr("y", 10);

      const progressBarIndicator = svg
        .append("rect")
        .attr("width", 0)
        .attr("height", 20)
        .attr("fill", "#4caf50") // Green
        .attr("stroke", "#333") // Dark gray
        .attr("stroke-width", 1)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("x", (width - 250) / 2)
        .attr("y", 10);

      const updateProgressBar = (completionPercentage) => {
        const width = 150 * (completionPercentage / 100);
        progressBarIndicator.attr("width", width);
      };

      updateProgressBar((ourTopicCount / totalTopicCount) * 100);

      const completionText = svg
        .append("text")
        .attr("x", (width - 130) / 2)
        .attr("y", 50)
        .attr("font-family", "Arial, sans-serif")
        .attr("font-size", "16px")
        .attr("fill", "#333") // Dark gray
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
      .translate(width / 3, height / 3)
      .scale(0.3);
    svg.call(zoom.transform, initialTransform);

    const updateText = async () => {
      const promises = linksToUse.map((d) => getOrder(d));
      const orders = await Promise.all(promises);

      text.text((d, i) => orders[i]);
    };

    updateText();
    fetchData();
  }, [nodesToUse, linksToUse, ourTopicCount, totalTopicCount, subject]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{ width: "100%", height: "100%", minHeight: "590px", ...style }}
    ></svg>
  );
};

const getTotalNodesForSubject = (subject, links, nodes) => {
  const totalTopics = getTopicsFromSubject(subject, links, nodes);
  const totalMiniSubjects = getMiniSubjectFromSubject(subject, links, nodes);
  return totalTopics.length + totalMiniSubjects.length;
};

const getNodesCompleteForSubject = (subject, links, nodes, subjectProgress) => {
  let progCount = 0;

  const totalTopics = getTopicsFromSubject(subject, links, nodes);
  const totalMiniSubjects = getMiniSubjectFromSubject(subject, links, nodes);

  totalTopics.forEach((topic) => {
    progCount = progCount + (subjectProgress[topic.name] ? 1 : 0);
  });

  totalMiniSubjects.map((miniSubject) => {
    const miniSubjectNodeCount = getTotalNodesForSubject(
      miniSubject.name,
      links,
      nodes
    );
    const ourMiniSubjectCount = getNodesCompleteForSubject(
      miniSubject.name,
      links,
      nodes,
      subjectProgress
    );
    progCount =
      progCount + (miniSubjectNodeCount === ourMiniSubjectCount ? 1 : 0);
  });

  return progCount;
};

const getTopicsFromSubject = (subject, links, nodes) => {
  return nodes.filter(
    (node) => node.subject === subject && node.type === "topic"
  );
};

const getMiniSubjectFromSubject = (subject, links, nodes) => {
  return nodes.filter(
    (node) =>
      node.subject === subject &&
      node.type === "subject" &&
      !node.mainSubject
  );
};

export default Graph;
