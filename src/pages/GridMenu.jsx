import React, { useState, useEffect } from 'react';
import { getSubjects } from '../../database/graphData';

const RoadmapButtons = () => {
    const [subjects, setSubjects] = useState(null);
    const mathTopics = ['Calculus', 'Probability and Statistics', 'Analysis', 'Linear Algebra'];
    const languages = ['Python', 'Java', 'C', 'C++', 'Haskell'];
        
    const gridButton = {
        width: "20%",
        height: "70px",
        marginBottom: "10px",
        fontSize: "18px",
        fontWeight: "bold",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
        margin: "1% 5%"
    };

    const gridContainer = {
        maxWidth: "100%",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
    };

    const gridSection = {
        width: "100%",
        marginBottom: "30px",
    };

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjectsData = await getSubjects();
                setSubjects(subjectsData);
                console.log("Subject", subjectsData);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    if (!subjects) {
        return <div>Loading...</div>;
    }

    return (
        <div className="col" style={gridContainer}>
            <div style={gridSection}>
                <h2 style={{ marginBottom: "20px" }}>Mathematics</h2>
                {mathTopics.map((language, index) => (
                    <button key={index} className="btn btn-light btn-outline-success" style={gridButton}>{language}</button>
                ))}
            </div>

            <div style={gridSection}>
                <h2 style={{ marginBottom: "20px" }}>Programming</h2>
                {languages.map((profession, index) => (
                    <button key={index} className="btn btn-light btn-outline-success" style={gridButton}>{profession}</button>
                ))}
            </div>
        </div>
    );
}

export default RoadmapButtons;
