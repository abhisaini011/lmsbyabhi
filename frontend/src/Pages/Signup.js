import React, { useState } from 'react';
import axios from 'axios';
import './Signin.css'; // Reuse styles from Signin

function Signup() {
    const [isStudent, setIsStudent] = useState(true);
    const [form, setForm] = useState({
        userType: 'Student',
        userFullName: '',
        admissionId: '',
        employeeId: '',
        age: '',
        dob: '',
        gender: '',
        address: '',
        mobileNumber: '',
        email: '',
        password: '',
        isAdmin: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSwitch = () => {
        setIsStudent(!isStudent);
        setForm({
            ...form,
            userType: isStudent ? 'Staff' : 'Student',
            admissionId: '',
            employeeId: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const payload = { ...form };
            if (isStudent) {
                payload.employeeId = '';
            } else {
                payload.admissionId = '';
            }
            // Ensure API_URL ends with a slash or add one
            const apiUrl = API_URL.endsWith('/') ? API_URL : API_URL + '/';
            const res = await axios.post(apiUrl + 'api/auth/register', payload);
            // Save user to localStorage and set cookie (for demo, use email as identifier)
            if (res.data && res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                document.cookie = `userEmail=${res.data.user.email}; path=/;`;
            }
            setSuccess('Registration successful! You can now sign in.');
            window.location.href = '/';
        } catch (err) {
            setError('Registration failed. Please check your details or try again.');
        }
    };

    return (
        <div className='signin-container'>
            <div className='signin-card'>
                <form onSubmit={handleSubmit}>
                    <h2 className='signin-title'>Sign Up</h2>
                    <p className='line'></p>
                    <div className='persontype-question'>
                        <p>Are you a Staff member?</p>
                        <input type='checkbox' checked={!isStudent} onChange={handleSwitch} />
                    </div>
                    {error && <div className='error-message'><p>{error}</p></div>}
                    {success && <div className='success-message'><p>{success}</p></div>}
                    <div className='signin-fields'>
                        <label htmlFor='userFullName'><b>Full Name</b></label>
                        <input className='signin-textbox' type='text' name='userFullName' required onChange={handleChange} />
                        {isStudent ? (
                            <>
                                <label htmlFor='admissionId'><b>Admission ID</b></label>
                                <input className='signin-textbox' type='text' name='admissionId' required onChange={handleChange} />
                            </>
                        ) : (
                            <>
                                <label htmlFor='employeeId'><b>Employee ID</b></label>
                                <input className='signin-textbox' type='text' name='employeeId' required onChange={handleChange} />
                            </>
                        )}
                        <label htmlFor='age'><b>Age</b></label>
                        <input className='signin-textbox' type='number' name='age' required onChange={handleChange} />
                        <label htmlFor='dob'><b>Date of Birth</b></label>
                        <input className='signin-textbox' type='date' name='dob' required onChange={handleChange} />
                        <label htmlFor='gender'><b>Gender</b></label>
                        <select className='signin-textbox' name='gender' required onChange={handleChange}>
                            <option value=''>Select</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                        </select>
                        <label htmlFor='address'><b>Address</b></label>
                        <input className='signin-textbox' type='text' name='address' required onChange={handleChange} />
                        <label htmlFor='mobileNumber'><b>Mobile Number</b></label>
                        <input className='signin-textbox' type='text' name='mobileNumber' required onChange={handleChange} />
                        <label htmlFor='email'><b>Email</b></label>
                        <input className='signin-textbox' type='email' name='email' required onChange={handleChange} />
                        <label htmlFor='password'><b>Password</b></label>
                        <input className='signin-textbox' type='password' name='password' minLength='6' required onChange={handleChange} />
                    </div>
                    <button className='signin-button'>Sign Up</button>
                </form>
                <div className='signup-option'>
                    <p className='signup-question'>Already have an account? <a href='/signin'>Sign In</a></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
