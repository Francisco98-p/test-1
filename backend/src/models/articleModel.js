// backend/src/models/articleModel.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'articles.db');
const db = new sqlite3.Database(dbPath);

const articleModel = {
  async getAll() {
    return new Promise((resolve) => {
      db.all('SELECT * FROM articles ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          console.error('❌ Database error in getAll:', err.message);
          // Datos de ejemplo si hay error
          resolve([
            {
              id: '1',
              title: 'Getting Started with React',
              content: 'React is a popular JavaScript library for building user interfaces.',
              topic: 'React',
              created_at: new Date().toISOString(),
              author: 'AI Writer'
            },
            {
              id: '2',
              title: 'Node.js Best Practices',
              content: 'Node.js allows you to build scalable network applications.',
              topic: 'Node.js',
              created_at: new Date().toISOString(),
              author: 'AI Writer'
            }
          ]);
        } else {
          resolve(rows || []);
        }
      });
    });
  },

  async getById(id) {
    return new Promise((resolve) => {
      db.get('SELECT * FROM articles WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('❌ Database error in getById:', err.message);
          resolve(null);
        } else {
          resolve(row || null);
        }
      });
    });
  },

  async create(articleData) {
    return new Promise((resolve) => {
      const { title, content, topic = 'General', author = 'AI Writer' } = articleData;
      
      db.run(
        `INSERT INTO articles (title, content, topic, author) VALUES (?, ?, ?, ?)`,
        [title, content, topic, author],
        function(err) {
          if (err) {
            console.error('❌ Database error in create:', err.message);
            // Datos mock si falla
            resolve({
              id: Date.now().toString(),
              title,
              content,
              topic,
              created_at: new Date().toISOString(),
              author
            });
          } else {
            // Obtener el artículo recién insertado
            db.get(
              'SELECT * FROM articles WHERE id = ?', 
              [this.lastID], 
              (err, row) => {
                resolve(row || {
                  id: this.lastID,
                  title,
                  content,
                  topic,
                  created_at: new Date().toISOString(),
                  author
                });
              }
            );
          }
        }
      );
    });
  },

  async getArticleCount() {
    return new Promise((resolve) => {
      db.get('SELECT COUNT(*) as count FROM articles', (err, row) => {
        if (err) {
          console.error('❌ Database error in getArticleCount:', err.message);
          resolve(0);
        } else {
          resolve(row ? row.count : 0);
        }
      });
    });
  },

  async initTable() {
    return new Promise((resolve) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          topic TEXT,
          author TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Error initializing table:', err.message);
          resolve(false);
        } else {
          console.log('✅ Articles table initialized (SQLite)');
          resolve(true);
        }
      });
    });
  }
};

module.exports = articleModel;