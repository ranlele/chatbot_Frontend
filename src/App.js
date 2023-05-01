import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [chatRecords, setChatRecords] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchChatRecords();
  }, []);

  async function fetchChatRecords() {
    try {
      const response = await axios.get('http://localhost:8080/chat-records');
      setChatRecords(response.data);
    } catch (error) {
      console.error('Error fetching chat records:', error);
    }
  }

  async function handleAskQuestion(event) {
    event.preventDefault();
    if (!userQuestion.trim()) {
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/ask-question', {
        question: userQuestion,
      });
  
      const newChatRecord = response.data;
      setChatRecords([...chatRecords, newChatRecord]);
      setUserQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <h1>Chat Records</h1>
      <div className="chat-container">
        {chatRecords.map((chatRecord, index) => (
          <div key={index}>
            <p className="user-question">You: {chatRecord.question}</p>
            <p className="ai-answer">AI: {chatRecord.answer}</p>
          </div>
        ))}
      </div>
      <form className="question-form" onSubmit={handleAskQuestion}>
        <input
          className="question-input"
          type="text"
          value={userQuestion}
          onChange={(event) => setUserQuestion(event.target.value)}
          placeholder="Ask a question"
        />
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
    </div>
  );
  
}

export default App;
