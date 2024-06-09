import React from "react";

const TopicAdderForm = ({ formData, selectedType, handleChange, handleTypeChange, handleSubmit, submitButtonStyle }) => (
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
    <button type="submit" className="btn btn-success" style={submitButtonStyle}>
      Submit
    </button>
  </form>
);

export default TopicAdderForm;

