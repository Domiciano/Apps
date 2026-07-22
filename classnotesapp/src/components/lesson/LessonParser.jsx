import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { unified } from "unified";
import remarkParse from "remark-parse";
import LessonTitle from "@/components/lesson/LessonTittle";
import LessonSub from "@/components/lesson/LessonSub";
import LessonParagraph from "@/components/lesson/LessonParagraph";
import CodeBlock from "@/components/code/CodeBlock";
import YouTubeEmbed from "@/components/embed/YouTubeEmbed";
import ImageBlock from "@/components/lesson/ImageBlock";
import LessonContainer from "@/components/lesson/LessonContainer";
import DartPadEmbed from "@/components/embed/DartPadEmbed";
import IconBlock from "@/components/lesson/IconBlock";
import FramedImageBlock from "@/components/lesson/FramedImageBlock";
import Link from "@/components/lesson/Link";
import images from "@/assets";
import TryCodeButton from "./TryCodeButton";
import Typography from "@mui/material/Typography";
import MermaidBlock from "@/components/lesson/MermaidBlock";

// Reused across calls — plugins are registered once at freeze() time.
const headingProcessor = unified().use(remarkParse).use(remarkGfm);

const listTextStyle = {
  fontSize: "1rem",
  fontFamily: "Roboto, Arial, sans-serif",
};

// Joins the plain-text content of a heading node (mdast), skipping formatting nodes.
const headingText = (node) =>
  (node.children || [])
    .map((child) => {
      if (child.type === "text" || child.type === "inlineCode") return child.value;
      if (child.children) return headingText(child);
      return "";
    })
    .join("");

// Pre-pass over the mdast tree to collect lessonTitle + subtitles (id/text) in
// document order, independent of the React render pass below. LessonPage reads
// these synchronously right after calling LessonParser, before anything mounts.
const extractHeadings = (content) => {
  const tree = headingProcessor.parse(content);
  let lessonTitle = null;
  const subtitles = [];
  let counter = 0;

  for (const node of tree.children || []) {
    if (node.type !== "heading") continue;
    if (node.depth === 1) {
      const text = headingText(node);
      if (!lessonTitle) lessonTitle = text;
    } else if (node.depth === 2) {
      subtitles.push({ id: `subtitle-${counter++}`, text: headingText(node) });
    }
  }

  return { lessonTitle, subtitles };
};

const ListItem = ({ children }) => (
  <li
    style={{
      padding: 0,
      margin: "0 0",
      listStyle: "none",
      display: "flex",
      alignItems: "baseline",
    }}
  >
    <span
      style={{
        display: "inline-block",
        width: 4,
        height: "1em",
        background: "#fff",
        borderRadius: 0,
        marginRight: 12,
        marginLeft: 2,
        verticalAlign: "middle",
        marginTop: 0,
      }}
    />
    {/* component="div" — a "loose" markdown list (blank line between items,
        e.g. numbered prose like "1. foo") wraps item content in its own
        paragraph node; the default <p> tag can't legally nest another block. */}
    <Typography
      component="div"
      sx={{
        p: 0,
        color: "inherit",
        fontSize: { xs: "1rem", md: "1.1rem" },
        lineHeight: "calc(1.7em)",
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      {children}
    </Typography>
  </li>
);

const resolveImageSrc = (src) => {
  const isWebImage = /^https?:\/\//.test(src || "");
  return isWebImage ? src : images[src];
};

const LessonParser = ({ content }) => {
  const { lessonTitle, subtitles } = extractHeadings(content);

  // Consumed in document order by the `h2` renderer below to attach the same
  // ids that `subtitles` was built with, keeping TOC anchors and headings in sync.
  let h2Cursor = 0;

  const components = {
    h1: ({ children }) => <LessonTitle>{children}</LessonTitle>,
    h2: ({ children }) => {
      const sub = subtitles[h2Cursor++];
      return <LessonSub id={sub?.id}>{children}</LessonSub>;
    },
    h3: ({ children }) => (
      <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
        {children}
      </Typography>
    ),
    p: ({ children }) => <LessonParagraph>{children}</LessonParagraph>,
    a: ({ href, children }) => <Link displayname={children} url={href} />,
    img: ({ src, alt, title }) => {
      const resolved = resolveImageSrc(src);
      const frameMatch = /^frame(\d{1,3})?$/.exec(title || "");
      if (frameMatch) {
        const scale = frameMatch[1] ? Number(frameMatch[1]) / 100 : 1;
        return <FramedImageBlock src={resolved} alt={alt} scale={scale} />;
      }
      return title === "icon" ? (
        <IconBlock src={resolved} alt={alt} />
      ) : (
        <ImageBlock src={resolved} alt={alt} />
      );
    },
    ul: ({ children }) => (
      <ul style={{ margin: "0px 0 0px 0px", ...listTextStyle }}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol style={{ margin: "0px 0 0px 0px", ...listTextStyle }}>{children}</ol>
    ),
    li: ListItem,
    // Fenced code blocks always declare a language in this project's content,
    // so `className` presence distinguishes block code from inline `code`.
    code: ({ node, className, children }) => {
      const isBlock = typeof className === "string" && className.startsWith("language-");
      if (!isBlock) {
        return <code className="inline-code">{children}</code>;
      }

      const lang = className.replace("language-", "");
      const raw = String(children).replace(/\n$/, "");

      if (lang === "mermaid") return <MermaidBlock chart={raw} />;
      if (lang === "svg") {
        return (
          <div
            style={{ overflowX: "auto", margin: "12px 0" }}
            dangerouslySetInnerHTML={{ __html: raw }}
          />
        );
      }
      if (lang === "dartpad") return <DartPadEmbed gistId={raw.trim()} />;
      if (lang === "youtube") {
        const [videoId, title] = raw.split("|").map((s) => s.trim());
        return <YouTubeEmbed videoId={videoId} title={title} />;
      }

      const codeBlock = <CodeBlock language={lang}>{raw}</CodeBlock>;
      // Fence meta string (text after the language) carries `trycode=<gistId>`,
      // e.g. ```dart trycode=abc123 — pairs this block with a DartPad tab.
      const meta = node?.data?.meta || node?.properties?.metastring || "";
      const trycodeMatch = /trycode=(\S+)/.exec(meta);
      if (trycodeMatch) {
        return <TryCodeButton gistId={trycodeMatch[1]} code={raw} language={lang} />;
      }
      return codeBlock;
    },
    // The block-level dispatch above already renders its own container
    // (CodeBlock, MermaidBlock, ...); strip the default <pre> wrapper.
    pre: ({ children }) => <>{children}</>,
  };

  return {
    elements: (
      <LessonContainer>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </LessonContainer>
    ),
    subtitles,
    lessonTitle,
  };
};

export default LessonParser;
