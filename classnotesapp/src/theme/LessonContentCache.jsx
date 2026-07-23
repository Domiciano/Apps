// src/theme/LessonContentCache.jsx
// SPEC-11: Lazy lesson loading — cache for on-demand lesson content fetches.

import React, { createContext, useContext, useRef, useState } from 'react';

const LessonContentCacheContext = createContext(null);

export const LessonContentCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(new Map());
  const inFlightRef = useRef(new Map()); // lessonId → Promise<string>

  const getOrFetch = (lessonId, url) => {
    if (cache.has(lessonId)) {
      return Promise.resolve(cache.get(lessonId));
    }

    if (inFlightRef.current.has(lessonId)) {
      return inFlightRef.current.get(lessonId);
    }

    const promise = fetch(url, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .catch(err => {
        console.warn(`[LessonContentCache] Error fetching ${url}:`, err);
        return `[t] Error cargando lección\nNo se pudo cargar el contenido desde:\n${url}`;
      })
      .then(rawContent => {
        setCache(prev => new Map(prev).set(lessonId, rawContent));
        inFlightRef.current.delete(lessonId);
        return rawContent;
      });

    inFlightRef.current.set(lessonId, promise);
    return promise;
  };

  return (
    <LessonContentCacheContext.Provider value={{ cache, getOrFetch }}>
      {children}
    </LessonContentCacheContext.Provider>
  );
};

export const useLessonContentCache = () => {
  const ctx = useContext(LessonContentCacheContext);
  if (!ctx) throw new Error('useLessonContentCache must be used inside LessonContentCacheProvider');
  return ctx;
};
