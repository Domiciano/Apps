// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import { StudiedLessonsProvider } from './theme/StudiedLessonsContext';
import { LessonContentCacheProvider } from './theme/LessonContentCache';
import 'prismjs/themes/prism-tomorrow.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <StudiedLessonsProvider>
        <LessonContentCacheProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
          </BrowserRouter>
        </LessonContentCacheProvider>
      </StudiedLessonsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
