import React from "react";

const SignupForm = ({ formData, handleChange, handleSubmit, submitButtonStyle }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        className="form-control"
        value={formData.email}
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
        placeholder="Confirm password"
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
