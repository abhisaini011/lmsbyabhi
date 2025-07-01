import express from "express"
import Book from "../models/Book.js"
import BookCategory from "../models/BookCategory.js"
import User from "../models/User.js";
import BookTransaction from "../models/BookTransaction.js";

const router = express.Router()

/* Get all books in the db */
router.get("/allbooks", async (req, res) => {
    try {
        const books = await Book.find({}).populate("transactions").sort({ _id: -1 })
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err);
    }
})

/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        res.status(200).json(book)
    }
    catch (err) {
        return res.status(500).json(err)
    }
})

/* Get books by category name*/
router.get("/", async (req, res) => {
    const category = req.query.category
    try {
        const books = await BookCategory.findOne({ categoryName: category }).populate("books")
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

/* Adding book */
router.post("/addbook", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const newbook = await new Book({
                bookName: req.body.bookName,
                alternateTitle: req.body.alternateTitle,
                author: req.body.author,
                bookCountAvailable: req.body.bookCountAvailable,
                language: req.body.language,
                publisher: req.body.publisher,
                bookStatus: req.body.bookSatus,
                categories: req.body.categories
            })
            const book = await newbook.save()
            await BookCategory.updateMany({ '_id': book.categories }, { $push: { books: book._id } });
            res.status(200).json(book)
        }
        catch (err) {
            res.status(504).json(err)
        }
    }
    else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

/* Addding book */
router.put("/updatebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            await Book.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Book details updated successfully");
        }
        catch (err) {
            res.status(504).json(err);
        }
    }
    else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

/* Remove book  */
router.delete("/removebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const _id = req.params.id
            const book = await Book.findOne({ _id })
            await book.remove()
            await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
            res.status(200).json("Book has been deleted");
        } catch (err) {
            return res.status(504).json(err);
        }
    } else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

// Register (reserve) a book for a user
router.post("/register", async (req, res) => {
    try {
        const {userId} = req.body;
        const {bookId} = req.body;
          const book = await Book.findById(bookId)
        if (!book) return res.status(404).json({ message:bookId +" book not found" });
        if (book.bookCountAvailable < 1) {
            return res.status(400).json({ message: "Book not available" });
        }

        // Create a new transaction
        const transaction = new BookTransaction({
            user: userId,
            book: book._id,
            bookName: book.bookName,
            transactionType: "Issued",
            fromDate: new Date(),
            toDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });
        await transaction.save();
        book.reserveuser = userId;
        // Update book and user
        book.transactions.push(transaction._id);
        book.bookCountAvailable -= 1;
        book.bookStatus = "Issued"; // Update book status to Issued
        await book.save();

        await User.findByIdAndUpdate(userId, {
            $push: { activeTransactions: transaction._id,reservedBooks: book._id}
        });
        // console.log(`Transaction ${transaction._id} added to user ${userId}'s activeTransactions. ${book._id} added to reservedBooks.`);

        res.status(200).json({ message: "Book registered successfully", transaction });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// Unregister (cancel reservation) a book for a user
router.post("/unregister", async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (!book.reserveuser || book.reserveuser.toString() !== userId) {
            return res.status(403).json({ message: "You have not reserved this book." });
        }

        // Remove reservation
        book.reserveuser = null;
        book.bookCountAvailable += 1;
        book.bookStatus = "Available";
        await book.save();

        // Optionally, remove transaction from user.activeTransactions
        await User.findByIdAndUpdate(userId, {
            $pull: { activeTransactions: { book: bookId } }
        });
        await User.findByIdAndUpdate(userId, {
            $pull: { reservedBooks: bookId }
        });

        res.status(200).json({ message: "Book unregistered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Unregister failed", error: err.message });
    }
});

export default router