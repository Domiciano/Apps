// src/agenda/AgendaPage.jsx
//
// Agenda común de presentaciones (/agenda). Pantalla completa, fuera del Layout
// de lecciones, como /admin. Cada curso ve sus propios grupos con integrantes;
// las franjas que tomó otro curso salen como «Ocupado · otro curso». El profesor
// (claim `profesor: true` en el proyecto de la agenda) carga los grupos, puede
// ver los tres cursos a la vez y libera cualquier reserva.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { courseId } from '@/auth/firebaseConfig';
import { useThemeMode } from '@/theme/ThemeContext';
import { AGENDA_COURSES, AGENDA_TITLE, BOOKING_LEAD_HOURS } from './agendaConfig';
import { agendaAuth, agendaGoogleProvider } from './agendaFirebase';
import * as firestoreAgenda from './agendaData';
import { createDemoAgenda } from './agendaDemo';
import {
  buildBoard,
  buildSlots,
  formatSlot,
  friendlyAgendaError,
  groupSlotsByDay,
  modalityLabel,
  splitGroups,
} from './agendaSlots';
import { courseFromFileName, parseGroupsMarkdown } from './groupsParser';
import BookingDialog from './BookingDialog';

const SLOTS = buildSlots();

// Rellenos sólidos con texto oscuro: se leen igual sobre el tema claro y el oscuro.
const MODALITY_CHIP = {
  presencial: { bg: '#FFB547', fg: '#2B1A00' },
  virtual: { bg: '#B39DFF', fg: '#1E1240' },
};

const ModalityChip = ({ modality }) => {
  const c = MODALITY_CHIP[modality] ?? { bg: '#CFD8DC', fg: '#102027' };
  return (
    <Chip
      size="small"
      label={modalityLabel(modality)}
      sx={{ background: c.bg, color: c.fg, fontWeight: 700, border: 'none' }}
    />
  );
};
const courseName = AGENDA_COURSES[courseId] ?? courseId;

// `/agenda?demo` (o `?demo=profesor`) en `npm run dev`: datos en memoria, para
// revisar la interfaz sin Firestore. En el build de producción no existe.
const demoParam =
  import.meta.env.DEV && typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('demo')
    : null;
const demo = demoParam !== null ? createDemoAgenda(courseId, { teacher: demoParam === 'profesor' }) : null;
const api = demo ?? firestoreAgenda;
const { bookSlot, cancelBooking, saveGroups, watchBookings, watchGroups, watchSlots } = api;

