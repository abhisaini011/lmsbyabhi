import React, { useContext, useEffect, useState } from "react";
import "./MemberDashboard.css";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";

function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/?$/, '/');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !user._id) {
      window.location.href = '/signin';
      return;
    }
    const fetchUserDetails = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const response = await axios.get(
          API_URL + "api/users/getuser/" + user._id
        );
        if (!response.data || Object.keys(response.data).length === 0) {
          setFetchError("User not found.");
          setUserDetails(null);
        } else {
          setUserDetails(response.data);
        }
      } catch (err) {
        setFetchError("User not found or error fetching user info.");
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [API_URL, user]);

  if (loading) {
    return <div className="loading-message">Loading user info...</div>;
  }
  if (fetchError) {
    return <div className="error-message">{fetchError}</div>;
  }
  if (!userDetails) {
    return null;
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <img
          className="user-profileimage"
          src="./assets/images/Profile.png"
          alt="Profile"
        />
        <div className="user-info">
          <h2 className="user-name">{userDetails.userFullName}</h2>
          <p className="user-id">
            {userDetails.userType === "Student"
              ? userDetails.admissionId
              : userDetails.employeeId}
          </p>
          <p className="user-email">{userDetails.email}</p>
          <p className="user-phone">{userDetails.mobileNumber}</p>
          <p className="user-age"><b>Age:</b> {userDetails.age}</p>
          <p className="user-gender"><b>Gender:</b> {userDetails.gender}</p>
          <p className="user-dob"><b>DOB:</b> {userDetails.dob}</p>
          <p className="user-address"><b>Address:</b> {userDetails.address}</p>
          <p className="user-points"><b>Points:</b> {userDetails.points}</p>
        </div>
      </div>

      {/* Active Transactions Section */}
      <div className="user-active-transactions-section">
        <h3>Active Transactions (Books Issued)</h3>
        {userDetails.activeTransactions && userDetails.activeTransactions.length > 0 ? (
          <ul className="active-transactions-list">
            {userDetails.activeTransactions.map((transaction, idx) => (
              <li key={transaction._id || idx} className="active-transaction-item">
                <span>{transaction.bookName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-active-transactions">No active transactions.</div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
