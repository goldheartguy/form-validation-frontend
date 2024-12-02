import React, { useState } from 'react';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    department: '',
    dateOfJoining: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.employeeId || formData.employeeId.length > 10) newErrors.employeeId = 'Valid Employee ID is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required.';
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Valid phone number is required.';
    if (!formData.department) newErrors.department = 'Department is required.';
    if (!formData.dateOfJoining || new Date(formData.dateOfJoining) > new Date()) newErrors.dateOfJoining = 'Date of joining must not be in the future.';
    if (!formData.role) newErrors.role = 'Role is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('http://localhost:8080/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Employee added successfully.');
        setFormData({
          name: '',
          employeeId: '',
          email: '',
          phoneNumber: '',
          department: '',
          dateOfJoining: '',
          role: '',
        });
      } else {
        const error = await response.text();
        setMessage(error);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      employeeId: '',
      email: '',
      phoneNumber: '',
      department: '',
      dateOfJoining: '',
      role: '',
    });
    setErrors({});
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8">
      <h1 className="text-center font-bold text-4xl mb-8 text-gray-800">Add Employee</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded shadow-md">
        {[
          { label: 'Name', name: 'name', type: 'text', error: errors.name },
          { label: 'Employee ID', name: 'employeeId', type: 'text', error: errors.employeeId },
          { label: 'Email', name: 'email', type: 'email', error: errors.email },
          { label: 'Phone Number', name: 'phoneNumber', type: 'text', error: errors.phoneNumber },
          { label: 'Date of Joining', name: 'dateOfJoining', type: 'date', error: errors.dateOfJoining },
          { label: 'Role', name: 'role', type: 'text', error: errors.role },
        ].map(({ label, name, type, error }, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 mb-1">{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Department:</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          >
            <option value="">Select</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>
          {errors.department && <span className="text-red-500 text-sm">{errors.department}</span>}
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
