const express = require('express');
const cors = require('cors');

const app = express();

// Configurar CORS para permitir el frontend
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Datos de ejemplo
const articles = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: 'React is a popular JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage application state efficiently.',
    topic: 'React',
    createdAt: new Date().toISOString(),
    author: 'AI Writer'
  },
  {
    id: '2',
    title: 'Node.js Best Practices',
    content: 'Node.js allows you to build scalable network applications. Here are some best practices to follow: use async/await, handle errors properly, and implement logging.',
    topic: 'Node.js',
    createdAt: new Date().toISOString(),
    author: 'AI Writer'
  },
  {
    id: '3',
    title: 'Docker for Developers',
    content: 'Docker containers package up code and all its dependencies so the application runs quickly and reliably from one computing environment to another.',
    topic: 'Docker',
    createdAt: new Date().toISOString(),
    author: 'AI Writer'
  }
];

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Blog API is running',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/articles', '/api/articles/:id']
  });
});

// Obtener todos los artículos
app.get('/api/articles', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/articles`);
  res.json(articles);
});

// Obtener un artículo por ID
app.get('/api/articles/:id', (req, res) => {
  const article = articles.find(a => a.id === req.params.id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: 'Article not found' });
  }
});

// Ruta para crear nuevo artículo (para testing)
app.post('/api/articles', (req, res) => {
  const newArticle = {
    id: Date.now().toString(),
    title: req.body.title || 'New Article',
    content: req.body.content || 'Content here',
    topic: req.body.topic || 'General',
    createdAt: new Date().toISOString(),
    author: req.body.author || 'AI Writer'
  };
  
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Articles API: http://localhost:${PORT}/api/articles`);
  console.log(`🔧 CORS enabled for: http://localhost:5174`);
});