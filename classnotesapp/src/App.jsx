import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import '@/App.css';

import Layout from '@/components/drawer/Layout';
import TableOfContentsParser from '@/utils/tableOfContentsParser';
import courseConfig from '@/content/config.js';
import LessonPage from '@/pages/LessonPage';
import AiFab from '@/ai/AiFab';
import { useCurrentLesson } from '@/ai/CurrentLessonContext';
import { buildCourseOutline } from '@/ai/buildContext';
import AppBarGlobal from '@/components/AppBarGlobal';
import AdminPage from '@/admin/AdminPage';
import AgendaPage from '@/agenda/AgendaPage';

function App() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tocError, setTocError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const lessonPageRef = useRef();
  const layoutNavRef = useRef();

  useEffect(() => {
    const loadSections = async () => {
      try {
        const response = await fetch(courseConfig.tocUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status} al cargar toc.md`);
        const rawToc = await response.text();
        const parsedSections = TableOfContentsParser(rawToc);
        setSections(parsedSections);
      } catch (error) {
        console.error('[App] Error cargando la tabla de contenido:', error);
        setTocError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, []);

  const firstLessonId = useMemo(() => {
    const firstLesson = sections.find(s => s.type === 'lesson');
    return firstLesson ? firstLesson.id : null;
  }, [sections]);

  // El asistente necesita el temario entero para poder situar cualquier pregunta:
  // sin él solo conoce la lección abierta y da por inexistente el resto del curso.
  const { setCourseOutline } = useCurrentLesson();
  useEffect(() => {
    setCourseOutline(buildCourseOutline(sections));
  }, [sections, setCourseOutline]);

  // Deep-link redirect: GitHub Pages 404.html appends ?p=<path>
  // El `?p=` se resuelve sin esperar al temario: /admin no depende de él, y si
  // toc.md falla, un enlace profundo dejaría de resolverse por una razón ajena.
  useEffect(() => {
    const deepPath = new URLSearchParams(location.search).get('p');
    if (deepPath) {
      navigate(deepPath, { replace: true });
      return;
    }
    if (!loading && sections.length > 0 && location.pathname === '/' && firstLessonId) {
      navigate(`/lesson/${firstLessonId}`, { replace: true });
    }
  }, [loading, sections, location.search, firstLessonId, navigate, location.pathname]);

  // La vista de administrador es pantalla completa y no pertenece al temario:
  // va antes de la carga del toc para que siga siendo alcanzable aunque el
  // contenido no cargue — justo cuando el profesor necesita mirar los datos.
  if (location.pathname.replace(/\/+$/, '') === '/admin') {
    return <AdminPage />;
  }
  if (location.pathname.replace(/\/+$/, '') === '/agenda') {
    return <AgendaPage />;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2em' }}>
        Cargando contenido del curso...
      </div>
    );
  }

  if (sections.length === 0 || !firstLessonId) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <h2>No se pudo cargar el contenido del curso.</h2>
        <p>Verifica la URL configurada en <code>src/content/config.js</code>.</p>
        {tocError && <p style={{ color: '#FF5370', fontSize: '0.9em' }}>{tocError}</p>}
      </div>
    );
  }

  return (
    <>
      <AppBarGlobal
        onOpenMobileToc={() => lessonPageRef.current?.openMobileToc()}
        onOpenMobileNav={() => layoutNavRef.current?.()}
      />
      <Layout sections={sections} onOpenMobileNav={layoutNavRef}>
        <Routes>
          <Route path="/lesson/:lessonId" element={<LessonPage ref={lessonPageRef} sections={sections} />} />
          <Route path="/" element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>Iniciando curso...</h1>
              <p>Si esta página persiste, por favor recarga o contacta al administrador.</p>
            </div>
          } />
          <Route path="*" element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>404 - Página no encontrada</h1>
              <p>La URL que buscas no existe.</p>
            </div>
          } />
        </Routes>
      </Layout>
      {/* Fuera del Layout: el FAB es global y no debe heredar su desplazamiento. */}
      <AiFab />
    </>
  );
}

export default App;
