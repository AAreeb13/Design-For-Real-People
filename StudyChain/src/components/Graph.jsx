import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ nodes, links }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        svgGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

    svg.selectAll("*").remove();

    const svgGroup = svg.append('g');

    const updateGraph = () => {
      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.name).distance(450))
        .force('charge', d3.forceManyBody().strength(-10000))
        .force('center', d3.forceCenter(width / 2, height / 5));

      const link = svgGroup.selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 20);

      const node = svgGroup.selectAll('.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node');

      node.append('ellipse')
        .attr('rx', 300)
        .attr('ry', 80)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);

      node.append('text')
        .attr('x', 0)
        .attr('y', 3)
        .attr('text-anchor', 'middle')
        .attr('font-size', '50px')
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
    };

    updateGraph(); // Initial graph update

    const intervalId = setInterval(updateGraph, 5000); // Update graph every 5 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, [nodes, links]);

  return (
    <svg ref={svgRef} width={1200} height={600} style={{ border: '1px solid black' }}></svg>
  );
};

export default Graph;
