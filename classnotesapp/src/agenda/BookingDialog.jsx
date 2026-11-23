// src/agenda/BookingDialog.jsx
//
// Modal de reserva en dos pasos: primero se escoge grupo, quién reserva y
// modalidad; después se muestra el resumen y solo ahí se confirma. No toca
// Firestore: recibe `onConfirm` y la página hace la escritura.

import React, { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { MODALITIES } from './agendaConfig';
import { formatDay, formatSlotTime, modalityLabel } from './agendaSlots';

const SummaryRow = ({ label, children }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 1.5, py: 0.75 }}>
    <Typography sx={{ fontSize: '0.85rem', opacity: 0.7 }}>{label}</Typography>
    <Box sx={{ fontSize: '0.95rem' }}>{children}</Box>
  </Box>
);

// groupOptions: [{ group, booking }] — booking es la reserva actual del grupo, si tiene.
const BookingDialog = ({
  open,
  slot,
  courseName,
  groupOptions,
  user,
  defaultGroupId,
  lockedGroupId,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState('form');
  const [groupId, setGroupId] = useState('');
  const [bookerName, setBookerName] = useState('');
  const [modality, setModality] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setStep('form');
    setGroupId(defaultGroupId ?? '');
    setBookerName('');
    setModality('');
    setError(null);
    setSaving(false);
  }, [open, slot?.id, defaultGroupId]);

  const selected = useMemo(
    () => groupOptions.find((o) => o.group.id === groupId) ?? null,
    [groupOptions, groupId],
  );

  const lockedOut = (option) => Boolean(lockedGroupId) && option.group.id !== lockedGroupId;
  const canPick = (option) =>
    !lockedOut(option) && (!option.booking || option.booking.bookedBy?.uid === user?.uid);
  const allowedModalities = MODALITIES.filter((m) => slot?.modalities?.includes(m.id) ?? true);
  const ready = selected && canPick(selected) && bookerName && modality;
  const moving = selected?.booking && selected.booking.slotId !== slot?.id;

  const handleConfirm = async () => {
    setSaving(true);
    setError(null);
    try {
      await onConfirm({ group: selected.group, bookerName, modality });
    } catch (err) {
      setError(err?.friendly ?? 'No se pudo reservar.');
      setSaving(false);
    }
  };

  if (!slot) return null;

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {step === 'form' ? 'Reservar franja' : 'Resumen de la reserva'}
      </DialogTitle>

      {step === 'form' && (
        <DialogContent dividers>
          <Typography sx={{ mb: 2.5 }}>
            <strong>{formatDay(slot.date)}</strong> · {formatSlotTime(slot)}
          </Typography>

          <FormControl fullWidth sx={{ mb: 2.5 }}>
            <InputLabel id="agenda-group-label">¿Qué grupo son?</InputLabel>
            <Select
              labelId="agenda-group-label"
              label="¿Qué grupo son?"
              value={groupId}
              onChange={(e) => { setGroupId(e.target.value); setBookerName(''); }}
              renderValue={(id) => groupOptions.find((o) => o.group.id === id)?.group.name ?? ''}
            >
              {groupOptions.map((o) => (
                <MenuItem
                  key={o.group.id}
                  value={o.group.id}
                  disabled={!canPick(o)}
                  sx={{ display: 'block', whiteSpace: 'normal', py: 1 }}
                >
                  <Typography component="div" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {o.group.name}
                    {lockedOut(o) && ' · ya reservaste para otro grupo'}
                    {!lockedOut(o) && o.booking && !canPick(o) && ' · ya tiene fecha'}
                    {o.booking && canPick(o) && ' · cambiar su fecha'}
                  </Typography>
                  <Typography component="div" sx={{ fontSize: '0.78rem', opacity: 0.7, mt: 0.25 }}>
                    {o.group.members.join(' · ')}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selected && (
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel id="agenda-booker-label">¿Quién eres?</InputLabel>
              <Select
                labelId="agenda-booker-label"
                label="¿Quién eres?"
                value={bookerName}
                onChange={(e) => setBookerName(e.target.value)}
              >
                {selected.group.members.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl>
            <FormLabel id="agenda-modality-label">Modalidad</FormLabel>
            <RadioGroup
              row
              aria-labelledby="agenda-modality-label"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
            >
              {allowedModalities.map((m) => (
                <FormControlLabel key={m.id} value={m.id} control={<Radio />} label={m.label} />
              ))}
            </RadioGroup>
          </FormControl>

          {moving && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Tu grupo ya tenía otra franja. Al confirmar, esa queda libre y se reserva esta.
            </Alert>
          )}
        </DialogContent>
      )}

      {step === 'summary' && selected && (
        <DialogContent dividers>
          <SummaryRow label="Curso">{courseName}</SummaryRow>
          <SummaryRow label="Grupo"><strong>{selected.group.name}</strong></SummaryRow>
          <SummaryRow label="Integrantes">
            {selected.group.members.map((m) => (
              <div key={m}>{m}</div>
            ))}
          </SummaryRow>
          <SummaryRow label="Fecha">{formatDay(slot.date)}</SummaryRow>
          <SummaryRow label="Hora">{formatSlotTime(slot)}</SummaryRow>
          <SummaryRow label="Modalidad">{modalityLabel(modality)}</SummaryRow>
          <SummaryRow label="Reserva">
            {bookerName}
            {user?.email && (
              <Typography component="div" sx={{ fontSize: '0.8rem', opacity: 0.7 }}>
                {user.email}
              </Typography>
            )}
          </SummaryRow>
          <Typography sx={{ fontSize: '0.8rem', opacity: 0.75, mt: 1.5 }}>
            Solo tú (con esta cuenta de Google) o el profesor podrán cambiar o liberar esta reserva.
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
      )}

      <DialogActions sx={{ px: 3, py: 2 }}>
        {step === 'form' ? (
          <>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" disabled={!ready} onClick={() => setStep('summary')}>
              Revisar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => { setStep('form'); setError(null); }} disabled={saving}>
              Volver
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            >
              Confirmar reserva
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;
