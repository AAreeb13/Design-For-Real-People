import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ nodes, links, subject }) => {
  const svgRef = useRef();
  const width = 1000;
  const height = 800;

  const validNodes = nodes.filter((n) => n.name === subject || n.subject === subject)
  const nodesToUse = validNodes.map((n) => {return {name: n.name, type: n.type}})

  const nodeNameList = nodesToUse.map(n => n.name)
  const linksToUse = links
    .filter((link) => {return nodeNameList.includes(link.source) && nodeNameList.includes(link.target)})
  console.log("nodes: ", nodesToUse)
  console.log("links: ", linksToUse)

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4]) // Minimum and maximum zoom levels
      .on('zoom', (event) => {
        svgGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

    svg.selectAll("*").remove();

    const svgGroup = svg.append('g');
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 30) // Increase this value to move the arrowhead closer to the end of the line
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    const simulation = d3.forceSimulation(nodesToUse)
      .force('link', d3.forceLink(linksToUse).id(d => d.name).distance(300)) // distance = link length
      .force('charge', d3.forceManyBody().strength(-10000))
      .force('center', d3.forceCenter(width / 30, height / 30));

    const link = svgGroup.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(linksToUse)
      .enter().append('line')
      .attr('stroke-width', 15) // number = thickness of lines
      .attr('marker-end', 'url(#arrowhead)');
      
    const node = svgGroup.append('g')
      .selectAll('g')
      .data(nodesToUse)
      .enter().append('g')
      .attr('class', 'node');

    node.append('ellipse')
      .filter(d => d.type === 'topic')
      .attr('rx', 150) // ellipse width
      .attr('ry', 50)  // ellipse height
      .attr('fill', '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    node.append('rect')
      .filter(d => d.type === 'subject')
      .attr('width', 300)  // rectangle width
      .attr('height', 100) // rectangle height
      .attr('fill', '#f86d6d')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('x', -150) // to center the rectangle
      .attr('y', -50); // to center the rectangle

    node.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '.35em') // Adjust the vertical alignment
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px') // Text size in px
      .attr('fill', '#000')
      .text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    const initialTransform = d3.zoomIdentity.translate(width / 3, height / 3).scale(0.4);
    svg.call(zoom.transform, initialTransform);

  }, [nodesToUse, linksToUse]);

  return (
    <svg
      ref={svgRef}
      width={800}
      height={600}
      style={{
        marginLeft: '30%',
        border: '1px solid black',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        borderRadius: '10px'
      }}
    ></svg>
  );
};

export default Graph;
