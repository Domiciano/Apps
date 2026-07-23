// components/Layout.jsx
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { useThemeMode } from '@/theme/ThemeContext';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useStudiedLessons } from '@/theme/StudiedLessonsContext';

const drawerWidth = 280;

const Layout = ({ children, sections = [], onOpenMobileNav }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme } = useThemeMode();
  const { studiedLessons, toggleStudied } = useStudiedLessons();
  const [expandedSections, setExpandedSections] = useState(() => {
    try {
      const saved = localStorage.getItem('drawer-expanded-sections');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const toggleSection = (titleId) => {
    setExpandedSections(prev => {
      const next = { ...prev, [titleId]: !(prev[titleId] ?? true) };
      localStorage.setItem('drawer-expanded-sections', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (!onOpenMobileNav) return;
    onOpenMobileNav.current = () => setMobileOpen(true);
  }, [onOpenMobileNav]);

  const drawerContent = (
    <Box sx={{ width: drawerWidth, height: '100vh' }}>
      <Box sx={{ height: '64px' }} />
      <List>
        {(() => {
          let currentTitleId = null;
          return sections.map((sec, index) => {
            if (sec.type === "title") {
              currentTitleId = sec.id;
              const isExpanded = expandedSections[sec.id] ?? true;
              return (
                <Box
                  key={`title-${index}`}
                  onClick={() => toggleSection(sec.id)}
                  sx={{
                    px: 2,
                    py: 1,
                    fontWeight: "bold",
                    color: theme.drawerTitle,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none",
                    '&:hover': { opacity: 0.8 },
                  }}
                >
                  {sec.label}
                  {isExpanded
                    ? <ExpandMoreIcon sx={{ fontSize: "1rem" }} />
                    : <ChevronRightIcon sx={{ fontSize: "1rem" }} />}
                </Box>
              );
            }

            // SPEC-08 P3: render [d] divider entries
            if (sec.type === "divider") {
              return (
                <Divider
                  key={`divider-${index}`}
                  sx={{ my: 1, borderColor: theme.border }}
                />
              );
            }

            if (sec.type === "lesson") {
              const isExpanded = currentTitleId ? (expandedSections[currentTitleId] ?? true) : true;
              if (!isExpanded) return null;

              const isStudied = studiedLessons.includes(sec.id);
              const isSelected = location.pathname === `/lesson/${sec.id}`;
              return (
                <ListItemButton
                  key={`lesson-${sec.id}`}
                  component={Link}
                  to={`/lesson/${sec.id}`}
                  selected={isSelected}
                  sx={{
                    color: theme.drawerSection,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(66, 165, 245, 0.1)',
                      color: theme.drawerTitle,
                    },
                    '&:hover': { color: theme.drawerTitle },
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  <ListItemText primary={sec.label} />
                  <IconButton
                    size="small"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleStudied(String(sec.id));
                    }}
                    sx={{ ml: 1 }}
                    aria-label={isStudied ? 'Marcar como no estudiada' : 'Marcar como estudiada'}
                  >
                    {isStudied
                      ? <CheckCircleIcon sx={{ color: theme.accent }} />
                      : <CheckCircleOutlineIcon sx={{ color: isSelected ? theme.accent : theme.border, opacity: isSelected ? 0.8 : 1 }} />}
                  </IconButton>
                </ListItemButton>
              );
            }

            return null;
          });
        })()}
      </List>
      <Box sx={{ height: 100 }} />
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {!isMobile && (
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            backgroundColor: theme.background,
            color: '#fff',
            overflowX: 'hidden',
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: 1201,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {drawerContent}
        </Box>
      )}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true, disableScrollLock: false }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: "85%",
              maxWidth: drawerWidth,
              backgroundColor: theme.background,
              color: theme.textPrimary,
              borderRight: `1px solid ${theme.border}`,
              boxShadow: "4px 0 20px rgba(0,0,0,0.5)",
              paddingTop: '64px',
            },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flex: 1,
          p: isMobile ? 1 : 2,
          pt: isMobile ? 8 : 2,
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: theme.background,
          minHeight: "100vh",
          ml: !isMobile ? `${drawerWidth}px` : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
