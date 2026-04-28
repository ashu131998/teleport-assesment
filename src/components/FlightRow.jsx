import React, { memo } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Switch,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { COLUMNS } from './tableConfig';

const DAY_LABELS = ['', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function formatDays(days) {
  if (!days || !Array.isArray(days)) return '—';
  return days
    .slice()
    .sort((a, b) => a - b)
    .map((d) => DAY_LABELS[d] ?? '')
    .join(' ');
}

function Cell({ width, children, sx }) {
  return (
    <Box
      sx={{
        width,
        minWidth: width,
        maxWidth: width,
        px: 0.75,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

// Compact text input for edit mode
function EditText({ value, onChange, type = 'text', width = 100 }) {
  return (
    <TextField
      size="small"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width }}
      inputProps={{ style: { fontSize: 12, padding: '4px 6px' } }}
      InputLabelProps={{ shrink: true }}
    />
  );
}

const FlightRow = memo(function FlightRow({
  flight,
  style,
  isEditing,
  editValues,
  setEditValues,
  startEdit,
  cancelEdit,
  saveEdit,
  rowState,
  toggleStatus,
  deleteFlight,
  isSelected,
  toggleSelect,
}) {
  const state = rowState[flight.id] ?? null; // null | 'saving' | 'error'
  const isSaving = state === 'saving';
  const hasError = state === 'error';

  const set = (key, value) => setEditValues((prev) => ({ ...prev, [key]: value }));

  // Background colour logic
  let bgColor = 'background.paper';
  if (hasError) bgColor = '#fff5f5';
  else if (isSelected) bgColor = 'action.selected';
  else if (isEditing) bgColor = '#f8f9ff';

  return (
    <Box
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: isEditing ? 'primary.200' : 'divider',
        bgcolor: bgColor,
        outline: isEditing ? '2px solid' : hasError ? '1px solid' : 'none',
        outlineColor: isEditing ? 'primary.300' : 'error.300',
        outlineOffset: '-1px',
        opacity: isSaving ? 0.7 : 1,
        transition: 'background-color 0.15s, opacity 0.2s',
        pointerEvents: isSaving ? 'none' : 'auto',
        position: 'relative',
      }}
    >
      {/* Saving overlay bar */}
      {isSaving && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: 'primary.main',
            animation: 'pulse 1s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.4 },
              '100%': { opacity: 1 },
            },
          }}
        />
      )}

      {/* ── Checkbox ── */}
      <Cell width={COLUMNS[0].width}>
      </Cell>

      {/* ── ID ── */}
      <Cell width={COLUMNS[1].width} sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'monospace' }}>
        {flight.id}
      </Cell>

      {/* ── Flight number ── */}
      <Cell width={COLUMNS[2].width} sx={{ fontWeight: 600, fontSize: 13 }}>
        {flight.flightNumber}
      </Cell>

      {/* ── AOC ── */}
      <Cell width={COLUMNS[3].width} sx={{ fontSize: 13 }}>
        {flight.aoc}
      </Cell>

      {/* ── Origin ── */}
      <Cell width={COLUMNS[4].width} sx={{ fontWeight: 500, fontSize: 13 }}>
        {flight.origin}
      </Cell>

      {/* ── Destination ── */}
      <Cell width={COLUMNS[5].width} sx={{ fontWeight: 500, fontSize: 13 }}>
        {flight.destination}
      </Cell>

      {/* ── STD (editable: time) ── */}
      <Cell width={COLUMNS[6].width}>
        {isEditing
          ? <EditText type="time" value={editValues.std ?? ''} onChange={(v) => set('std', v)} width={86} />
          : <Box sx={{ fontSize: 13 }}>{flight.std}</Box>
        }
      </Cell>

      {/* ── STA (editable: time) ── */}
      <Cell width={COLUMNS[7].width}>
        {isEditing
          ? <EditText type="time" value={editValues.sta ?? ''} onChange={(v) => set('sta', v)} width={86} />
          : <Box sx={{ fontSize: 13 }}>{flight.sta}</Box>
        }
      </Cell>

      {/* ── Days ── */}
      <Cell width={COLUMNS[8].width} sx={{ fontSize: 12, color: 'text.secondary', letterSpacing: 0.3 }}>
        {formatDays(flight.daysOfOperation)}
      </Cell>

      {/* ── Body type ── */}
      <Cell width={COLUMNS[9].width}>
        <Chip
          label={flight.bodyType === 'narrow_body' ? 'Narrow' : 'Wide'}
          size="small"
          variant="outlined"
          sx={{ fontSize: 11, height: 20 }}
        />
      </Cell>

      {/* ── Start date (editable: date) ── */}
      <Cell width={COLUMNS[10].width}>
        {isEditing
          ? <EditText type="date" value={editValues.startDate ?? ''} onChange={(v) => set('startDate', v)} width={116} />
          : <Box sx={{ fontSize: 12 }}>{flight.startDate}</Box>
        }
      </Cell>

      {/* ── End date (editable: date) ── */}
      <Cell width={COLUMNS[11].width}>
        {isEditing
          ? <EditText type="date" value={editValues.endDate ?? ''} onChange={(v) => set('endDate', v)} width={116} />
          : <Box sx={{ fontSize: 12 }}>{flight.endDate}</Box>
        }
      </Cell>

      {/* ── Status (toggle in view / select in edit) ── */}
      <Cell width={COLUMNS[12].width}>
        {isEditing ? (
          <Select
            size="small"
            value={editValues.status ?? 'Active'}
            onChange={(e) => set('status', e.target.value)}
            sx={{ fontSize: 12, height: 30, minWidth: 110 }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={`Click to set ${flight.status === 'Active' ? 'Inactive' : 'Active'}`}>
              <Switch
                size="small"
                checked={flight.status === 'Active'}
                onChange={() => toggleStatus(flight.id)}
                color="success"
              />
            </Tooltip>
            <Box
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: flight.status === 'Active' ? 'success.dark' : 'text.disabled',
              }}
            >
              {flight.status}
            </Box>
          </Box>
        )}
      </Cell>

      {/* ── Actions ── */}
      <Cell width={COLUMNS[13].width} sx={{ gap: 0.5 }}>
        {isSaving ? (
          /* Saving state: spinner + label */
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} thickness={5} />
            <Box sx={{ fontSize: 11, color: 'text.secondary' }}>Saving…</Box>
          </Box>

        ) : isEditing ? (
          /* Edit mode: Save + Cancel */
          <>
            <Tooltip title="Save (applies changes to local state)">
              <IconButton
                size="small"
                color="success"
                onClick={() => saveEdit(flight.id)}
                sx={{ bgcolor: 'success.50', '&:hover': { bgcolor: 'success.100' } }}
              >
                <SaveIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel (discard changes)">
              <IconButton
                size="small"
                onClick={cancelEdit}
                sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
              >
                <CancelIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </>

        ) : (
          /* View mode: optional error icon + Edit + Delete */
          <>
            {hasError && (
              <Tooltip title="Save failed — original values restored">
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 0.25 }}>
                </Box>
              </Tooltip>
            )}
            <Tooltip title="Edit row">
              <IconButton size="small" onClick={() => startEdit(flight)}>
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete flight">
              <IconButton size="small" color="error" onClick={() => deleteFlight(flight.id)}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Cell>
    </Box>
  );
});

export default FlightRow;