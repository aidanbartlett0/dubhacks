// components/Home.js
import React, { useState } from 'react';

const Home = () => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    setSummary(data.summary);
  };

  return (
    <div>
      <h1>UW Website Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a UW website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Summarize</button>
      </form>
      {summary && <div><h3>Summary:</h3><p>{summary}</p></div>}
    </div>
  );
};
