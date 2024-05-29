import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ nodes, links }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    // Define the zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4]) // Minimum and maximum zoom levels
      .on('zoom', (event) => {
        svgGroup.attr('transform', event.transform);
      });

    // Apply the zoom behavior to the SVG element
    svg.call(zoom);

    // Clear any previous content
    svg.selectAll("*").remove();

    // Create a group to hold all the elements (nodes and links)
    const svgGroup = svg.append('g');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.name).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svgGroup.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', 1.5);

    const node = svgGroup.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 5)
      .attr('fill', '#69b3a2');

    node.append('title')
      .text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

  }, [nodes, links]);

  return (
    <svg ref={svgRef} width={800} height={600} style={{ border: '1px solid black' }}></svg>
  );
};

export default Graph;
