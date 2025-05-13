import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './monaco-overrides.css';
import '@fontsource/jetbrains-mono/400.css'; // Regular weight
import '@fontsource/jetbrains-mono/400-italic.css'; // Italic
import '@fontsource/jetbrains-mono/700.css'; // Bold

import { FiPlay, FiDownload, FiMoon, FiSun, FiUser, FiLogOut, FiLogIn, FiEdit } from 'react-icons/fi';
import './App.css';
import '@fontsource/inter';

// Components   
import AuthModal from './components/AuthModal';
import CodeHistory from './components/CodeHistory';
import TerminalOutput from './components/TerminalOutput';
import LanguageSelector from './components/LanguageSelector';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [user, setUser] = useState(null);
  const [code, setCode] = useState(`var x = 10;\nfunction test() {\n  console.log(x);\n  var x = 20;\n}\ntest();`);
  const [output, setOutput] = useState("No output yet. Run your code to see results here.");
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [activeTab, setActiveTab] = useState('editor');
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const runCode = () => {
    const logs = [];
    const originalConsoleLog = console.log;

    console.log = (...args) => {
      // explicitly log `undefined` instead of skipping it
      if (args.length === 0) {
        logs.push("undefined");
      } else {
        logs.push(args.map(arg => (arg === undefined ? "undefined" : String(arg))).join(" "));
      }
    };

    try {
      const wrappedCode = `(function() {\n${code}\n})();`;
      eval(wrappedCode);
    } catch (err) {
      logs.push("❌ Error: " + err.message);
    } finally {
      console.log = originalConsoleLog;
      if (logs.length === 0) {
        setOutput("⚠️ Your code ran, but nothing was logged.");
      } else {
        setOutput(logs.join("\n"));
      }
    }
  };





  const downloadCode = () => {
    const extension = getFileExtension(language);
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `codebuds-${Date.now()}.${extension}`;
    document.body.appendChild(element);
    element.click();
  };

  const getFileExtension = (lang) => {
    const extensions = {
      'javascript': 'js',
      'python': 'py',
      'java': 'java',
      'go': 'go',
      'c': 'c',
      'cpp': 'cpp',
      'ruby': 'rb',
      'rust': 'rs'
    };
    return extensions[lang] || 'txt';
  };

  const handleAuth = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className={`app ${theme === 'vs-dark' ? 'dark' : 'light'}`}>
        {/* Modern Navbar */}
        <nav className="navbar">
          <motion.div 
            className="logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
          <img src="/logo.png" alt="Logo" />
   
          </motion.div>

          <div className="navbar-controls">
            <LanguageSelector language={language} setLanguage={setLanguage} />
            
            <motion.button 
              className="run-button"
              onClick={runCode}
              disabled={isRunning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlay className="icon" />
              {isRunning ? 'Running...' : 'Run'}
            </motion.button>

            <motion.button 
              className="download-button"
              onClick={downloadCode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload className="icon" />
              Download
            </motion.button>
          </div>

          <div className="navbar-actions">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            
            {user ? (
              <div className="user-dropdown">
                <motion.button 
                  className="user-button"
                  whileHover={{ scale: 1.05 }}
                >
                  <FiUser className="icon" />
                  <span>{user.username}</span>
                </motion.button>
                <div className="dropdown-menu">
                  <button onClick={() => setActiveTab('history')}>
                    <FiEdit className="icon" />
                    History
                  </button>
                  <button onClick={handleLogout}>
                    <FiLogOut className="icon" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <motion.button 
                  className="auth-button"
                  onClick={() => handleAuth('login')}
                  whileHover={{ scale: 1.05 }}
                >
                  <FiLogIn className="icon" />
                  Login
                </motion.button>
                <motion.button 
                  className="auth-button primary"
                  onClick={() => handleAuth('register')}
                  whileHover={{ scale: 1.05 }}
                >
                  <FiEdit className="icon" />
                  Register
                </motion.button>
              </>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            {activeTab === 'editor' ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="editor-container"
              >
                <MonacoEditor
  height="65vh"
  language={language}
  theme={theme}
  value={code}
  onChange={handleEditorChange}
  options={{
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '400',
    fontLigatures: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: true,
    renderWhitespace: 'selection',
    bracketPairColorization: {
      enabled: true,
      independentColorPoolPerBracketType: true
    },
    guides: {
      bracketPairs: 'active'
    }
  }}
  beforeMount={(monaco) => {
    // Register custom font
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.lineHighlightBackground': '#282828',
        'editor.lineHighlightBorder': '#282828'
      }
    });
  }}
  onMount={(editor, monaco) => {
    // Apply font settings after mount
    editor.updateOptions({
      fontFamily: '"JetBrains Mono", monospace'
    });
    
    // Apply custom theme
    monaco.editor.setTheme('custom-dark');
  }}
/>
                <TerminalOutput output={output} />
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="history-container"
              >
                <CodeHistory 
                  user={user} 
                  setCode={setCode} 
                  setActiveTab={setActiveTab} 
                  setLanguage={setLanguage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Auth Modal */}
        <AnimatePresence>
          {showAuthModal && (
            <AuthModal 
              type={authType} 
              onClose={() => setShowAuthModal(false)}
              setUser={setUser}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;