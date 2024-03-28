import { useState } from 'react';
import './App.css';

function App() {
  // grab current messages based on cookie
  const currentMessages = localStorage.getItem('messages');

  // state variable
  const [messages, setMessages] = useState(
    !currentMessages ? [] : JSON.parse(currentMessages)
  );

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // access to the prompt input
    const { prompt } = e.target.elements;

    // grab current messages based on cookie
    const currentMessages = localStorage.getItem('messages');

    // define the input messages list based on previous cookie messages
    const messages = !currentMessages
      ? [
          {
            role: 'system',
            content:
              'You are a kids friendly assistant, your name is Larry, you must respond with excitement, feel free to use kind emojis from time to time',
          },
          { role: 'user', content: prompt.value },
        ]
      : [
          ...JSON.parse(currentMessages),
          { role: 'user', content: prompt.value },
        ];

    fetch('https://ai-techiesinplaya.onrender.com/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    })
      .then((res) => res.json())
      .then((data) => {
        // declare new messages list with received data
        const newMessages = [
          ...messages,
          { role: 'assistant', content: data.content },
        ];

        // update messages cookie value
        localStorage.setItem('messages', JSON.stringify(newMessages));

        setMessages(newMessages);

        prompt.value = '';
      });
  };

  // rendering jsx statement
  return (
    <div>
      <h1>Chat Completion Form</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor='prompt'>Enter your prompt:</label>
        <br />
        <input type='text' id='prompt' name='prompt' />
        <br />
        <br />
        <button type='submit'>Submit</button>
      </form>

      <ul id='messages-list' style={{ whiteSpace: 'pre-wrap' }}>
        {/* Dynamically rendering the messages list */}
        {messages.slice(1).map((msg) =>
          msg.role === 'user' ? (
            <li key={msg.content}>
              <b>{msg.content}</b>
            </li>
          ) : (
            <li key={msg.content}>
              <p>{msg.content}</p>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default App;
