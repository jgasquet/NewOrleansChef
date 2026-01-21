const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// In-memory storage for demo (replace with database in production)
const users = [];
const newsletterSubscribers = [];

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST newsletter signup
router.post('/newsletter', async (req, res) => {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
    }
    
    // Check if already subscribed
    if (newsletterSubscribers.some(sub => sub.email === email)) {
        return res.status(400).json({ error: 'Email already subscribed' });
    }
    
    const subscriber = {
        email,
        subscribedAt: new Date().toISOString(),
        status: 'active'
    };
    
    newsletterSubscribers.push(subscriber);
    
    // Send welcome email
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to New Orleans Chef!',
            html: `
                <h2>Welcome to New Orleans Chef!</h2>
                <p>Thank you for subscribing to our newsletter.</p>
                <p>Get ready for:</p>
                <ul>
                    <li>Weekly picks from our editors</li>
                    <li>Exclusive restaurant openings</li>
                    <li>First access to culinary events</li>
                    <li>Special offers and discounts</li>
                </ul>
                <p>Laissez les bons temps rouler!</p>
                <br>
                <p>The New Orleans Chef Team</p>
            `
        });
    } catch (error) {
        console.error('Email error:', error);
    }
    
    // Notify admin
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'john@nthtrip.com',
            subject: 'New Newsletter Subscriber - NewOrleansChef',
            text: `New subscriber: ${email}\nSubscribed at: ${subscriber.subscribedAt}`
        });
    } catch (error) {
        console.error('Admin notification error:', error);
    }
    
    res.json({
        message: 'Successfully subscribed to newsletter',
        subscriber
    });
});

// GET newsletter subscribers (admin only - add auth)
router.get('/newsletter', (req, res) => {
    res.json({
        count: newsletterSubscribers.length,
        subscribers: newsletterSubscribers
    });
});

// POST contact form
router.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields required' });
    }
    
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'john@nthtrip.com',
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });
        
        // Send confirmation to user
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'We received your message - New Orleans Chef',
            html: `
                <h2>Thank you for contacting New Orleans Chef!</h2>
                <p>Dear ${name},</p>
                <p>We've received your message and will respond within 24-48 hours.</p>
                <br>
                <p>Best regards,<br>The New Orleans Chef Team</p>
            `
        });
        
        res.json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// POST user registration (for future app features)
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }
    
    // Check if user exists
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered' });
    }
    
    const user = {
        id: `USER-${Date.now()}`,
        name,
        email,
        createdAt: new Date().toISOString()
        // In production: hash password with bcrypt
    };
    
    users.push(user);
    
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// POST user login (for future app features)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In production: verify password with bcrypt and create JWT token
    
    res.json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

module.exports = router;
