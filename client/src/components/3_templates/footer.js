import React from 'react'
import { Link } from 'react-router-dom'
import { path } from '../../config'

export const Footer = () => (
  <footer
    className="footer"
    style={{ padding: '1rem', backgroundColor: 'transparent' }}
  >
    <div
      className="content has-text-centered"
      style={{
        display: 'flex'
      }}
    >
      <Link to={path.code} style={{ flex: 1 }}>
        Charte éthique
      </Link>
      <Link to={path.roadmap} style={{ flex: 1 }}>
        Roadmap
      </Link>
      <Link to={path.contributors} style={{ flex: 1 }}>
        Contributeurs
      </Link>
      <Link to={path.legal} style={{ flex: 1 }}>
        Mentions légales
      </Link>
      <a href="https://gitlab.com/emendare/emendare" style={{ flex: 1 }}>
        Sources / GitLab
      </a>
    </div>
  </footer>
)