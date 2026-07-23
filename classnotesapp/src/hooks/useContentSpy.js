import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Función para convertir texto a slug válido para URL
const createSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remueve diacríticos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/-+/g, '-') // Reemplaza múltiples guiones con uno solo
    .trim('-'); // Remueve guiones al inicio y final
};

export const useContentSpy = (subtitles) => {
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  // Set initial active section when subtitles are loaded
  useEffect(() => {
    if (subtitles.length > 0 && !activeSection) {
      const firstSubtitle = subtitles[0];
      setActiveSection(firstSubtitle.id);
      
      // If no hash in URL, set the first section as active
      if (!location.hash) {
        const slug = createSlug(firstSubtitle.text);
        window.history.replaceState(null, null, `#${slug}`);
      }
    }
  }, [subtitles, activeSection, location.hash]);

  useEffect(() => {
    if (!subtitles || subtitles.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -60% 0px', // Más sensible: activa cuando está en el top 10% del viewport
      threshold: [0, 0.1, 0.5, 1] // Múltiples thresholds para mejor detección
    };

    const observer = new IntersectionObserver((entries) => {
      // Ordenar entradas por ratio de intersección (más visible primero)
      const sortedEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      
      if (sortedEntries.length > 0) {
        const mostVisibleEntry = sortedEntries[0];
        const sectionId = mostVisibleEntry.target.id;
        setActiveSection(sectionId);
        
        // Find the subtitle text for this ID
        const subtitle = subtitles.find(sub => sub.id === sectionId);
        if (subtitle) {
          const slug = createSlug(subtitle.text);
          const newHash = `#${slug}`;
          if (location.hash !== newHash) {
            window.history.replaceState(null, null, newHash);
          }
        }
      }
    }, observerOptions);

    // Observe all subtitle elements
    subtitles.forEach(subtitle => {
      const element = document.getElementById(subtitle.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Función para detectar cuando estamos cerca del final de la página
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Si estamos a menos del 10% del final de la página, activar el último elemento
      if (scrollPosition >= documentHeight * 0.9 && subtitles.length > 0) {
        const lastSubtitle = subtitles[subtitles.length - 1];
        setActiveSection(lastSubtitle.id);
        
        const slug = createSlug(lastSubtitle.text);
        const newHash = `#${slug}`;
        if (location.hash !== newHash) {
          window.history.replaceState(null, null, newHash);
        }
      }
    };

    // Agregar listener de scroll para detectar final de página
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [subtitles, location.hash]);

  // Handle initial hash navigation
  useEffect(() => {
    if (location.hash && subtitles.length > 0) {
      const targetSlug = location.hash.substring(1);
      
      // Find subtitle by slug
      const targetSubtitle = subtitles.find(sub => createSlug(sub.text) === targetSlug);
      
      if (targetSubtitle) {
        setActiveSection(targetSubtitle.id);
        const targetElement = document.getElementById(targetSubtitle.id);
        
        if (targetElement) {
          // Use the same scroll logic as TableOfContents with proper offset
          setTimeout(() => {
            const elementTop = targetElement.offsetTop;
            const offset = 80; // 64px AppBar + 16px padding
            window.scrollTo({
              top: elementTop - offset,
              behavior: 'smooth'
            });
          }, 100);
        }
      } else {
        // If hash doesn't match any subtitle, default to first
        const firstSubtitle = subtitles[0];
        setActiveSection(firstSubtitle.id);
        const slug = createSlug(firstSubtitle.text);
        window.history.replaceState(null, null, `#${slug}`);
      }
    }
  }, [location.hash, subtitles]);

  return { activeSection };
}; 