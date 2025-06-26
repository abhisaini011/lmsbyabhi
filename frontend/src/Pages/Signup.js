import React, { useState } from 'react';
import axios from 'axios';
import './Signin.css'; // Reusing the theme-based styles

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

    const handleSwitch = (role) => {
        const isNowStudent = role === 'Student';
        setIsStudent(isNowStudent);
        setForm({
            ...form,
            userType: role,
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
            if (isStudent) payload.employeeId = '';
            else payload.admissionId = '';

            const apiUrl = API_URL.endsWith('/') ? API_URL : API_URL + '/';
            const res = await axios.post(apiUrl + 'api/auth/register', payload);

            if (res.data && res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                document.cookie = `userEmail=${res.data.user.email}; path=/;`;
            }
            setSuccess('Registration successful! You can now sign in.');
            window.location.href = '/signin';
        } catch (err) {
            setError('Registration failed. Please check your details or try again.');
        }
    };

    return (
        <div className='signin-container signup-container'>
            <div className='signin-card signup-card'>
                <form onSubmit={handleSubmit}>
                    <h2 className='signin-title'>Create your account</h2>

                    <div className='login-as-label metop'>Register as:</div>
                    <div className='role-toggle metop'>
                        <button
                            type="button"
                            className={`role-btn ${isStudent ? 'active' : ''}`}
                            onClick={() => handleSwitch('Student')}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${!isStudent ? 'active' : ''}`}
                            onClick={() => handleSwitch('Staff')}
                        >
                            Librarian
                        </button>
                    </div>

                    {error && <div className='error-message'><p>{error}</p></div>}
                    {success && <div className='success-message'><p>{success}</p></div>}

                    <div className='signin-fields'>
                        <input className='signin-textbox' type='text' name='userFullName' placeholder='Full Name' required onChange={handleChange} />

                        {isStudent ? (
                            <input className='signin-textbox' type='text' name='admissionId' placeholder='Admission ID' required onChange={handleChange} />
                        ) : (
                            <input className='signin-textbox' type='text' name='employeeId' placeholder='Employee ID' required onChange={handleChange} />
                        )}

                        <input className='signin-textbox' type='number' name='age' placeholder='Age' required onChange={handleChange} />
                        <input className='signin-textbox' type='date' name='dob' required onChange={handleChange} />

                        <select className='signin-textbox' name='gender' required onChange={handleChange}>
                            <option value=''>Select Gender</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                        </select>

                        <input className='signin-textbox' type='text' name='address' placeholder='Address' required onChange={handleChange} />
                        <input className='signin-textbox' type='text' name='mobileNumber' placeholder='Mobile Number' required onChange={handleChange} />
                        <input className='signin-textbox' type='email' name='email' placeholder='Email' required onChange={handleChange} />
                        <input className='signin-textbox' type='password' name='password' placeholder='Password' minLength='6' required onChange={handleChange} />
                    </div>

                    <button className='signin-button'>Sign Up</button>
                    <p className='signup-text'>Already have an account? <a href='/signin'>Sign In</a></p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
