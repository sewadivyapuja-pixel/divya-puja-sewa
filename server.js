const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Mock Database
let usersDB = []; // { phone: "...", bookings: [...] }
let reviewsDB = [
    { name: "Anurag Mishra", rating: 5, comment: "Bohat hi shandar seva hai, man ko shanti mili!", date: "26 Aug 2026" }
]; // Default sample review

// Sign In / Sign Up
app.post('/api/auth', (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number required" });

    let user = usersDB.find(u => u.phone === phone);
    if (!user) {
        user = { phone, bookings: [] };
        usersDB.push(user);
    }
    res.json({ success: true, user });
});

// Save Booking
app.post('/api/book', (req, res) => {
    const { phone, serviceName } = req.body;
    let user = usersDB.find(u => u.phone === phone);
    if (!user) {
        user = { phone, bookings: [] };
        usersDB.push(user);
    }

    const newBooking = { 
        id: Date.now(), 
        serviceName, 
        date: new Date().toLocaleDateString(),
        hasReviewed: false 
    };
    user.bookings.push(newBooking);

    res.json({ success: true, bookings: user.bookings });
});

// Get User Bookings
app.get('/api/bookings/:phone', (req, res) => {
    const user = usersDB.find(u => u.phone === req.params.phone);
    if (!user) return res.json({ bookings: [] });
    res.json({ bookings: user.bookings });
});

// Add Review Route (Website par live dikhane ke liye)
app.post('/api/review', (req, res) => {
    const { phone, bookingId, rating, comment, userName } = req.body;
    
    // User dhoondo aur check karo ki booking par review de chuka hai ya nahi
    let user = usersDB.find(u => u.phone === phone);
    if(user) {
        let booking = user.bookings.find(b => b.id == bookingId);
        if(booking) booking.hasReviewed = true;
    }

    // Naya review global list mein daalo taaki sabko dikhe
    const newReview = {
        name: userName || "Shraddhalu " + phone.slice(-4),
        rating: Number(rating),
        comment,
        date: new Date().toLocaleDateString()
    };
    reviewsDB.unshift(newReview); // Naya review sabse upar dikhega

    res.json({ success: true, reviews: reviewsDB });
});

// Get All Public Reviews
app.get('/api/reviews', (req, res) => {
    res.json({ reviews: reviewsDB });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