const AgendaPage = () => {
  const { theme } = useThemeMode();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [user, setUser] = useState(undefined);
  const [isTeacher, setIsTeacher] = useState(false);
  const [slotDocs, setSlotDocs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [groups, setGroups] = useState(undefined);
  const [allCourses, setAllCourses] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [dialogSlot, setDialogSlot] = useState(null);
  const [toRelease, setToRelease] = useState(null);
  const [releasing, setReleasing] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (demo) {
      setUser(demo.user);
      setIsTeacher(demo.isTeacher);
      return undefined;
    }
    return onAuthStateChanged(agendaAuth, async (fbUser) => {
        setUser(fbUser ?? null);
        if (!fbUser) { setIsTeacher(false); return; }
        try {
          const token = await fbUser.getIdTokenResult();
          setIsTeacher(token?.claims?.profesor === true);
        } catch {
          setIsTeacher(false);
        }
    });
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    const fail = (err) => {
      console.error('[Agenda]', err);
      setError(friendlyAgendaError(err));
    };
    const stops = [
      watchSlots(setSlotDocs, fail),
      watchBookings(courseId, setBookings, fail, { allCourses: isTeacher && allCourses }),
      watchGroups(courseId, setGroups, fail),
    ];
    return () => stops.forEach((stop) => stop());
  }, [user, isTeacher, allCourses]);

  const board = useMemo(
    () => buildBoard({ slots: SLOTS, slotDocs, bookings, courseId, now }),
    [slotDocs, bookings, now],
  );
  const days = useMemo(() => {
    const byId = new Map(board.map((cell) => [cell.slot.id, cell]));
    return groupSlotsByDay(SLOTS).map((d) => ({ ...d, cells: d.slots.map((s) => byId.get(s.id)) }));
  }, [board]);
  const { withDate, withoutDate } = useMemo(
    () => splitGroups(groups ?? [], bookings, courseId),
    [groups, bookings],
  );
  const groupOptions = useMemo(() => {
    const byGroup = new Map(withDate.map((w) => [w.group.id, w.booking]));
    return (groups ?? []).map((g) => ({ group: g, booking: byGroup.get(g.id) ?? null }));
  }, [groups, withDate]);
  const myGroupId = withDate.find((w) => w.booking.bookedBy?.uid === user?.uid)?.group.id;
  const freeCount = board.filter((c) => c.status === 'free' && !c.closed).length;

  const signIn = async () => {
    setError(null);
    try {
      await signInWithPopup(agendaAuth, agendaGoogleProvider);
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') setError('No se pudo iniciar sesión con Google.');
    }
  };

  const handleConfirm = async ({ group, bookerName, modality }) => {
    try {
      await bookSlot({ courseId, group, slot: dialogSlot, modality, bookerName, user, isTeacher });
      setNotice(`Listo: ${group.name} presenta el ${formatSlot(dialogSlot)} (${modalityLabel(modality).toLowerCase()}).`);
      setDialogSlot(null);
    } catch (err) {
      console.error('[Agenda] Reserva fallida:', err);
      throw Object.assign(err, { friendly: friendlyAgendaError(err) });
    }
  };

  const handleRelease = async () => {
    setReleasing(true);
    try {
      await cancelBooking(toRelease);
      setNotice(`Se liberó la franja de ${toRelease.groupName}.`);
      setToRelease(null);
    } catch (err) {
      console.error('[Agenda] No se pudo liberar:', err);
      setError(friendlyAgendaError(err));
    } finally {
      setReleasing(false);
    }
  };

  const handleGroupsFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(null);
    setNotice(null);
    const named = courseFromFileName(file.name, Object.keys(AGENDA_COURSES));
    if (named && named !== courseId) {
      setError(`El archivo «${file.name}» parece ser de ${AGENDA_COURSES[named]}, y esta es la agenda de ${courseName}. Cárgalo desde el sitio de ese curso.`);
      return;
    }
    const { groups: parsed, errors } = parseGroupsMarkdown(await file.text());
    if (errors.length > 0 || parsed.length === 0) {
      setError(errors.length > 0 ? errors.join(' ') : 'El archivo no tiene grupos (títulos ##).');
      return;
    }
    const orphaned = bookings.filter(
      (b) => b.courseId === courseId && !parsed.some((g) => g.id === b.groupId),
    );
    try {
      await saveGroups(courseId, parsed);
      setNotice(
        `Se cargaron ${parsed.length} grupos de ${courseName}.` +
          (orphaned.length > 0
            ? ` Ojo: ${orphaned.map((b) => b.groupName).join(', ')} tenían reserva y ya no están en la lista.`
            : ''),
      );
    } catch (err) {
      console.error('[Agenda] No se pudieron guardar los grupos:', err);
      setError(friendlyAgendaError(err));
    }
  };

  const canRelease = (booking) => booking && (isTeacher || booking.bookedBy?.uid === user?.uid);

  const card = {
    background: theme.backgroundLight,
    border: `1px solid ${theme.border}`,
    borderRadius: 2,
    color: theme.textPrimary,
  };

  // Las dos tarjetas de equipos van a su altura natural; en escritorio la columna
  // entera queda fija y se desplaza con un solo scroll, sin barra visible.
  const sidePanel = { ...card, flexShrink: 0 };
  const sideList = { px: 2, pb: 1.5 };

  const renderCell = (cell) => {
    const { slot, status, booking, past, closed } = cell;
    const bookable = !past && (!closed || isTeacher);
    const mineByMe = booking?.bookedBy?.uid === user?.uid;
    const base = {
      display: 'grid',
      gridTemplateColumns: { xs: '92px 1fr', sm: '110px 1fr auto' },
      alignItems: 'center',
      gap: 1.5,
      px: 2,
      py: 1.25,
      borderTop: `1px solid ${theme.border}`,
      opacity: !bookable && status === 'free' ? 0.45 : 1,
    };
    const time = (
      <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontSize: '0.9rem' }}>
        {slot.start} – {slot.end}
      </Typography>
    );

    if (status === 'free') {
      return (
        <Box key={slot.id} sx={base}>
          {time}
          <Typography sx={{ color: bookable ? theme.success : theme.textSecondary, fontSize: '0.9rem' }}>
            {past ? 'Ya pasó' : bookable ? 'Libre' : `Cerrada · faltan menos de ${BOOKING_LEAD_HOURS} h`}
          </Typography>
          {bookable && (
            <Box sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' }, justifySelf: { xs: 'stretch', sm: 'end' } }}>
              <Button
                size="small"
                variant="outlined"
                fullWidth
                disabled={!groups || groups.length === 0}
                onClick={() => setDialogSlot(slot)}
              >
                Reservar
              </Button>
            </Box>
          )}
        </Box>
      );
    }

    if (status === 'taken' && !booking) {
      return (
        <Box key={slot.id} sx={{ ...base, background: alpha(theme.textSecondary, 0.08) }}>
          {time}
          <Typography sx={{ color: theme.textSecondary, fontSize: '0.9rem' }}>
            Ocupado · otro curso
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        key={slot.id}
        sx={{
          ...base,
          background: alpha(theme.accent, mineByMe ? 0.16 : 0.07),
          borderLeft: `4px solid ${mineByMe ? theme.accent : 'transparent'}`,
        }}
      >
        {time}
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{booking?.groupName ?? '—'}</Typography>
            {booking?.modality && <ModalityChip modality={booking.modality} />}
            {status === 'taken' && (
              <Chip
                size="small"
                label={AGENDA_COURSES[cell.courseId] ?? cell.courseId}
                sx={{ background: alpha(theme.textSecondary, 0.25), color: theme.textPrimary }}
              />
            )}
            {mineByMe && <Chip size="small" color="primary" label="Tu reserva" />}
          </Box>
          <Typography sx={{ fontSize: '0.8rem', color: theme.textSecondary, mt: 0.25 }}>
            {(booking?.members ?? []).join(' · ')}
          </Typography>
          {isTeacher && booking?.bookedBy?.email && (
            <Typography sx={{ fontSize: '0.75rem', color: theme.textSecondary, mt: 0.25 }}>
              Reservó {booking.bookerName} ({booking.bookedBy.email})
            </Typography>
          )}
        </Box>
        {canRelease(booking) && (
          <Box sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' }, justifySelf: { xs: 'stretch', sm: 'end' } }}>
            <Button size="small" color="error" fullWidth onClick={() => setToRelease(booking)}>
              Liberar
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', background: theme.background, color: theme.textPrimary }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: theme.appBarBg,
          color: theme.appBarText,
          px: { xs: 1.5, sm: 3 },
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <IconButton color="inherit" onClick={() => navigate('/')} aria-label="Volver al curso">
          <ArrowBackIcon />
        </IconButton>
        <EventAvailableIcon sx={{ color: theme.accent }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.2rem' }, lineHeight: 1.2 }}>
            {AGENDA_TITLE}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', opacity: 0.8 }} noWrap>{courseName}</Typography>
        </Box>
        {user && (
          <>
            <Typography sx={{ fontSize: '0.8rem', opacity: 0.85, display: { xs: 'none', sm: 'block' } }} noWrap>
              {user.email}
            </Typography>
            <IconButton color="inherit" disabled={Boolean(demo)} onClick={() => signOut(agendaAuth)} aria-label="Cerrar sesión de la agenda">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>

      <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 1.5, sm: 3 }, py: 3 }}>
        {demo && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Modo demo: datos inventados en memoria, nada se guarda en Firestore.
          </Alert>
        )}
        {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}
        {notice && <Alert severity="success" onClose={() => setNotice(null)} sx={{ mb: 2 }}>{notice}</Alert>}

        {user === undefined && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        )}

        {user === null && (
          <Paper elevation={0} sx={{ ...card, p: 4, maxWidth: 520, mx: 'auto', textAlign: 'center' }}>
            <EventAvailableIcon sx={{ fontSize: 48, color: theme.accent, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{AGENDA_TITLE}</Typography>
            <Typography sx={{ color: theme.textSecondary, mb: 3 }}>
              Inicia sesión con Google para ver las franjas y reservar la de tu grupo. La agenda
              es común a los cursos del profesor, así que necesita su propio inicio de sesión.
            </Typography>
            <Button variant="contained" startIcon={<GoogleIcon />} onClick={signIn}>
              Iniciar sesión con Google
            </Button>
          </Paper>
        )}

        {user && (
          <>
            {isTeacher && (
              <Paper elevation={0} sx={{ ...card, p: 2, mb: 2.5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 700, mr: 'auto' }}>Profesor</Typography>
                <FormControlLabel
                  control={<Switch checked={allCourses} onChange={(e) => setAllCourses(e.target.checked)} />}
                  label="Ver los tres cursos"
                />
                <input ref={fileRef} type="file" accept=".md,text/markdown,text/plain" hidden onChange={handleGroupsFile} />
                <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => fileRef.current?.click()}>
                  Cargar grupos (.md)
                </Button>
              </Paper>
            )}

            {groups === null && (
              <Alert severity="warning" sx={{ mb: 2.5 }}>
                {isTeacher
                  ? `Todavía no hay grupos de ${courseName}. Carga el .md con «Cargar grupos».`
                  : 'El profesor todavía no ha cargado los grupos de este curso. Vuelve más tarde.'}
              </Alert>
            )}

            <Typography sx={{ color: theme.textSecondary, mb: 2.5, fontSize: '0.95rem' }}>
              Franjas de 30 minutos, presenciales o virtuales. Escoge una libre, di qué grupo son y
              confirma en el resumen. Cada cuenta reserva una sola fecha, con al menos{' '}
              {BOOKING_LEAD_HOURS} horas de anticipación. Para cambiar de fecha, reserva otra franja
              con el mismo grupo: la anterior se libera sola. Quedan <strong>{freeCount}</strong>{' '}
              franjas libres.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 340px' }, gap: 3, alignItems: 'start' }}>
              <Box sx={{ display: 'grid', gap: 2.5 }}>
                {days.map((day) => (
                  <Paper key={day.date} elevation={0} sx={{ ...card, overflow: 'hidden' }}>
                    <Box sx={{ px: 2, py: 1.5, background: alpha(theme.accent, 0.1) }}>
                      <Typography sx={{ fontWeight: 700 }}>{day.label}</Typography>
                    </Box>
                    {day.cells.map(renderCell)}
                  </Paper>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  position: { md: 'sticky' },
                  top: { md: 88 },
                  maxHeight: { md: 'calc(100vh - 112px)' },
                  overflowY: { md: 'auto' },
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                <Paper elevation={0} sx={sidePanel}>
                  <Typography sx={{ fontWeight: 700, px: 2, pt: 2, pb: 1 }}>
                    Equipos sin fecha ({withoutDate.length})
                  </Typography>
                  <Box sx={sideList}>
                  {groups && withoutDate.length === 0 && (
                    <Typography sx={{ color: theme.success, fontSize: '0.9rem' }}>
                      Todos los equipos ya tienen fecha.
                    </Typography>
                  )}
                  {withoutDate.map((g) => (
                    <Box key={g.id} sx={{ py: 1, borderTop: `1px solid ${theme.border}` }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{g.name}</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                        {g.members.join(' · ')}
                      </Typography>
                    </Box>
                  ))}
                  </Box>
                </Paper>

                <Paper elevation={0} sx={sidePanel}>
                  <Typography sx={{ fontWeight: 700, px: 2, pt: 2, pb: 1 }}>
                    Equipos con fecha ({withDate.length})
                  </Typography>
                  <Box sx={sideList}>
                  {withDate.map(({ group, booking }) => {
                    const slot = SLOTS.find((s) => s.id === booking.slotId);
                    return (
                      <Box key={group.id} sx={{ py: 1, borderTop: `1px solid ${theme.border}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{group.name}</Typography>
                          <ModalityChip modality={booking.modality} />
                        </Box>
                        <Typography sx={{ fontSize: '0.8rem', color: theme.textSecondary, mt: 0.25 }}>
                          {slot ? formatSlot(slot) : booking.slotId}
                        </Typography>
                      </Box>
                    );
                  })}
                  </Box>
                </Paper>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <BookingDialog
        open={Boolean(dialogSlot)}
        slot={dialogSlot}
        courseName={courseName}
        groupOptions={groupOptions}
        user={user}
        defaultGroupId={myGroupId}
        lockedGroupId={isTeacher ? null : myGroupId}
        onClose={() => setDialogSlot(null)}
        onConfirm={handleConfirm}
      />

      <Dialog open={Boolean(toRelease)} onClose={releasing ? undefined : () => setToRelease(null)}>
        <DialogTitle>¿Liberar la franja?</DialogTitle>
        <DialogContent>
          <Typography>
            {toRelease?.groupName} queda sin fecha y la franja vuelve a estar disponible para
            cualquiera de los tres cursos.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToRelease(null)} disabled={releasing}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleRelease} disabled={releasing}>
            Liberar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgendaPage;
