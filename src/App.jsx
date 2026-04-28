import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';

import useFlights from './hooks/useFlights';
import { FlightFilters } from './components/FlightFilters';
import FlightTable from './components/FlightTable';

export default function App() {
  const flightData = useFlights();

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, md: 3 } }}>
      {/* ── Page header ────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 3,
        }}
      >
        <FlightIcon color="primary" sx={{ fontSize: 30 }} />
        <Box>
          <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
            Flight Schedule Management
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {flightData.totalCount} total records · client-side operations
          </Typography>
        </Box>
      </Box>

      {/* ── Filters panel ──────────────────────────────────────────────── */}
      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 2, borderRadius: 2 }}
      >
        <FlightFilters
          filters={flightData.filters}
          setFilters={flightData.setFilters}
          search={flightData.search}
          setSearch={flightData.setSearch}
          clearFilters={flightData.clearFilters}
          hasActiveFilters={flightData.hasActiveFilters}
          aocOptions={flightData.aocOptions}
        />
      </Paper>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <FlightTable
        flights={flightData.flights}
        selected={flightData.selected}
        toggleSelect={flightData.toggleSelect}
        toggleSelectAll={flightData.toggleSelectAll}
        editingId={flightData.editingId}
        editValues={flightData.editValues}
        setEditValues={flightData.setEditValues}
        startEdit={flightData.startEdit}
        cancelEdit={flightData.cancelEdit}
        saveEdit={flightData.saveEdit}
        rowState={flightData.rowState}
        toggleStatus={flightData.toggleStatus}
        deleteFlight={flightData.deleteFlight}
        deleteSelected={flightData.deleteSelected}
      />
    </Container>
  );
}