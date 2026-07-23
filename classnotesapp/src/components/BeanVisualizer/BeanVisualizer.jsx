import React, { useRef, useEffect, useState } from "react";
import { buildBeanGraph } from "./model/buildBeanGraph.js";
import { detectCycles } from "./regex/cycleDetection.js";
import { getBeanLevels } from "./regex/layoutCalculation.js";
import CodeEditor from "./components/CodeEditor.jsx";
import Alert from "./components/Alert.jsx";
import Canvas from "./components/Canvas.jsx";
import TabSelector from "./components/TabSelector.jsx";

// Colores por tipo de bean
const BEAN_COLORS = {
  component: "#27ae60",   // verde
  service:   "#e67e22",   // naranja
  repository: "#2980b9", // azul
  controller: "#8e44ad",  // violeta
  bean:      "#00bcd4",   // celeste para beans de configuración
  "xml-bean": "#f39c12"   // amarillo para beans XML
};



const CANVAS_HEIGHT = 600;
const BEAN_RADIUS = 40;
const BEAN_GAP = 40;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;


export default function BeanVisualizer({ initialCode }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    const beanSimStartTag = '[beansim]';
    const beanSimEndTag = '[endbeansim]';
    const startIndex = (initialCode || '').indexOf(beanSimStartTag);
    const endIndex = (initialCode || '').indexOf(beanSimEndTag);
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      setCode(initialCode.substring(startIndex + beanSimStartTag.length, endIndex).trim());
    } else {
      setCode(initialCode || '');
    }
  }, [initialCode]);
  const [beans, setBeans] = useState([]);
  const [wirings, setWirings] = useState([]);
  const [warnings, setWarnings] = useState({});
  const [zoom, setZoom] = useState(1);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [canvasWidth, setCanvasWidth] = useState(600);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [beanPositions, setBeanPositions] = useState({});
  const [draggedBean, setDraggedBean] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [cycleWarnings, setCycleWarnings] = useState([]);

  const LEVEL_VERTICAL_PADDING = 48;

  // Códigos de ejemplo
  const javaExample = `[beansim]
@Component
public class BeanA {}

@Component
public class BeanB {
    @Autowired
    private BeanA beanA;
}
[endbeansim]`;

  const xmlExample = `[beansim]
public class BeanA {}
public class BeanB {}

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="beanA" class="BeanA"/>
      
    <bean id="beanB" class="BeanB">
        <constructor-arg ref="beanA"/>
    </bean>
    
</beans>
[endbeansim]`;

  // Manejar clicks en los botones
  const handleJavaClick = () => {
    const beanSimStartTag = '[beansim]';
    const beanSimEndTag = '[endbeansim]';
    const startIndex = javaExample.indexOf(beanSimStartTag);
    const endIndex = javaExample.indexOf(beanSimEndTag);
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      setCode(javaExample.substring(startIndex + beanSimStartTag.length, endIndex).trim());
    } else {
      setCode(javaExample);
    }
  };

  const handleXmlClick = () => {
    const beanSimStartTag = '[beansim]';
    const beanSimEndTag = '[endbeansim]';
    const startIndex = xmlExample.indexOf(beanSimStartTag);
    const endIndex = xmlExample.indexOf(beanSimEndTag);
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      setCode(xmlExample.substring(startIndex + beanSimStartTag.length, endIndex).trim());
    } else {
      setCode(xmlExample);
    }
  };

  // Asignar posiciones iniciales o reacomodar al cambiar beans o wiring
  useEffect(() => {
    if (beans.length === 0) return;
    // Siempre reacomodar todos los beans al cambiar el grafo
    const newPositions = {};
    const BEAN_ROW_HEIGHT = 2 * BEAN_RADIUS;
    const PADDING = 24;
    const allWirings = [...wirings];
    const levels = getBeanLevels(beans, allWirings);
    levels.forEach((level, row) => {
      const n = level.length;
      const y = PADDING + BEAN_ROW_HEIGHT / 2 + row * (BEAN_ROW_HEIGHT + LEVEL_VERTICAL_PADDING);
      level.forEach((beanName, i) => {
        const x = PADDING + (canvasWidth - 2 * PADDING) * (i + 1) / (n + 1);
        newPositions[beanName] = { x, y };
      });
    });
    setBeanPositions(newPositions);
  }, [beans, canvasWidth, wirings, LEVEL_VERTICAL_PADDING]);

  useEffect(() => {
    const model = buildBeanGraph(code);
    setBeans(model.beans);
    setWirings(model.wirings);
    setWarnings(model.warnings);
    // Detectar ciclos (opcional, si quieres mantenerlo)
    const cycles = detectCycles(model.beans, model.wirings);
    setCycleWarnings(cycles);
  }, [code]);

  // ResizeObserver para el ancho del contenedor
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    const observer = new window.ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calcular cuadrícula y espacio virtual
  // Usar layout jerárquico para calcular virtualHeight (independiente del zoom)
  const allWirings = wirings;
  const levels = getBeanLevels(beans, allWirings);
  const BEAN_ROW_HEIGHT = 2 * BEAN_RADIUS; // alto real de cada fila
  const PADDING = 24;
  // El alto virtual es la suma de los altos de las filas más el padding extra
  const virtualHeight = levels.length > 0
    ? levels.length * BEAN_ROW_HEIGHT + (levels.length - 1) * LEVEL_VERTICAL_PADDING + 2 * PADDING
    : CANVAS_HEIGHT;
  const virtualWidth = Math.max(canvasWidth, canvasWidth);

  // Centrar la cámara al inicio o cuando cambian los beans o el ancho
  useEffect(() => {
    const maxX = Math.max(0, virtualWidth - canvasWidth / zoom);
    const maxY = Math.max(0, virtualHeight - CANVAS_HEIGHT / zoom);
    setCamera({
      x: maxX === 0 ? (virtualWidth - canvasWidth / zoom) / 2 : Math.max(0, Math.min(maxX, (virtualWidth - canvasWidth / zoom) / 2)),
      y: maxY === 0 ? (virtualHeight - CANVAS_HEIGHT / zoom) / 2 : Math.max(0, Math.min(maxY, (virtualHeight - CANVAS_HEIGHT / zoom) / 2))
    });
  }, [beans.length, zoom, canvasWidth, virtualWidth, virtualHeight]);

  // Dibujo
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(-camera.x, -camera.y);
    // Dibuja beans en sus posiciones
    beans.forEach(bean => {
      const pos = beanPositions[bean.beanName];
      if (!pos) return;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, BEAN_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = BEAN_COLORS[bean.type] || BEAN_COLORS.component;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#222';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let displayName = bean.beanName;
      let maxWidth = BEAN_RADIUS * 1.7;
      if (ctx.measureText(displayName).width > maxWidth) {
        while (displayName.length > 0 && ctx.measureText(displayName + '...').width > maxWidth) {
          displayName = displayName.slice(0, -1);
        }
        displayName += '...';
      }
      ctx.fillText(displayName, pos.x, pos.y);
    });
    // Dibujar wiring (flechas)
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    let cycleEdges = new Set();
    if (cycleWarnings && cycleWarnings.length > 0) {
      cycleWarnings.forEach(cycle => {
        for (let i = 0; i < cycle.length - 1; i++) {
          cycleEdges.add(cycle[i] + '→' + cycle[i+1]);
        }
        cycleEdges.add(cycle[cycle.length-1] + '→' + cycle[0]);
      });
    }
    // Wirings por campos (blanco)
    wirings.forEach(wiring => {
      const from = beanPositions[wiring.from];
      const to = beanPositions[wiring.to];
      if (from && to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const angle = Math.atan2(dy, dx);
        const startX = from.x + BEAN_RADIUS * Math.cos(angle);
        const startY = from.y + BEAN_RADIUS * Math.sin(angle);
        const endX = to.x - BEAN_RADIUS * Math.cos(angle);
        const endY = to.y - BEAN_RADIUS * Math.sin(angle);
        const isCycle = cycleEdges.has(wiring.from + '→' + wiring.to);
        ctx.strokeStyle = isCycle ? '#e53935' : '#fff';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - 10 * Math.cos(angle - 0.4), endY - 10 * Math.sin(angle - 0.4));
        ctx.lineTo(endX - 10 * Math.cos(angle + 0.4), endY - 10 * Math.sin(angle + 0.4));
        ctx.lineTo(endX, endY);
        ctx.fillStyle = isCycle ? '#e53935' : '#fff';
        ctx.fill();
      }
    });
    ctx.restore();
    ctx.restore();
  }, [beans, beanPositions, camera, zoom, canvasWidth, wirings, cycleWarnings]);

  // Drag and drop de beans
  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvasRef.current.width / rect.width) / zoom + camera.x;
    const my = (e.clientY - rect.top) * (canvasRef.current.height / rect.height) / zoom + camera.y;
    let found = null;
    for (const bean of beans) {
      const pos = beanPositions[bean.beanName];
      if (!pos) continue;
      const dx = mx - pos.x;
      const dy = my - pos.y;
      if (dx * dx + dy * dy <= BEAN_RADIUS * BEAN_RADIUS) {
        found = bean.beanName;
        setDraggedBean(bean.beanName);
        setDragOffset({ x: dx, y: dy });
        break;
      }
    }
    if (!found) {
      setDragging(true);
      setLastMouse({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    }
  }
  function handleMouseUp() {
    setDragging(false);
    setDraggedBean(null);
  }
  function handleMouseMove(e) {
    if (draggedBean) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvasRef.current.width / rect.width) / zoom + camera.x;
      const my = (e.clientY - rect.top) * (canvasRef.current.height / rect.height) / zoom + camera.y;
      setBeanPositions(pos => ({
        ...pos,
        [draggedBean]: {
          x: mx - dragOffset.x,
          y: my - dragOffset.y
        }
      }));
      return;
    }
    if (!dragging) return;
    const dx = (e.nativeEvent.offsetX - lastMouse.x) / zoom;
    const dy = (e.nativeEvent.offsetY - lastMouse.y) / zoom;
    const maxX = Math.max(0, virtualWidth - canvasWidth / zoom);
    const maxY = Math.max(0, virtualHeight - CANVAS_HEIGHT / zoom);
    setCamera(cam => {
      let newX = cam.x - dx;
      let newY = cam.y - dy;
      if (maxX === 0) newX = (virtualWidth - canvasWidth / zoom) / 2;
      else newX = Math.max(0, Math.min(maxX, newX));
      if (maxY === 0) newY = (virtualHeight - CANVAS_HEIGHT / zoom) / 2;
      else newY = Math.max(0, Math.min(maxY, newY));
      return { x: newX, y: newY };
    });
    setLastMouse({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  }

  // Wheel handler para zoom, usado en addEventListener
  function wheelHandler(e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom(z => {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta));
      return newZoom;
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('wheel', wheelHandler, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', wheelHandler, { passive: false });
    };
  }, [canvasRef]);

  // Mousemove para tooltip sobre beans
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function handleTooltipMove(e) {
      if (dragging) {
        setTooltip(null);
        return;
      }
      const rect = canvasRef.current.getBoundingClientRect();
      // Coordenadas relativas al canvas (corregido para zoom)
      const mx = (e.clientX - rect.left) * (canvasRef.current.width / rect.width) / zoom + camera.x;
      const my = (e.clientY - rect.top) * (canvasRef.current.height / rect.height) / zoom + camera.y;
      // Recalcular posiciones de beans
      const levels = getBeanLevels(beans, allWirings);
      // Usar LEVEL_VERTICAL_PADDING global
      const PADDING = 24;
      let found = null;
      levels.forEach((level, row) => {
        const n = level.length;
        const y = PADDING + BEAN_ROW_HEIGHT / 2 + row * (BEAN_ROW_HEIGHT + LEVEL_VERTICAL_PADDING);
        level.forEach((beanName, i) => {
          const x = PADDING + (canvasWidth - 2 * PADDING) * (i + 1) / (n + 1);
          const dx = mx - x;
          const dy = my - y;
          if (dx * dx + dy * dy <= BEAN_RADIUS * BEAN_RADIUS) {
            found = { name: beanName, x: e.clientX, y: e.clientY };
          }
        });
      });
      setTooltip(found);
    }
    function handleTooltipLeave() {
      setTooltip(null);
    }
    canvas.addEventListener('mousemove', handleTooltipMove);
    canvas.addEventListener('mouseleave', handleTooltipLeave);
    return () => {
      canvas.removeEventListener('mousemove', handleTooltipMove);
      canvas.removeEventListener('mouseleave', handleTooltipLeave);
    };
  }, [beans, zoom, camera, dragging, canvasWidth, wirings]);

  return (
    <div ref={containerRef} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: 'center' }}>
      {/* Bloque 1: Editor de código */}
      <div style={{ width: "100%", boxSizing: "border-box", marginBottom: 16 }}>
        <TabSelector onJavaClick={handleJavaClick} onXmlClick={handleXmlClick} />
        <CodeEditor code={code} onChange={setCode} />
        <style>{`
          #bean-code-editor, #bean-code-editor:focus {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }
          .npm__react-simple-code-editor__textarea:focus {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }
        `}</style>
      </div>
      {/* Bloque 2: Advertencias */}
      <Alert
        errors={warnings.errors || []}
        bracketWarning={warnings.bracketWarning}
        returnWarning={warnings.returnWarning}
        multiNameWarning={warnings.multiNameWarning}
        missingClassWarnings={warnings.missingClassWarnings || []}
        autowiredInvalids={warnings.autowiredInvalids || []}
        missingAutowiredTypes={warnings.missingAutowiredTypes || []}
        missingAutowiredMethodTypes={warnings.missingAutowiredMethodTypes || []}
        missingConstructorTypes={warnings.missingConstructorTypes || []}
        unassignedConstructorParams={warnings.unassignedConstructorParams || []}
        cycleWarnings={cycleWarnings}
        // Warnings XML
        xmlStructureWarning={warnings.xmlStructureWarning}
        xmlTagWarning={warnings.xmlTagWarning}
        xmlClosingWarning={warnings.xmlClosingWarning}
        beanUnclosedWarning={warnings.beanUnclosedWarning}
        missingXmlClassWarnings={warnings.missingXmlClassWarnings || []}
        brokenXmlWirings={warnings.brokenXmlWirings || []}
      />
      {/* Bloque 3: Canvas y slider */}
      <Canvas
        zoom={zoom}
        canvasWidth={canvasWidth}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseMove={handleMouseMove}
        canvasRef={canvasRef}
        MIN_ZOOM={MIN_ZOOM}
        MAX_ZOOM={MAX_ZOOM}
        setZoom={setZoom}
        CANVAS_HEIGHT={CANVAS_HEIGHT}
        dragging={dragging}
      />
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 10,
          top: tooltip.y + 10,
          background: 'rgba(30,30,30,0.95)',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: 6,
          fontSize: 14,
          pointerEvents: 'none',
          zIndex: 1000,
          maxWidth: 320,
          whiteSpace: 'pre-line',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
        }}>{tooltip.name}</div>
      )}
    </div>
  );
} 