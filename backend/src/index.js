require('dotenv').config();
const express = require('express');
const cors = require('cors');
const articleController = require('./controllers/articleController');
const articleScheduler = require('./services/articleJob');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Blog API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Rutas de artículos
app.get('/api/articles', articleController.getAllArticles);
app.get('/api/articles/:id', articleController.getArticleById);
app.post('/api/articles', articleController.createArticle);

// Endpoint para testing - generar artículo manualmente
app.post('/api/articles/generate', async (req, res) => {
  try {
    const { topic } = req.body || {};
    const topics = [
      'Artificial Intelligence', 'Machine Learning', 'Web Development',
      'DevOps', 'Cloud Computing', 'JavaScript', 'Python'
    ];
    const randomTopic = topic || topics[Math.floor(Math.random() * topics.length)];
    
    await articleScheduler.generateArticle(randomTopic);
    res.json({ 
      message: 'Article generated successfully',
      topic: randomTopic
    });
  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({ error: 'Failed to generate article' });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`📚 Articles: http://localhost:${PORT}/api/articles`);
  
  // Iniciar scheduler
  try {
    await articleScheduler.init();
    console.log('⏰ Article scheduler initialized');
  } catch (error) {
    console.error('❌ Error initializing scheduler:', error);
  }
});