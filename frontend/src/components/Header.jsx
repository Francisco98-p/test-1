import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>🤖 AutoBlog</h1>
          </Link>
          <nav>
            <span className="tagline">AI-generated articles, updated daily</span>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header