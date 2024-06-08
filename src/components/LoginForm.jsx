import React from "react";

const LoginForm = ({ formData, handleChange, handleSubmit, submitButtonStyle }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        className="form-control"
        placeholder="Enter username"
        value={formData.username}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        className="form-control"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
        required
      />
    </div>
    <button type="submit" className="btn btn-success" style={submitButtonStyle}>
      Submit
    </button>
  </form>
);

export default LoginForm;
