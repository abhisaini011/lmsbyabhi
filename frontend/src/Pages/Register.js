import React, { useState } from 'react';
import './Signin.css';
import axios from 'axios';
import Switch from '@material-ui/core/Switch';

function Register() {
    const [isStudent, setIsStudent] = useState(true);
    const [formData, setFormData] = useState({
        userFullName: '',
        admissionId: '',
        employeeId: '',
        age: '',
        gender: '',
        dob: '',
        address: '',
        mobileNumber: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            userType: isStudent ? "student" : "staff",
            admissionId: isStudent ? formData.admissionId : "",
            employeeId: !isStudent ? formData.employeeId : ""
        };

        try {
            const res = await axios.post(`${API_URL}api/auth/register`, payload);
            setSuccess("User registered successfully!");
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to register. Please check the inputs.");
            setSuccess("");
        }
    };

    return (
        <div className='signin-container'>
            <div className="signin-card">
                <form onSubmit={handleSubmit}>
                    <h2 className="signin-title"> Register</h2>
                    <p className="line"></p>

                    <div className="persontype-question">
                        <p>Are you a Staff member?</p>
                        <Switch onChange={() => setIsStudent(!isStudent)} color="primary" />
                    </div>

                    {error && <div className="error-message"><p>{error}</p></div>}
                    {success && <div className="success-message"><p>{success}</p></div>}

                    <div className="signin-fields">
                        <label><b>Full Name</b></label>
                        <input className='signin-textbox' type="text" name="userFullName" placeholder="Enter Full Name" required onChange={handleChange} />

                        {isStudent ? (
                            <>
                                <label><b>Admission ID</b></label>
                                <input className='signin-textbox' type="text" name="admissionId" placeholder="Enter Admission ID" required onChange={handleChange} />
                            </>
                        ) : (
                            <>
                                <label><b>Employee ID</b></label>
                                <input className='signin-textbox' type="text" name="employeeId" placeholder="Enter Employee ID" required onChange={handleChange} />
                            </>
                        )}

                        <label><b>Age</b></label>
                        <input className='signin-textbox' type="number" name="age" placeholder="Enter Age" onChange={handleChange} />

                        <label><b>Gender</b></label>
                        <input className='signin-textbox' type="text" name="gender" placeholder="Enter Gender" onChange={handleChange} />

                        <label><b>Date of Birth</b></label>
                        <input className='signin-textbox' type="date" name="dob" onChange={handleChange} />

                        <label><b>Address</b></label>
                        <input className='signin-textbox' type="text" name="address" placeholder="Enter Address" onChange={handleChange} />

                        <label><b>Mobile Number</b></label>
                        <input className='signin-textbox' type="number" name="mobileNumber" placeholder="Enter Mobile Number" required onChange={handleChange} />

                        <label><b>Email</b></label>
                        <input className='signin-textbox' type="email" name="email" placeholder="Enter Email" required onChange={handleChange} />

                        <label><b>Password</b></label>
                        <input className='signin-textbox' type="password" name="password" placeholder="Enter Password" required onChange={handleChange} />
                    </div>

                    <button className="signin-button">Register</button>
                </form>
                <div className='signup-option'>
                    <p className="signup-question">Already have an account? Contact Admin to log in.</p>
                </div>
            </div>
        </div>
    );
}

export default Register;
