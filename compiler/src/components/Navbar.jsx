import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser, language, setLanguage, runCode, isRunning, downloadCode, theme, setTheme }) => {
  const navigate = useNavigate();
  
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'rust', label: 'Rust' }
  ];

  const themes = [
    { value: 'vs', label: 'Light' },
    { value: 'vs-dark', label: 'Dark' },
    { value: 'hc-black', label: 'High Contrast' }
  ];

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">CodeBuds Compiler</Link>
      </div>
      
      <div className="navbar-controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
        
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {themes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        
        <button onClick={runCode} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        
        <button onClick={downloadCode}>Download</button>
      </div>
      
      <div className="navbar-auth">
        {user ? (
          <>
            <Link to="/history">History</Link>
            <button onClick={logout}>Logout</button>
            <span className="username">{user.username}</span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;