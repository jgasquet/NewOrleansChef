const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// In-memory storage for demo (replace with database in production)
const reservations = [];

// Email transporter configuration
const transporter = nodemailer.createTransport({
    // Configure with your email service
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST create new reservation
router.post('/', async (req, res) => {
    const { 
        restaurantId, 
        restaurantName,
        name, 
        email, 
        phone, 
        date, 
        time, 
        partySize,
        specialRequests 
    } = req.body;
    
    // Validation
    if (!restaurantId || !name || !email || !phone || !date || !time || !partySize) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create reservation
    const reservation = {
        id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        restaurantId,
        restaurantName,
        name,
        email,
        phone,
        date,
        time,
        partySize,
        specialRequests: specialRequests || '',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    reservations.push(reservation);
    
    // Send confirmation email
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            cc: 'john@nthtrip.com',
            subject: `Reservation Request - ${restaurantName}`,
            html: `
                <h2>New Orleans Chef - Reservation Request</h2>
                <p>Dear ${name},</p>
                <p>We've received your reservation request:</p>
                <ul>
                    <li><strong>Restaurant:</strong> ${restaurantName}</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Party Size:</strong> ${partySize} guests</li>
                    <li><strong>Reservation ID:</strong> ${reservation.id}</li>
                </ul>
                ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
                <p>Our team will confirm your reservation within 24 hours.</p>
                <br>
                <p>Best regards,<br>The New Orleans Chef Team</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email error:', error);
        // Continue even if email fails
    }
    
    res.status(201).json({
        message: 'Reservation request received',
        reservation
    });
});

// GET reservation by ID
router.get('/:id', (req, res) => {
    const reservation = reservations.find(r => r.id === req.params.id);
    
    if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.json(reservation);
});

// GET all reservations (admin only - add auth in production)
router.get('/', (req, res) => {
    res.json({
        count: reservations.length,
        reservations
    });
});

// PUT update reservation status
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const reservation = reservations.find(r => r.id === id);
    
    if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
    }
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    
    reservation.status = status;
    reservation.updatedAt = new Date().toISOString();
    
    res.json({
        message: 'Reservation updated',
        reservation
    });
});

// DELETE cancel reservation
router.delete('/:id', (req, res) => {
    const index = reservations.findIndex(r => r.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Reservation not found' });
    }
    
    const [reservation] = reservations.splice(index, 1);
    reservation.status = 'cancelled';
    
    res.json({
        message: 'Reservation cancelled',
        reservation
    });
});

module.exports = router;
