import { useState, useRef } from "react";
import * as d3 from 'd3';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';

const Graph = () => {
    dotenv.config
    const [graphData, setGraphData] = useState({nodes: [], relationships: []});
    
    setGraphData(getGraphData)

    const svgRef = useRef();
    d3Data(graphData, svgRef)
}

function d3Data(graphData, svgRef)  {
    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current);

    const simulation = d3.forceSimulation(graphData.nodes)
            .force('link', d3.forceLink(graphData.relationships).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .on('tick', ticked);

    const link = svg.append('g')
        .selectAll('line')
        .data(graphData.relationships)
        .enter().append('line')
        .attr('stroke', '#999')
        .attr('stroke-width', 2);

    const node = svg.append('g')
        .selectAll('circle')
        .data(graphData.nodes)
        .enter().append('circle')
        .attr('r', 10)
        .attr('fill', '#69b3a2')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    const label = svg.append('g')
        .selectAll('text')
        .data(graphData.nodes)
        .enter().append('text')
        .text(d => d.name)
        .attr('x', 6)
        .attr('y', 3);

    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        label
            .attr('x', d => d.x + 12)
            .attr('y', d => d.y + 3);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function getGraphData() {
    (async () => {
    // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
    const URI = process.env.NEO4J_URI
    const USER = process.env.NEO4J_USERNAME
    const PASSWORD = process.env.NEO4J_PASSWORD
    let driver

    try {
        driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
        const serverInfo = await driver.getServerInfo()
        console.log('Connection established')
        console.log(serverInfo)

        const { records, summary, keys } = await driver.executeQuery(
            'MATCH (n) - [r] -> (m) RETURN (n), (r), (m)'
        )

        // Summary information
        console.log(
            `>> The query ${summary.query.text} ` +
            `returned ${records.length} records ` +
            `in ${summary.resultAvailableAfter} ms.`
        )
        
        // Loop through results and do something with them
        console.log('>> Results')
        for(record of records) {
            console.log(record.get('name'))
        }

        return transformData(records)


    } catch(err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    }
    })()
    
}

function transformData(neo4jData) {
    const nodes = [];
    const relationships = [];

    neo4jData.forEach(record => {
        const node = record.get(0);
        const relationship = record.get(1);
        const targetNode = record.get(2);

        // Extract node data
        const sourceNode = {
            id: node.identity.low,
            name: node.properties.name,
            labels: node.labels
        };

        // Extract relationship data
        const relData = {
            id: relationship.identity.low,
            source: sourceNode.id,
            target: targetNode.identity.low,
            type: relationship.type
        };

        // Add nodes and relationships to arrays
        if (!nodes.find(n => n.id === sourceNode.id)) {
            nodes.push(sourceNode);
        }

        if (!nodes.find(n => n.id === targetNode.identity.low)) {
            nodes.push({
                id: targetNode.identity.low,
                name: targetNode.properties.name,
                labels: targetNode.labels
            });
        }

        relationships.push(relData);
    });

    return { nodes, relationships };
}



export default Graph;