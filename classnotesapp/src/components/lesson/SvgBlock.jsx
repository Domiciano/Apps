import Box from "@mui/material/Box";

const SvgBlock = ({ children }) => (
  <Box
    sx={{
      my: 2,
      display: "flex",
      justifyContent: "center",
      overflowX: "auto",
      "& svg": { maxWidth: "100%" },
    }}
    dangerouslySetInnerHTML={{ __html: children }}
  />
);

export default SvgBlock;
