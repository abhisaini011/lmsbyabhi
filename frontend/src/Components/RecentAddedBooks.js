import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecentAddedBooks.css';

function RecentAddedBooks() {
    const [recentBooks, setRecentBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/').replace(/\/?$/, '/');

    useEffect(() => {
        const fetchRecentBooks = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(API_URL + 'api/books/allbooks');
                // Show the most recent 9 books
                setRecentBooks(res.data.slice(0, 9));
            } catch (err) {
                setError("Failed to fetch recent books");
            } finally {
                setLoading(false);
            }
        };
        fetchRecentBooks();
    }, [API_URL]);

    return (
        <div className='recentaddedbooks-container'>
            <h2 className='recentbooks-title'>Recent Uploads</h2>
            <div className='recentbooks'>
                <div className='images'>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className='error-message'>{error}</div>
                    ) : recentBooks.length === 0 ? (
                        <div>No recent books found.</div>
                    ) : (
                        recentBooks.map((book, idx) => (
                            <img
                                className='recent-book'
                                key={book._id || idx}
                                src={book.coverImage || 'https://via.placeholder.com/120x180?text=No+Image'}
                                alt={book.bookName}
                                title={book.bookName}
                            />
                        ))
                    )}
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className='error-message'>{error}</div>
                    ) : recentBooks.length === 0 ? (
                        <div>No recent books found.</div>
                    ) : (
                        recentBooks.map((book, idx) => (
                            <img
                                className='recent-book'
                                key={book._id || idx}
                                src={book.coverImage || 'https://via.placeholder.com/120x180?text=No+Image'}
                                alt={book.bookName}
                                title={book.bookName}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecentAddedBooks;