import React, { useContext, useState } from 'react';
import './Signin.css';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext.js';
// import { FaLock } from 'react-icons/fa';F

function Signin() {
    const [isStudent, setIsStudent] = useState(true);
    const [admissionId, setAdmissionId] = useState();
    const [employeeId, setEmployeeId] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');
    const { dispatch } = useContext(AuthContext);

    // Ensure API_URL is defined and ends with a slash
    const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/').replace(/\/?$/, '/');

    const loginCall = async (userCredential, dispatch) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            // Ensure the URL is constructed correctly
            const res = await axios.post(API_URL + 'api/auth/signin', userCredential);
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            if (res.data && res.data.email) {
                localStorage.setItem('user', JSON.stringify(res.data));
                document.cookie = `userEmail=${res.data.email}; path=/;`;
                // Redirect based on userType
                if (res.data.userType === 'Student') {
                    window.location.href = '/memberdashboard';
                } else {
                    window.location.href = '/admindashboard';
                }
            }
        } catch (err) {
            dispatch({ type: 'LOGIN_FAILURE', payload: err });
            setError('Wrong Password Or Username');
        }
    };

    const handleForm = (e) => {
        e.preventDefault();
        isStudent
            ? loginCall({ admissionId, password }, dispatch)
            : loginCall({ employeeId, password }, dispatch);
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <form onSubmit={handleForm}>
                    <h2 className="signin-title">Sign in to your account</h2>

                    <div className="signin-fields">
                        <input
                            className="signin-textbox"
                            type="text"
                            placeholder="ID"
                            onChange={(e) => {
                                isStudent
                                    ? setAdmissionId(e.target.value)
                                    : setEmployeeId(e.target.value);
                            }}
                            required
                        />
                        <input
                            className="signin-textbox"
                            type="password"
                            placeholder="Password"
                            minLength="6"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="signin-options">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="forgot-password">
                            Forgot your password?
                        </a>
                    </div>

                    <div className="login-as-label">Login as:</div>
                    <div className="role-toggle">
                        <button
                            type="button"
                            className={`role-btn ${isStudent ? 'active' : ''}`}
                            onClick={() => setIsStudent(true)}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${!isStudent ? 'active' : ''}`}
                            onClick={() => setIsStudent(false)}
                        >
                            Librarian
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="signin-button">
                        {/* <FaLock className="lock-icon" />
                         */}
                        <i className="fas fa-lock"></i>
                        {/* {'F'} */}
                        <span className="button-text">Sign in</span>
                        {/* Sign in */}
                    </button>

                    <p className="signup-text">
                        Or <a href="/signup">create an account</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signin;
