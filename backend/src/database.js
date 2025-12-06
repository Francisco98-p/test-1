// backend/src/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'articles.db');
const db = new sqlite3.Database(dbPath);

// Inicializar base de datos
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        topic TEXT DEFAULT 'General',
        author TEXT DEFAULT 'AI Writer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('❌ Error creating table:', err.message);
        reject(err);
      } else {
        console.log('✅ Database table ready (with topic and author)');
        resolve();
      }
    });
  });
}

// Funciones para interactuar con la DB
const database = {
  db,
  initDatabase,

  async getArticleCount() {
    return new Promise((resolve) => {
      db.get('SELECT COUNT(*) as count FROM articles', (err, row) => {
        if (err) {
          console.error('❌ Error counting articles:', err.message);
          resolve(0);
        } else {
          resolve(row ? row.count : 0);
        }
      });
    });
  },

  async getAllArticles() {
    return new Promise((resolve) => {
      db.all('SELECT * FROM articles ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          console.error('❌ Error fetching articles:', err.message);
          resolve([]);
        } else {
          resolve(rows || []);
        }
      });
    });
  },

  async getArticleById(id) {
    return new Promise((resolve) => {
      db.get('SELECT * FROM articles WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('❌ Error fetching article:', err.message);
          resolve(null);
        } else {
          resolve(row || null);
        }
      });
    });
  },

  async createArticle(article) {
    return new Promise((resolve, reject) => {
      const { 
        title, 
        content, 
        excerpt = '', 
        topic = 'General', 
        author = 'AI Writer' 
      } = article;
      
      db.run(
        `INSERT INTO articles (title, content, excerpt, topic, author) 
         VALUES (?, ?, ?, ?, ?)`,
        [title, content, excerpt, topic, author],
        function(err) {
          if (err) {
            console.error('❌ Error creating article:', err.message);
            reject(err);
          } else {
            console.log('✅ Article saved with ID:', this.lastID);
            resolve(this.lastID);
          }
        }
      );
    });
  }
};

module.exports = database;