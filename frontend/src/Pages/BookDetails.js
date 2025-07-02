import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import "./BookDetails.css";
import { AuthContext } from "../Context/AuthContext";

function BookDetails() {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const API_URL = ('http://localhost:5000/');

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registerMsg, setRegisterMsg] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(API_URL + "api/books/getbook/" + id);
        setBook(res.data);
      } catch (err) {
        setError("Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [API_URL, id]);

  const handleRegister = async () => {
    if (!user || !user._id) {
      setRegisterMsg("Please login to register this book.");
      return;
    }
    setRegisterMsg("Registering...");
    try {
      const res = await axios.post(API_URL + "api/books/register", { userId: user._id ,bookId: id });
      setRegisterMsg(res.data.message || "Book registered!");
      window.location.reload(); 
    } catch (err) {
      setRegisterMsg(err.response?.data?.message || "Registration failed");
    }
  };

  const handleUnregister = async () => {
    if (!user || !user._id) {
      setRegisterMsg("Please login to unregister this book.");
      return;
    }
    setRegisterMsg("Unregistering...");
    try {
      const res = await axios.post(API_URL + "api/books/unregister", { userId: user._id, bookId: id });
      setRegisterMsg(res.data.message || "Book unregistered!");
      // Optionally, refetch book details
      const updated = await axios.get(API_URL + "api/books/getbook/" + id);
      setBook(updated.data);
      window.location.reload(); 
    } catch (err) {
      setRegisterMsg(err.response?.data?.message || "Unregister failed");
    }
  };

  if (loading) return <div className="bookdetails-loading">Loading...</div>;
  if (error) return <div className="bookdetails-error">{error}</div>;
  if (!book) return <div className="bookdetails-error">Book not found.</div>;

  return (
    <div className="bookdetails-container">
      <div className="bookdetails-card">
        <img
          src={book.coverImage || "https://via.placeholder.com/150x220?text=No+Image"}
          alt={book.bookName}
          className="bookdetails-image"
        />
        <div className="bookdetails-info">
          <h2>{book.bookName}</h2>
          <p><b>Author:</b> {book.author}</p>
          <p><b>Publisher:</b> {book.publisher}</p>
          <p><b>Language:</b> {book.language}</p>
          <p><b>Available:</b> {book.bookCountAvailable}</p>
          <p><b>Status:</b> {book.bookStatus}</p>
          {/* <p><b>user:</b>{book.reserveuser}</p> */}
          {book.reserveuser && user && String(book.reserveuser) === String(user._id) ? (
            <button className="reserve-btn" onClick={handleUnregister}>
              Unregister Book
            </button>
          ) : (
            <button
              className="reserve-btn"
              onClick={handleRegister}
              disabled={book.bookCountAvailable < 1 || (book.reserveUser && String(book.reserveUser) !== String(user?._id))}
            >
              Register Book
            </button>
          )}
          {registerMsg && <div className="reserve-message">{registerMsg}</div>}
          <button className="back-btn" onClick={() => history.goBack()}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;