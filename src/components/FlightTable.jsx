import React, { useRef, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { DeleteSweep as DeleteSweepIcon } from '@mui/icons-material';

import FlightRow from './FlightRow';
import { COLUMNS, TOTAL_WIDTH, ROW_HEIGHT } from './tableConfig';

const TABLE_HEIGHT = 580;

// ── Minimal self-contained virtual scroller ───────────────────────────────────
// Avoids react-window API instability across versions.
function VirtualList({ itemCount, itemSize, height, width, children: RowComp, overscan = 8 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef(null);

  const onScroll = useCallback((e) => setScrollTop(e.currentTarget.scrollTop), []);

  const startIdx = Math.max(0, Math.floor(scrollTop / itemSize) - overscan);
  const visibleCount = Math.ceil(height / itemSize);
  const endIdx = Math.min(itemCount - 1, startIdx + visibleCount + overscan);

  const items = [];
  for (let i = startIdx; i <= endIdx; i++) {
    items.push(
      <RowComp
        key={i}
        index={i}
        style={{
          position: 'absolute',
          top: i * itemSize,
          left: 0,
          width: '100%',
          height: itemSize,
        }}
      />
    );
  }

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      style={{ height, width: "auto", overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}
    >
      <div style={{ height: itemCount * itemSize, position: 'relative' }}>
        {items}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function FlightTable({
  flights,
  selected,
  toggleSelect,
  toggleSelectAll,
  editingId,
  editValues,
  setEditValues,
  startEdit,
  cancelEdit,
  saveEdit,
  rowState,
  toggleStatus,
  deleteFlight,
  deleteSelected,
}) {

  const RowRenderer = useCallback(
    ({ index, style }) => {
      const flight = flights[index];
      if (!flight) return null;
      return (
        <FlightRow
          flight={flight}
          style={style}
          isEditing={editingId === flight.id}
          editValues={editValues}
          setEditValues={setEditValues}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          rowState={rowState}
          toggleStatus={toggleStatus}
          deleteFlight={deleteFlight}
          isSelected={selected.has(flight.id)}
          toggleSelect={toggleSelect}
        />
      );
    },
    [flights, editingId, editValues, rowState, selected,
     setEditValues, startEdit, cancelEdit, saveEdit, toggleStatus, deleteFlight, toggleSelect]
  );

  return (
    <Box>
      {/* Multi-select toolbar */}
      {selected.size > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
            px: 2,
            py: 1,
            bgcolor: 'action.selected',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
          }}
        >
          <Chip label={`${selected.size} selected`} size="small" color="primary" />
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteSweepIcon />}
            onClick={deleteSelected}
          >
            Delete Selected
          </Button>
        </Box>
      )}

      {/* Table container */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', height:"63vh" }}>

        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'grey.100',
            borderBottom: '2px solid',
            borderColor: 'divider',
            height: 44,
            minWidth: TOTAL_WIDTH,
          }}
        >
          <Box sx={{ width: COLUMNS[0].width, minWidth: COLUMNS[0].width, px: 0.75, flexShrink: 0 }}>

          </Box>
          {COLUMNS.slice(1).map((col) => (
            <Box
              key={col.key}
              sx={{
                width: col.width,
                minWidth: col.width,
                maxWidth: col.width,
                px: 0.75,
                fontWeight: 700,
                fontSize: 11,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {col.label}
            </Box>
          ))}
        </Box>

        {/* Body */}
        {flights.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
              color: 'text.secondary',
              gap: 1,
            }}
          >
            <Typography variant="body2">No flights match your filters.</Typography>
            <Typography variant="caption">Try adjusting the search or filter criteria.</Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <VirtualList
              height={TABLE_HEIGHT}
              itemCount={flights.length}
              itemSize={ROW_HEIGHT}
              width={TOTAL_WIDTH}
            >
              {RowRenderer}
            </VirtualList>
          </Box>
        )}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
        {flights.length} flight{flights.length !== 1 ? 's' : ''} shown
      </Typography>
    </Box>
  );
}