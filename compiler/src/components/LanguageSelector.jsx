import React from 'react';
import { motion } from 'framer-motion';

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

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <motion.div 
      className="language-selector"
      whileHover={{ scale: 1.05 }}
    >
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="language-dropdown"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default LanguageSelector;