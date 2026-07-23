import React from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-java";
import "prismjs/themes/prism-tomorrow.css";

export default function CodeEditor({ code, onChange }) {
  return (
    <Editor
      value={code}
      onValueChange={onChange}
      highlight={code => Prism.highlight(code, Prism.languages.java, "java")}
      padding={24}
      textareaId="bean-code-editor"
      style={{
        fontFamily: "monospace",
        fontSize: 16,
        background: "#2a2a40",
        color: "#f8f7ff",
        border: "none",
        borderRadius: 8,
        outline: "none",
        boxShadow: "none",
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        resize: "vertical",
        boxSizing: "border-box",
        minHeight: 200,
        caretColor: "#27ae60"
      }}
      preClassName="language-java"
      spellCheck={false}
    />
  );
} 