const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');
const Tesseract = require('tesseract.js');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve static Angular files
app.use(express.static(path.join(__dirname, '../dist/test')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// mongoDB connection
// MongoDB connection process.env.MONGODB_URL
mongoose.connect(process.env.MONGODB_URL , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Schema and model
const TestSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
      selectAnswer: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});
const Test = mongoose.model('Test', TestSchema);

const resultSchema = new mongoose.Schema({
  testId: String,
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
      selectAnswer: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});
const TestResult = mongoose.model('testResult', resultSchema);

// Routes
app.post('/createTests', async (req, res) => {
  console.log(req.body);
  try {
    const test = new Test(req.body);
    const savedTest = await test.save();
    res.status(201).json(savedTest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save test' });
  }
});

app.post('/submitTests', async (req, res) => {
  console.log(req.body);
  try {
    const result = new TestResult(req.body);
    const savedTest = await result.save();
    res.status(201).json(savedTest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save test' });
  }
});

app.post('/getTestDetailsBasedOnId', async (req, res) => {
  try {
    const test = await Test.findById(req.body.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching test', error: err.message });
  }
});

app.post('/getSubmittedTestDetailsBasedOnId', async (req, res) => {
  try {
    const result = await TestResult.findById(req.body.id);
    if (!result) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching test', error: err.message });
  }
});

// app.get('/getTest', async (req, res) => {
//   const tests = await Test.find();
//   res.json(tests);
// });

// Configure multer for file upload
const uploadImage = multer({ dest: 'uploads/' });

app.post('/upload-image', uploadImage.single('image'), async (req, res) => {
  console.log('upload-image called');
  const imagePath = req.file.path;

  try {
    console.log('Tesseract started');
    const result = await Tesseract.recognize(
      imagePath,
      'eng'
      
    );
    console.log('data extracted'); 
    const extractedText = result.data.text;
    console.log('extractedText ', extractedText);
    // Optionally delete uploaded file
    fs.unlinkSync(imagePath);

    //res.json({ text: extractedText });
     console.log('generateQuestions funcation call'); 
    const gptOutput = await generateQuestions(extractedText );
console.log('generateQuestions got response'); 
    // Try parsing GPT output as JSON
    let questions;
    try {
      questions = JSON.parse(gptOutput);
    } catch (e) {
      // If GPT output is not pure JSON, wrap it
      questions = [{ error: 'Failed to parse GPT response', raw: gptOutput }];
    }

    res.json({ questions });

  } catch (err) {
    res.status(500).json({ error: 'OCR failed', details: err });
  }
});


// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

// Helper to generate questions
async function generateQuestions(text) {
  const prompt = `From the following content, create Maximum multiple-choice questions (4 options each) and also Generate some true false choice question based on the text below Each question should have 2 options (a-b) and clearly indicate the correct answer. in JSON format:
  Content: ${text}
  Example JSON:
  [
    {
      "question": "What is ...?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "selectAnswer": ""
    }
  ]
  Return only valid JSON, no explanations or text outside the JSON
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }]
  });

  let gptOutput = response.choices[0].message.content.trim();
  console.log(response);
  // Remove code fences if GPT adds ```json ... ```
  gptOutput = gptOutput.replace(/```json|```/g, "");
  // console.log("with \n ", gptOutput);

  return gptOutput;
}

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: query }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

// Generate test from text
app.post('/generateTestFromTest', async (req, res) => {
  try {
     
    let text = req.body.content;;

    console.log("txt ", text);
    const gptOutput = await generateQuestions(text);

    // Try parsing GPT output as JSON
    let questions;
    try {
      questions = JSON.parse(gptOutput);
    } catch (e) {
      // If GPT output is not pure JSON, wrap it
      questions = [{ error: 'Failed to parse GPT response', raw: gptOutput }];
    }

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Upload and process file
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    let text = '';

    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else {
      text = fs.readFileSync(filePath, 'utf-8');
    }

    console.log("txt ", text);
    const gptOutput = await generateQuestions(text);

    // Try parsing GPT output as JSON
    let questions;
    try {
      questions = JSON.parse(gptOutput);
    } catch (e) {
      // If GPT output is not pure JSON, wrap it
      questions = [{ error: 'Failed to parse GPT response', raw: gptOutput }];
    }

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

async function sendPdfToFlask() {
  console.log("SendPdfToFlask")
  const filePath = path.join(__dirname, 'uploads/Kinematics.pdf'); // Your default PDF
  const formData = new FormData();

  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('http://127.0.0.1:5000/generate-mcqs', formData, {
      headers: formData.getHeaders(),
    });

    console.log('✅ MCQs Generated:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error sending PDF:', error.message);
  }
}

// sendPdfToFlask();

app.get('/callFromPython', async (req, res) => {
  console.log("SendPdfToFlask")
  const filePath = path.join(__dirname, 'uploads/Kinematics.pdf'); // Your default PDF
  const formData = new FormData();

  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('http://127.0.0.1:5000/generate-mcqs', formData, {
      headers: formData.getHeaders(),
    });

    console.log('✅ MCQs Generated: api');
    // console.log(JSON.stringify(response.data, null, 2));
    let questions;
    let getOutput = response.data.mcqs.replace(/```json|```/g, "");
    console.log(getOutput);
    questions = JSON.parse(getOutput);
    console.log(questions);
    res.json({ questions });
  } catch (error) {
    //console.error('❌ Error sending PDF:', error.message);
    res.status(500).json({ error: error.message });
  }
  
});

// Fallback for Angular routes
app.get(/^\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/test/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));