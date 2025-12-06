// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ CORREGIDO: URL ABSOLUTA - NO USAR VARIABLES DE ENTORNO POR AHORA
  const API_URL = 'http://localhost:3000/api/articles';

  useEffect(() => {
    fetchArticles();
    
    // Actualizar cada 60 segundos para ver nuevos artículos auto-generados
    const interval = setInterval(fetchArticles, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchArticles = () => {
    console.log('🔍 Fetching from:', API_URL);
    
    fetch(API_URL)
      .then(res => {
        console.log('📥 Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ Data received:', data);
        
        // Manejar diferentes formatos de respuesta
        if (data.data && Array.isArray(data.data)) {
          setArticles(data.data);
        } else if (Array.isArray(data)) {
          setArticles(data);
        } else {
          console.error('⚠️ Unexpected data format:', data);
          setArticles([]);
        }
        
        setLoading(false);
        setError('');
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        setError(`Error: ${err.message}. Backend at ${API_URL} might be down.`);
        setLoading(false);
      });
  };

  const generateNewArticle = () => {
    // ✅ CORREGIDO: URL ABSOLUTA
    const generateUrl = 'http://localhost:3000/api/articles/generate';
    
    console.log('🚀 Generating article at:', generateUrl);
    
    fetch(generateUrl, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(result => {
        alert(`✅ ${result.message || 'New article created!'}`);
        fetchArticles(); // Refresh list
      })
      .catch(err => {
        console.error('❌ Generate error:', err);
        alert('Failed to generate new article');
      });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>🤖 Auto-Generated Blog</h1>
        <div style={styles.loading}>
          <p>Loading articles...</p>
          <div style={styles.spinner}></div>
          <p>Connecting to: {API_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🤖 Auto-Generated Blog</h1>
        <div style={styles.controls}>
          <div style={styles.buttonGroup}>
            <button onClick={fetchArticles} style={styles.button}>
              🔄 Refresh
            </button>
            <button onClick={generateNewArticle} style={{...styles.button, ...styles.primaryButton}}>
              ✨ Generate New
            </button>
          </div>
          <div style={styles.stats}>
            <span style={styles.count}>{articles.length} articles</span>
            <span style={styles.info}>Backend: localhost:3000</span>
          </div>
        </div>
        
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}
      </header>

      <main>
        {articles.length === 0 ? (
          <div style={styles.empty}>
            <p>No articles found.</p>
            <p>Backend URL: {API_URL}</p>
            <button onClick={generateNewArticle} style={styles.button}>
              Create first article
            </button>
          </div>
        ) : (
          <div style={styles.articlesList}>
            {articles.slice().reverse().map(article => (
              <article key={article.id} style={styles.article}>
                <div style={styles.articleHeader}>
                  <span style={{
                    ...styles.topic,
                    backgroundColor: getTopicColor(article.topic)
                  }}>
                    {article.topic || 'General'}
                  </span>
                  <span style={styles.date}>
                    {formatDate(article.created_at || article.createdAt)}
                  </span>
                </div>
                
                <h3 style={styles.title}>{article.title}</h3>
                
                <p style={styles.content}>{article.content}</p>
                
                <div style={styles.footer}>
                  <span style={styles.author}>By {article.author || 'AI Writer'}</span>
                  <div style={styles.meta}>
                    <span style={styles.id}>ID: {article.id}</span>
                    {article.id && article.id.length > 3 && (
                      <span style={styles.autoBadge}>🤖 Auto-generated</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>
            <strong>⚡ Live Demo</strong> | 
            <strong>⏰ Auto-generates</strong> every 10 minutes | 
            <strong>🎯 Backend:</strong> localhost:3000
          </p>
          <p style={styles.tech}>
            React + Node.js + SQLite + Docker | Technical Challenge
          </p>
        </div>
      </footer>
    </div>
  );
}

// Funciones auxiliares
function getTopicColor(topic) {
  const colors = {
    'React': '#61dafb',
    'Node.js': '#8cc84b',
    'Docker': '#2496ed',
    'JavaScript': '#f7df1e',
    'Python': '#3776ab',
    'AI': '#ff6b6b',
    'Artificial Intelligence': '#ff6b6b',
    'Web Development': '#4ecdc4',
    'Cloud Computing': '#45b7d1',
    'default': '#6c757d'
  };
  return colors[topic] || colors.default;
}

function formatDate(dateString) {
  if (!dateString) return 'No date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
}

// Estilos
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  header: {
    marginBottom: '40px',
    padding: '25px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  primaryButton: {
    backgroundColor: '#0d6efd'
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px'
  },
  count: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#0d6efd'
  },
  info: {
    fontSize: '0.9em',
    color: '#6c757d'
  },
  errorBox: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    color: '#856404',
    borderRadius: '6px',
    fontSize: '0.95em'
  },
  loading: {
    textAlign: 'center',
    padding: '50px'
  },
  spinner: {
    margin: '20px auto',
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #0d6efd',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '12px'
  },
  articlesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  article: {
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '12px',
    padding: '25px',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  articleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  topic: {
    color: 'white',
    padding: '6px 15px',
    borderRadius: '20px',
    fontSize: '0.85em',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  date: {
    color: '#6c757d',
    fontSize: '0.9em'
  },
  title: {
    margin: '15px 0',
    color: '#212529',
    fontSize: '1.5em',
    lineHeight: '1.3'
  },
  content: {
    color: '#495057',
    lineHeight: '1.7',
    margin: '20px 0',
    fontSize: '1.05em'
  },
  footer: {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #dee2e6'
  },
  author: {
    color: '#6c757d',
    fontSize: '0.95em'
  },
  meta: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  id: {
    color: '#adb5bd',
    fontFamily: 'monospace',
    fontSize: '0.85em'
  },
  autoBadge: {
    backgroundColor: '#e7f5ff',
    color: '#0d6efd',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.8em'
  },
  footerContent: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '0.9em',
    lineHeight: '1.6'
  },
  tech: {
    marginTop: '10px',
    color: '#adb5bd',
    fontSize: '0.85em'
  }
};

export default App;