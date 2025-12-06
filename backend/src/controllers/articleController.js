// backend/src/controllers/articleController.js
const database = require('../database');  // Reemplaza articleModel

const articleController = {
  // Obtener todos los artículos
  async getAllArticles(req, res) {
    try {
      const articles = await database.getAllArticles();
      res.json({
        success: true,
        count: articles.length,
        data: articles
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch articles' 
      });
    }
  },

  // Obtener un artículo por ID
  async getArticleById(req, res) {
    try {
      const { id } = req.params;
      const article = await database.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ 
          success: false,
          error: 'Article not found' 
        });
      }
      
      res.json({
        success: true,
        data: article
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch article' 
      });
    }
  },

  // Crear un nuevo artículo
  async createArticle(req, res) {
    try {
      const { title, content, excerpt } = req.body;
      
      // Validación básica
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          error: 'Title and content are required'
        });
      }
      
      const articleId = await database.createArticle({
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...'
      });
      
      // Obtener el artículo recién creado
      const newArticle = await database.getArticleById(articleId);
      
      res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: newArticle
      });
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to create article' 
      });
    }
  }
};

module.exports = articleController;