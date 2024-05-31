import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ nodes, links }) => {
  const svgRef = useRef();
  console.log("nodes", nodes);
  console.log("links", links);
  const width = 1200;
  const height = 800;

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

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.name.name).distance(300)) // distance = link length
      .force('charge', d3.forceManyBody().strength(-10000))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svgGroup.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', 15); // number = thickness of lines

    const node = svgGroup.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node');

    // Append shapes based on the type of the node
    node.append('ellipse')
      .filter(d => d.name.type === 'subject')
      .attr('rx', 150) // ellipse width
      .attr('ry', 50)  // ellipse height
      .attr('fill', '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    node.append('rect')
      .filter(d => d.name.type === 'topic')
      .attr('width', 150)  // square width
      .attr('height', 100) // square height
      .attr('fill', 'red')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('x', -50) // to center the square
      .attr('y', -50); // to center the square

    node.append('text')
      .attr('x', 0)
      .attr('y', 3)
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px') // Text size is px
      .attr('fill', '#000')
      .text(d => d.name.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2).scale(0.5);
    svg.call(zoom.transform, initialTransform);

  }, [nodes, links]);

  return (
    <svg ref={svgRef} width={width} height={height} style={{ border: '1px solid black' }}></svg>
  );
};

export default Graph;
