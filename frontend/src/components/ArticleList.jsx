import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getArticles } from '../services/api'
import './ArticleList.css'

function ArticleList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const data = await getArticles()
      setArticles(data)
      setError(null)
    } catch (err) {
      setError('Failed to load articles')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading articles...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="article-list">
      <div className="list-header">
        <h2>Latest Articles</h2>
        <p>{articles.length} articles generated</p>
      </div>
      
      <div className="articles-grid">
        {articles.map(article => (
          <article key={article.id} className="article-card">
            <div className="article-meta">
              <span className="topic">{article.topic}</span>
              <span className="date">
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h3 className="article-title">
              <Link to={`/article/${article.id}`}>{article.title}</Link>
            </h3>
            
            <p className="article-excerpt">
              {article.content.substring(0, 150)}...
            </p>
            
            <div className="article-footer">
              <span className="author">By {article.author}</span>
              <Link to={`/article/${article.id}`} className="read-more">
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ArticleList