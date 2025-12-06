// backend/src/services/articleJob.js
const cron = require('node-cron');
const articleModel = require('../models/articleModel');

// Importar nuestro aiService.js desde el directorio principal
let aiService;

try {
  // Intenta cargar el aiService.js que ya creaste
  aiService = require('../aiService');
  console.log('✅ Loaded AI service from aiService.js');
} catch (error) {
  // Si no existe, crea un servicio mock simple
  console.log('⚠️ Creating simple mock AI service');
  aiService = {
    async generateArticle(topic) {
      console.log(`🤖 [MOCK] Generating article for: ${topic}`);
      
      // Artículos mock para desarrollo
      const mockArticles = {
        'Artificial Intelligence': {
          title: 'The Future of Artificial Intelligence',
          content: `Artificial Intelligence is transforming industries worldwide. This article explores AI's impact on healthcare, finance, and daily life.

          ## Key Points:
          1. Machine Learning advancements
          2. Natural Language Processing
          3. Computer Vision applications
          4. Ethical considerations

          AI will continue to evolve and integrate into every aspect of our lives.`,
          excerpt: 'Exploring AI advancements and future possibilities',
          topic: 'AI',
          author: 'AI Writer'
        },
        'Web Development': {
          title: 'Modern Web Development in 2024',
          content: `Web development continues to evolve rapidly with new frameworks and tools.

          ## Current Trends:
          1. React and Next.js popularity
          2. Serverless architectures
          3. Progressive Web Apps
          4. Jamstack approach

          Developers must stay updated with these trends to remain competitive.`,
          excerpt: 'Latest trends in web development',
          topic: 'Web',
          author: 'AI Writer'
        },
        'Cloud Computing': {
          title: 'Cloud Computing: Benefits and Challenges',
          content: `Cloud computing has revolutionized how businesses operate.

          ## Benefits:
          - Scalability
          - Cost efficiency
          - Global reach
          - Automatic updates

          ## Challenges:
          - Security concerns
          - Vendor lock-in
          - Cost management

          Understanding these aspects is crucial for successful adoption.`,
          excerpt: 'Advantages and challenges of cloud computing',
          topic: 'Cloud',
          author: 'AI Writer'
        }
      };

      // Retornar artículo mock o uno genérico
      return mockArticles[topic] || {
        title: `Understanding ${topic}`,
        content: `This article provides a comprehensive overview of ${topic}. 
        
        ${topic} is an important field that continues to grow and evolve. 
        
        Key aspects include:
        1. Fundamental principles
        2. Practical applications
        3. Future developments
        
        Understanding ${topic} is essential in today's technological landscape.`,
        excerpt: `A comprehensive look at ${topic}`,
        topic: topic,
        author: 'AI Writer'
      };
    }
  };
}

class ArticleScheduler {
  constructor() {
    this.isInitialized = false;
    this.topics = [
      'Artificial Intelligence',
      'Web Development',
      'Cloud Computing',
      'Machine Learning',
      'DevOps',
      'JavaScript',
      'Python',
      'React',
      'Node.js',
      'Docker'
    ];
  }

  async init() {
    if (this.isInitialized) {
      console.log('📅 Scheduler already initialized');
      return;
    }

    console.log('🚀 Initializing article scheduler...');

    try {
      // 1. Inicializar la tabla de la base de datos
      const tableInitialized = await articleModel.initTable();
      if (!tableInitialized) {
        throw new Error('Failed to initialize database table');
      }

      // 2. Verificar cuántos artículos hay
      const articleCount = await articleModel.getArticleCount();
      console.log(`📊 Current articles in DB: ${articleCount}`);

      // 3. Generar artículos iniciales si está vacío
      if (articleCount < 3) {
        console.log('📝 Generating initial articles...');
        const initialTopics = this.topics.slice(0, 3);
        
        for (const topic of initialTopics) {
          try {
            await this.generateArticle(topic);
            // Pequeña pausa entre artículos
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`❌ Error generating ${topic}:`, error.message);
          }
        }
        console.log('✅ Initial articles generated');
      } else {
        console.log('✅ Sufficient articles already exist');
      }

      // 4. Configurar scheduler para generar 1 artículo cada 10 minutos (testing)
      cron.schedule('*/10 * * * *', async () => {
        console.log('⏰ Scheduled article generation triggered');
        await this.generateRandomArticle();
      });

      this.isInitialized = true;
      console.log('✅ Article scheduler initialized successfully');
      console.log('📅 Next auto-generation: every 10 minutes (for testing)');

    } catch (error) {
      console.error('❌ Error initializing scheduler:', error.message);
    }
  }

  async generateRandomArticle() {
    const randomTopic = this.topics[Math.floor(Math.random() * this.topics.length)];
    console.log(`🎲 Generating article about: ${randomTopic}`);
    return await this.generateArticle(randomTopic);
  }

  async generateArticle(topic) {
    try {
      console.log(`🤖 Requesting AI content for: ${topic}`);
      
      // Usar nuestro aiService (mock o real)
      const articleData = await aiService.generateArticle(topic);
      
      const article = {
        title: articleData.title || `Article About ${topic}`,
        content: articleData.content || `Content about ${topic}`,
        topic: topic,
        author: articleData.author || 'AI Writer',
        excerpt: articleData.excerpt || `Learn about ${topic}`
      };

      console.log(`📝 Saving article to database...`);
      const savedArticle = await articleModel.create(article);
      console.log(`✅ Article saved with ID: ${savedArticle.id || 'unknown'}`);

      return savedArticle;
    } catch (error) {
      console.error(`❌ Error generating article about ${topic}:`, error.message);
      
      // Fallback extremo: artículo muy básico
      const fallbackArticle = {
        title: `Article About ${topic}`,
        content: `Basic information about ${topic}. This is a fallback article.`,
        topic: topic,
        author: 'System',
        excerpt: `Basic information about ${topic}`
      };
      
      return await articleModel.create(fallbackArticle);
    }
  }
}

module.exports = new ArticleScheduler();