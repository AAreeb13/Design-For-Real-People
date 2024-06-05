import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";

const Graph = ({ nodes, links, subject, width, height, style }) => {
  const svgRef = useRef();
  const navigate = useNavigate();

  const validNodes = nodes.filter(
    (n) => n.name === subject || n.subject === subject
  );
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
  linksToUse = linksToUse.filter((link) => {
    return (
      nodeNameList.includes(link.source) && nodeNameList.includes(link.target)
    );
  });

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4]) // Minimum and maximum zoom levels
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
          .distance(900)
      ) // distance = link length
      .force("charge", d3.forceManyBody().strength(-50000))
      .force("center", d3.forceCenter(width / 30, height / 30));

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

    node
      .append("ellipse")
      .filter((d) => d.type === "topic")
      .attr("rx", 300) // ellipse width
      .attr("ry", 100) // ellipse height
      .attr("fill", "#69b3a2")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("click", (event, d) => {
          navigate('/topic/' + d.name);
      })

    node
      .append("rect")
      .filter((d) => d.type === "subject" && d.name === subject)
      .attr("width", 800) // rectangle width (2x larger)
      .attr("height", 200) // rectangle height (2x larger)
      .attr("fill", "#f86d6d")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("x", -400) // to center rectangle
      .attr("y", -100); // to center rectangle

      node
      .append("rect")
      .filter((d) => d.type === "subject" && d.name !== subject)
      .attr("width", 500) // rectangle width
      .attr("height", 200) // rectangle height
      .attr("fill", "#86e399")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("x", -250) // to center rectangle
      .attr("y", -100)
      .style("cursor", "pointer") // Change cursor to pointer for clickable rectangles
      .on("click", (event, d) => {
        navigate('/graph/'+d.name);
      })
      .on("mouseover", function() {
        d3.select(this)
          .transition() 
          .duration(200) 
          .attr("fill", "#ff9999") 
          .attr("stroke", "#666"); 
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition() 
          .duration(200) 
          .attr("fill", "#86e399") 
          .attr("stroke", "#fff"); 
      });
    
      node
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("font-size", (d) => (d.name === subject ? "60px" : "40px"))
      .attr("fill", "#000")
      .style("pointer-events", "none")
      .text((d) => d.name);
    

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(0.25);
    svg.call(zoom.transform, initialTransform);
  }, [nodesToUse, linksToUse]);

  return <svg ref={svgRef} width={width} height={height} style={style}></svg>;
};

export default Graph;
