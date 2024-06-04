import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubjects } from '../../database/graphData';

const GridMenu = () => {
    const [subjects, setSubjects] = useState(null);
        
    const gridButton = {
        width: "calc(33.333% - 50px)",
        minWidth: "200px",
        height: "70px",
        marginBottom: "10px",
        fontSize: "18px",
        fontWeight: "bold",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
        margin: "1% 1%"
    };

    const gridContainer = {
        width: "1000px",
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

    console.log("subjects", subjects);

    const themes = [...new Set(subjects.map(subject => subject.theme))];
    console.log(themes);

    return (
        <div className="col" style={gridContainer}>
            {themes.map((theme) => (
                <div style={gridSection} key={theme}>
                    <h2 style={{ marginBottom: "20px" }}>{theme}</h2>
                    {subjects
                        .filter((subject) => subject.theme === theme)
                        .map((subject, index) => (
                            <Link to={`/graph/${subject.name}`} key={index}>
                                <button className="btn btn-light btn-outline-success" style={gridButton}>
                                    {subject.name}
                                </button>
                            </Link>
                        ))}
                </div>
            ))}
        </div>
    );
};

export default GridMenu;
