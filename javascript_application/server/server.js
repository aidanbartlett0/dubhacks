// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://aidanb04:dubhackshacker@dubhacks.qxk8w.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Create Schema and Model
const SummarySchema = new mongoose.Schema({
  url: String,
  summary: String,
});
const Summary = mongoose.model('Summary', SummarySchema);

// POST route for summarizing a website
app.post('/api/summarize', async (req, res) => {
  const { url } = req.body;
  // Check if the summary already exists in MongoDB
  const existingSummary = await Summary.findOne({ url });
  if (existingSummary) {
    return res.json({ summary: existingSummary.summary });
  }

  // Simulate a summarization process (you'll integrate Perplexity AI here)
  const summary = `Summary for ${url}`; // Replace this with actual summarization logic

  // Save the new summary to MongoDB
  const newSummary = new Summary({ url, summary });
  await newSummary.save();

  res.json({ summary });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
