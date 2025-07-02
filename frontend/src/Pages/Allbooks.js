import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Allbooks.css";
// import { AuthContext } from "../Context/AuthContext";
import { useHistory } from "react-router-dom";

function Allbooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/').replace(/\/?$/, '/');
  // const { user } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(API_URL + "api/books/allbooks");
        setBooks(res.data);
      } catch (err) {
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [API_URL]);

  return (
    <div className="books-page">
      <div className="books">
        {loading ? (
          <div>Loading books...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : books.length === 0 ? (
          <div>No books found.</div>
        ) : (
          books.map((book, idx) => (
            <div
              className="book-card"
              key={book._id || idx}
              onClick={() => history.push(`/book/${book._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={book.coverImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp16xiXu1ZtTzbLy-eSwEK4Ng6cUpUZnuGbQ&usqp=CAU"}
                alt={book.bookName}
              />
              <p className="bookcard-title">{book.bookName}</p>
              <p className="bookcard-author">By {book.author}</p>
              <p className="book-count">Available book {book.bookCountAvailable}</p>
              <div className="bookcard-category">
                <p>{book.categories && book.categories.length > 0 ? book.categories.join(", ") : "No Category"}</p>
              </div>
              <div className="bookcard-emptybox"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Allbooks;
