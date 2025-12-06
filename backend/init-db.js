const { query } = require('./src/database/db');
require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Crear tabla articles
    await query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        topic VARCHAR(100),
        author VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Database initialized successfully');
    
    // Insertar datos de ejemplo si la tabla está vacía
    const result = await query('SELECT COUNT(*) FROM articles');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('📝 Adding sample articles...');
      await query(`
        INSERT INTO articles (title, content, topic, author) VALUES
        ('Getting Started with React', 'React is a popular JavaScript library for building user interfaces.', 'React', 'AI Writer'),
        ('Node.js Best Practices', 'Node.js allows you to build scalable network applications.', 'Node.js', 'AI Writer'),
        ('Docker for Developers', 'Docker containers package up code and all its dependencies.', 'Docker', 'AI Writer')
      `);
      console.log('✅ Sample articles added');
    }
    
    console.log(`📊 Total articles in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    // No salir con error, seguir con datos en memoria
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase().then(() => {
    console.log('🎯 Database initialization complete');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { initializeDatabase };