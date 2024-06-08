import React from "react";

const SignupForm = ({ formData, handleChange, handleSubmit, submitButtonStyle }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        placeholder="Enter username"
        className="form-control"
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
    <div className="form-group">
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        className="form-control"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
    </div>
    <button type="submit" className="btn btn-success" style={submitButtonStyle}>
      Submit
    </button>
  </form>
);

export default SignupForm;
