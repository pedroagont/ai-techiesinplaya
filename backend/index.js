// we use dotenv to hide API_KEY credentials
require('dotenv').config({ path: '.env.development' });

// express requirements and setup
const express = require('express');
const app = express();
const port = 8080;

// open ai requirements and setup
const OpenAI = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Middleware
app.use(
  require('cors')({
    origin: '*',
  })
);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(require('morgan')('dev'));

// homepage route
app.get('/', (req, res) => {
  res.render('index');
});

// images route
app.get('/images', (req, res) => {
  res.render('images');
});

// homepage jquery route
app.get('/jquery', (req, res) => {
  res.render('index-jquery');
});

// API prompt endpoint
app.post('/api/messages', async (req, res) => {
  try {
    // declare and validate messages input
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).send('Please provide a messages input');
    }

    // Call OpenAI API to complete the chat
    const completion = await openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo',
    });

    // Send the completed chat response
    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error completing chat:', error);
    res.status(500).json({ error: 'An error occurred while completing chat' });
  }
});

// API images endpoint
app.post('/api/images', async (req, res) => {
  try {
    // declare and validate prompt input
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).send('Please provide a prompt input');
    }

    // Call OpenAI API to generate image
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });
    const image = response.data[0];

    // Send the completed chat response
    res.json({ image });
  } catch (error) {
    console.error('Error completing chat:', error);
    res.status(500).json({ error: 'An error occurred while completing chat' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
