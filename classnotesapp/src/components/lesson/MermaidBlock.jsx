import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import Box from "@mui/material/Box";
import { useThemeMode } from "@/theme/ThemeContext";

let mermaidCounter = 0;

const MermaidBlock = ({ children }) => {
  const containerRef = useRef(null);
  const idRef = useRef(`mermaid-block-${++mermaidCounter}`);
  const { mode } = useThemeMode();

  useEffect(() => {
    if (!containerRef.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: mode === "dark" ? "dark" : "default",
      securityLevel: "loose",
    });

    // Reset container with the definition so mermaid.run() can process it
    containerRef.current.innerHTML = `<pre class="mermaid" id="${idRef.current}">${children}</pre>`;

    mermaid
      .run({ nodes: [containerRef.current.querySelector(`#${idRef.current}`)] })
      .catch((err) => console.error("Mermaid render error:", err));
  }, [children, mode]);

  return (
    <Box
      ref={containerRef}
      sx={{
        my: 2,
        display: "flex",
        justifyContent: "center",
        overflowX: "auto",
        "& svg": { maxWidth: "100%" },
      }}
    />
  );
};

export default MermaidBlock;
