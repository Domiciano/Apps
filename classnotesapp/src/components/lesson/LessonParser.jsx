import React from "react";
import LessonTitle from "@/components/lesson/LessonTittle";
import LessonSub from "@/components/lesson/LessonSub";
import LessonParagraph from "@/components/lesson/LessonParagraph";
import CodeBlock from "@/components/code/CodeBlock";
import YouTubeEmbed from "@/components/embed/YouTubeEmbed";
import ImageBlock from "@/components/lesson/ImageBlock";
import LessonContainer from "@/components/lesson/LessonContainer";
import DartPadEmbed from "@/components/embed/DartPadEmbed";
import IconBlock from "@/components/lesson/IconBlock";
import Link from "@/components/lesson/Link";
import images from "@/assets";
import TryCodeButton from './TryCodeButton';
import MermaidBlock from "@/components/lesson/MermaidBlock";
import SvgBlock from "@/components/lesson/SvgBlock";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const LessonParser = ({ content }) => {
  // Eliminar líneas en blanco al final para asegurar flush correcto
  const lines = content.split("\n");
  let lastNonEmptyIndex = lines.length - 1;
  while (lastNonEmptyIndex >= 0 && lines[lastNonEmptyIndex].trim() === "") {
    lastNonEmptyIndex--;
  }
  const elements = [];
  const subtitles = [];
  let lessonTitleText = null;
  let paragraphBuffer = "";
  let codeBuffer = "";
  let parsingCode = false;
  let codeLang = "";
  let pendingCodeBlock = null;

  // --- LISTA ---
  let parsingList = false;
  let listItems = [];

  // --- MERMAID ---
  let parsingMermaid = false;
  let mermaidBuffer = "";

  // --- SVG ---
  let parsingSvg = false;
  let svgBuffer = "";

  // Definir estilos de lista idénticos a LessonParagraph
  const listTextStyle = {
    fontSize: '1rem',
    fontFamily: 'Roboto, Arial, sans-serif',
  };

  // Helper function to flush the current code block
  const flushCodeBlock = (index) => {
    if (parsingCode) {
      const codeBlock = (
        <CodeBlock key={`code-${index}`} language={codeLang}>
          {codeBuffer}
        </CodeBlock>
      );
      pendingCodeBlock = codeBlock;
      parsingCode = false;
      codeBuffer = "";
      codeLang = "";
    }
  };

  // Helper function to flush the current paragraph buffer
  const flushParagraph = (elements, buffer, key) => {
    if (buffer.trim() !== "") {
      elements.push(
        <LessonParagraph key={`p-${key}`}>
          {parseInlineLinks(parseInlineCode(buffer))}
        </LessonParagraph>
      );
    }
  };

  // Helper function for inline code parsing
  const parseInlineCode = (text) => {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1);
        return (
          <code key={index} className="inline-code">
            {code}
          </code>
        );
      } else {
        return part;
      }
    });
  };

  // Helper function for inline link parsing
  const parseInlineLinks = (elements) => {
    if (typeof elements === 'string') {
      // Si es una cadena, procesar normalmente
      const parts = elements.split(/(\[link\]\s+[^\]]+)/g);
      return parts.map((part, index) => {
        if (part.startsWith("[link]")) {
          const rest = part.slice(6).trim();
          
          // Buscar patrón con paréntesis: [link] (texto) url
          const parenthesesMatch = rest.match(/^\((.*?)\)\s+(.+)$/);
          if (parenthesesMatch) {
            const displayname = parenthesesMatch[1].trim();
            const url = parenthesesMatch[2].trim();
            return (
              <Link key={`inline-link-${index}`} displayname={displayname} url={url} />
            );
          } else {
            // Sintaxis original: [link] displayname url
            const firstSpace = rest.indexOf(" ");
            if (firstSpace > 0) {
              const displayname = rest.slice(0, firstSpace).trim();
              const url = rest.slice(firstSpace + 1).trim();
              return (
                <Link key={`inline-link-${index}`} displayname={displayname} url={url} />
              );
            }
          }
          return part; // Si no coincide con ningún patrón, devolver el texto original
        } else {
          return part;
        }
      });
    } else if (Array.isArray(elements)) {
      // Si es un array (resultado de parseInlineCode), procesar cada elemento
      return elements.map((element, index) => {
        if (typeof element === 'string') {
          // Procesar el string para links
          const parts = element.split(/(\[link\]\s+[^\]]+)/g);
          if (parts.length === 1) {
            return element; // No hay links en este string
          }
          return parts.map((part, partIndex) => {
            if (part.startsWith("[link]")) {
              const rest = part.slice(6).trim();
              
              // Buscar patrón con paréntesis: [link] (texto) url
              const parenthesesMatch = rest.match(/^\((.*?)\)\s+(.+)$/);
              if (parenthesesMatch) {
                const displayname = parenthesesMatch[1].trim();
                const url = parenthesesMatch[2].trim();
                return (
                  <Link key={`inline-link-${index}-${partIndex}`} displayname={displayname} url={url} />
                );
              } else {
                // Sintaxis original: [link] displayname url
                const firstSpace = rest.indexOf(" ");
                if (firstSpace > 0) {
                  const displayname = rest.slice(0, firstSpace).trim();
                  const url = rest.slice(firstSpace + 1).trim();
                  return (
                    <Link key={`inline-link-${index}-${partIndex}`} displayname={displayname} url={url} />
                  );
                }
              }
              return part; // Si no coincide con ningún patrón, devolver el texto original
            } else {
              return part;
            }
          });
        } else {
          // Es un elemento React (como <code>), devolverlo tal como está
          return element;
        }
      }).flat(); // Aplanar el array resultante
    } else {
      // Es un elemento React, devolverlo tal como está
      return elements;
    }
  };

  for (let i = 0; i <= lastNonEmptyIndex; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    // --- INICIO DE LISTA ---
    if (trimmedLine === '[list]') {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      parsingList = true;
      listItems = [];
      continue;
    }

    // --- FIN DE LISTA ---
    if (trimmedLine === '[endlist]') {
      parsingList = false;
      elements.push(
        <ul key={`list-${i}`} style={{ margin: '0px 0px 0px 24px', padding: '0px', width: 'auto', boxSizing: 'border-box', ...listTextStyle }}>
          {listItems}
        </ul>
      );
      listItems = [];
      continue;
    }

    // --- ELEMENTO DE LISTA ---
    if (parsingList) {
      // Cada línea no vacía dentro de la lista es un item
      if (trimmedLine !== "") {
      listItems.push(
          <li key={`li-${i}`} style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArrowRightIcon sx={{ fontSize: 20, color: '#42A5F5', mr: 0.5, alignSelf: 'flex-start', mt: '4px' }} />
            <Typography
              component="span"
              sx={{
                p:0,
                m:0,
                color: 'inherit',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 'calc(1.7em)',
                fontFamily: 'Roboto, Arial, sans-serif',
              }}
            >
              {parseInlineLinks(parseInlineCode(trimmedLine))}
            </Typography>
        </li>
      );
    }
      continue;
    }

    // Si estamos dentro de una lista, ignorar cualquier otra línea
    if (parsingList) {
      continue;
    }

    // --- INICIO DE BLOQUE MERMAID ---
    if (trimmedLine === '[mermaid]') {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      parsingMermaid = true;
      mermaidBuffer = "";
      continue;
    }

    // --- FIN DE BLOQUE MERMAID ---
    if (parsingMermaid && trimmedLine === '[endmermaid]') {
      elements.push(
        <MermaidBlock key={`mermaid-${i}`}>{mermaidBuffer.trimEnd()}</MermaidBlock>
      );
      parsingMermaid = false;
      mermaidBuffer = "";
      continue;
    }

    // --- Contenido del bloque Mermaid ---
    if (parsingMermaid) {
      mermaidBuffer += rawLine + "\n";
      continue;
    }

    // --- INICIO DE BLOQUE SVG ---
    if (trimmedLine === '[svg]') {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      parsingSvg = true;
      svgBuffer = "";
      continue;
    }

    // --- FIN DE BLOQUE SVG ---
    if (parsingSvg && trimmedLine === '[endsvg]') {
      elements.push(
        <SvgBlock key={`svg-${i}`}>{svgBuffer.trimEnd()}</SvgBlock>
      );
      parsingSvg = false;
      svgBuffer = "";
      continue;
    }

    // --- Contenido del bloque SVG ---
    if (parsingSvg) {
      svgBuffer += rawLine + "\n";
      continue;
    }

    // Check if the current line is a directive *before* checking parsingCode
    const isDirective = trimmedLine.match(/^\[(t|st|p|v|i|icon|dartpad|trycode|c:|link).*"]$/);

    // If we are parsing code and encounter [end], flush the code block
    if (parsingCode && trimmedLine === "[end]") {
      flushCodeBlock(i);
      continue;
    }

    // If we are parsing code and encounter any other directive, flush the code block first
    if (parsingCode && isDirective) {
      flushCodeBlock(i);
      // We don't continue here; we let the subsequent directive handling logic run
      // on the *current* line.
    }

    // --- TÍTULO PRINCIPAL ---
    if (trimmedLine.startsWith("[t]")) {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      const titleText = trimmedLine.slice(3).trim();
      if (!lessonTitleText) lessonTitleText = titleText;
      
      elements.push(
        <LessonTitle key={`title-${i}`}>
          {parseInlineLinks(parseInlineCode(titleText))}
        </LessonTitle>
      );
      continue;
    }

    // --- SUBTÍTULO ---
    if (trimmedLine.startsWith("[st]")) {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      // Si hay un pendingCodeBlock, insertarlo antes del subtítulo
      if (pendingCodeBlock) {
        elements.push(pendingCodeBlock);
        pendingCodeBlock = null;
      }
      const subtitleText = trimmedLine.slice(4).trim();
      subtitles.push({
        id: `subtitle-${i}`,
        text: subtitleText
      });
      elements.push(
        <LessonSub key={`subtitle-${i}`} id={`subtitle-${i}`}>
          {parseInlineLinks(parseInlineCode(subtitleText))}
        </LessonSub>
      );
      continue;
    }

    // --- INICIO DE NUEVO PÁRRAFO ---
    // Eliminado el manejo de [p]
    // if (trimmedLine === "[p]") {
    //   flushParagraph(elements, paragraphBuffer, i);
    //   paragraphBuffer = "";
    //   continue;
    // }

    // --- VIDEO EMBED ---
    if (trimmedLine.startsWith("[v]")) {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      const [id, title] = trimmedLine.slice(3).split("|").map((s) => s.trim());
      elements.push(
        <YouTubeEmbed key={`video-${i}`} videoId={id} title={title} />
      );
      continue;
    }

    // --- IMAGEN ---
    if (trimmedLine.startsWith("[i]")) {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      const [imgName, altText] = trimmedLine.slice(3).split("|").map((s) => s.trim());
      const isWebImage = imgName.startsWith("http://") || imgName.startsWith("https://");
      const src = isWebImage ? imgName : images[imgName];

      elements.push(
        <ImageBlock key={`img-${i}`} src={src} alt={altText} />
      );
      continue;
    }

    // --- ÍCONO SIMPLE ---
    if (trimmedLine.startsWith("[icon]")) {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      const [iconName, altText] = trimmedLine.slice(6).split("|").map((s) => s.trim());
      const isWebImage = iconName.startsWith("http://") || iconName.startsWith("https://");
      const src = isWebImage ? iconName : images[iconName];

      elements.push(
        <IconBlock key={`icon-${i}`} src={src} alt={altText} />
      );
      continue;
    }

    // --- DARTPAD EMBED ---
    if (trimmedLine.startsWith("[dartpad]")) {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      const gistId = trimmedLine.slice(9).trim();
      elements.push(
        <DartPadEmbed key={`dartpad-${i}`} gistId={gistId} />
      );
      continue;
    }

    // --- INICIO DE BLOQUE DE CÓDIGO NUEVO ---
    if (trimmedLine.startsWith("[code:")) {
      parsingCode = true;
      codeLang = trimmedLine.match(/\[code:(.*)\]/)[1].trim();
      codeBuffer = "";
      continue;
    }

    // --- Llenar el buffer de código mientras parsingCode ---
    if (parsingCode) {
      if (trimmedLine === '[endcode]') {
        // Verifica si la siguiente línea es un [trycode]
        const nextLine = lines[i + 1]?.trim() || '';
        const willHaveTryCode = nextLine.startsWith('[trycode');
        pendingCodeBlock = {
          code: codeBuffer.trimEnd(),
          language: codeLang,
          noMarginTop: willHaveTryCode
        };
        parsingCode = false;
        codeBuffer = "";
        codeLang = "";
        continue;
      } else {
      codeBuffer += rawLine + "\n";
      continue;
      }
    }

    // --- TRYCODE después de bloque de código ---
    if (trimmedLine.startsWith('[trycode')) {
      if (pendingCodeBlock) {
        const gistId = trimmedLine.replace('[trycode]', '').trim();
        elements.push(
          <TryCodeButton
            key={`trycode-${i}`}
            code={pendingCodeBlock.code}
            language={pendingCodeBlock.language}
            gistId={gistId || undefined}
            noMarginTop={pendingCodeBlock.noMarginTop}
          />
        );
        pendingCodeBlock = null;
      continue;
      }
    }

    // Si hay un pendingCodeBlock y no se usó, insértalo antes de cualquier otro elemento
    if (pendingCodeBlock) {
      elements.push(
        <CodeBlock key={`code-${i}`} language={pendingCodeBlock.language} sx={pendingCodeBlock.noMarginTop ? { mt: 0 } : {}}>
          {pendingCodeBlock.code}
        </CodeBlock>
      );
      pendingCodeBlock = null;
    }

    // --- LINK ELEGANTE ---
    if (trimmedLine.startsWith("[link]")) {
      flushParagraph(elements, paragraphBuffer, i);
      paragraphBuffer = "";
      // Sintaxis: [link] displayname url o [link] (texto del enlace) url
      const rest = trimmedLine.slice(6).trim();
      
      // Buscar patrón con paréntesis: [link] (texto) url
      const parenthesesMatch = rest.match(/^\((.*?)\)\s+(.+)$/);
      if (parenthesesMatch) {
        const displayname = parenthesesMatch[1].trim();
        const url = parenthesesMatch[2].trim();
        elements.push(
          <Link key={`link-${i}`} displayname={displayname} url={url} />
        );
      } else {
        // Sintaxis original: [link] displayname url
        const firstSpace = rest.indexOf(" ");
        if (firstSpace > 0) {
          const displayname = rest.slice(0, firstSpace).trim();
          const url = rest.slice(firstSpace + 1).trim();
          elements.push(
            <Link key={`link-${i}`} displayname={displayname} url={url} />
          );
        }
      }
      continue;
    }

    // --- TEXTO CONTINUO (NOT PART OF CODE BLOCK) ---
    // Cada línea (vacía o no) debe reflejarse con un <br /> en el output
    // Si la línea no está vacía, agregar el texto y luego un <br />
    if (!parsingList && !parsingCode) {
      if (rawLine !== "") {
        elements.push(
          <React.Fragment key={`line-${i}`}>
            {parseInlineLinks(parseInlineCode(rawLine))}
            <br key={`br-${i}`} />
          </React.Fragment>
        );
      } else {
        // Línea vacía, solo <br />
        elements.push(<br key={`br-${i}`} />);
      }
    }

    // --- FIN DEL ARCHIVO ---
    if (i === lastNonEmptyIndex) {
      flushParagraph(elements, paragraphBuffer, i);
      // Si hay un pendingCodeBlock al final, insertarlo
      if (pendingCodeBlock) {
        elements.push(pendingCodeBlock);
        pendingCodeBlock = null;
      }
    }
  }

  // --- FUERA DEL CICLO: Asegura que cualquier bloque pendiente se agregue ---
  flushParagraph(elements, paragraphBuffer, lines.length);
  if (pendingCodeBlock) {
    elements.push(pendingCodeBlock);
    pendingCodeBlock = null;
  }

  return {
    elements: <LessonContainer>{elements}</LessonContainer>,
    subtitles: subtitles,
    lessonTitle: lessonTitleText,
  };
};

export default LessonParser;