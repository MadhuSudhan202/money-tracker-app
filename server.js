const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Expense model
const Expense = mongoose.model('Expense', {
    category: String,
    amount: Number,
    date: Date
});

// Add Expense
app.post('/expenses', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).send(expense);
    } catch (error) {
        console.error('❌ Error adding expense:', error.message);
        res.status(400).send({ error: 'Failed to add expense' });
    }
});

// Delete Expense
app.delete('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).send({ error: 'Expense not found' });
        }
        res.send(expense);
    } catch (error) {
        console.error('❌ Error deleting expense:', error.message);
        res.status(500).send({ error: 'Failed to delete expense' });
    }
});

// Optional: Health Check
app.get('/', (req, res) => {
    res.send('✅ Money Tracker backend is running');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
