import React from "react";
import "../styles/FormOverlay.css";
import {
  addMainSubjectToGraph,
  addMiniSubjectToGraph,
  addTopicToGraph,
  mainSubjectExists,
  nodeExists,
  subjectExists,
} from "../../database/graphData";

const TopicAdderForm = ({
  formData,
  selectedType,
  handleChange,
  handleTypeChange,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="type">Type</label>
      <select
        id="type"
        name="type"
        className="form-control"
        value={selectedType}
        onChange={handleTypeChange}
      >
        <option value="">Select Type</option>
        <option value="main-subject">Main Subject</option>
        <option value="mini-subject">Mini Subject</option>
        <option value="topic">Topic</option>
      </select>
    </div>
    {selectedType && (
      <>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {selectedType === "topic" && (
          <>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                placeholder="Enter the subject that this topic will belong to"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="prerequisites">Prerequisites</label>
              <textarea
                className="form-control"
                id="prerequisites"
                name="prerequisites"
                placeholder="Enter prerequisites, separated by a ',' and ensure that it the prerequisite spelled correctly"
                value={formData.prerequisites}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </>
        )}

        {selectedType === "main-subject" && (
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <input
              type="text"
              className="form-control"
              id="theme"
              name="theme"
              placeholder="Enter the theme of this topic, for example 'mathematics'"
              value={formData.theme}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {selectedType === "mini-subject" && (
          <>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                placeholder="Enter the name of the subject this mini-subject belongs to"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="prerequisites">Prerequisites</label>
              <textarea
                className="form-control"
                id="prerequisites"
                name="prerequisites"
                placeholder="Enter prerequisites, separated by a ',' and ensure that it the prerequisite spelled correctly"
                value={formData.prerequisites}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </>
        )}
      </>
    )}
    <button type="submit" className="btn btn-success submit-button-style">
      Submit
    </button>
  </form>
);

export async function handleTopicAdderSubmit(formData, isValid) {
  if (formData.type === "main-subject") {
    isValid = await validateMainSubject(formData);
    if (isValid) {
      addMainSubjectToGraph(formData.name, formData.theme);
    } else {
      alert(
        "Please ensure all fields are filled, and that the subject doesn't currently exist"
      );
    }
  } else if (formData.type === "mini-subject") {
    isValid = await validateMiniSubject(formData);
    if (isValid) {
      addMiniSubjectToGraph(
        formData.name,
        formData.subject,
        formData.prerequisites
      );
    } else {
      alert(
        "Please ensure that all fields are filled, the name doesn't exist, the subject does exist and that the prerequisites are correctly spelled"
      );
    }
  } else if (formData.type === "topic") {
    isValid = await validateTopic(formData);
    if (isValid) {
      addTopicToGraph(formData.name, formData.subject, formData.prerequisites);
    } else {
      alert(
        "Please ensure that all fields are filled, the name doesn't exist, the subject does exist and that the prerequisites are correctly spelled"
      );
    }
  }
  return isValid;
}

const validateMainSubject = async (data) => {
  const nonEmpty = data.name.trim() !== "" && data.theme.trim() !== "";
  const subjectExists = await mainSubjectExists("Subject", data);
  return nonEmpty && !subjectExists;
};

const validateMiniSubject = async (data) => {
  const nonEmpty =
    data.name.trim() !== "" &&
    data.subject.trim() !== "" &&
    data.prerequisites.trim() !== "";
  const mainSubExst = await mainSubjectExists("Subject", data);
  const minSubExst = await subjectExists("Subject", data);

  const prerequisitesArray = data.prerequisites
    .split(",")
    .map((prereq) => prereq.trim());

  for (const prerequisite of prerequisitesArray) {
    const exists = await nodeExists("Subject", { name: prerequisite });
    if (!exists) return false;
  }

  return nonEmpty && mainSubExst && !minSubExst;
};

const validateTopic = async (data) => {
  const nonEmpty =
    data.name.trim() !== "" &&
    data.subject.trim() !== "" &&
    data.prerequisites.trim() !== "";
  const mainSubExst = await mainSubjectExists("Subject", data, false);
  const topicExst = await nodeExists("Subject", data);

  const prerequisitesArray = data.prerequisites
    .split(",")
    .map((prereq) => prereq.trim());
  for (const prerequisite of prerequisitesArray) {
    const exists = await nodeExists("Subject", { name: prerequisite });
    if (!exists) return false;
  }

  return nonEmpty && mainSubExst && !topicExst;
};

export default TopicAdderForm;
