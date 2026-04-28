import { useState, useMemo, useCallback } from 'react';
import rawData from './flights.json';

// flights.json may be a plain array OR wrapped e.g. { "flights": [...] }
const normalize = (data) => {
  if (Array.isArray(data)) return data;
  const firstArray = Object.values(data).find(Array.isArray);
  return firstArray ?? [];
};
const flightsData = normalize(rawData);

const SIMULATE_FAIL_RATE = 0.2; // 20% random save failure for realism

export default function useFlights() {
  const [flights, setFlights] = useState(() => flightsData);
  const [selected, setSelected] = useState(new Set());

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Per-row async state: null | 'saving' | 'error'
  const [rowState, setRowState] = useState({});

  // Filters & search
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    days: [],       // number[]
    status: '',     // '' | 'Active' | 'Inactive'
    aoc: '',
    bodyType: '',
  });

  // ─── Derived: filtered & searched list ───────────────────────────────────────
  const filteredFlights = useMemo(() => {
    const q = search.trim().toLowerCase();

    console.log('Raw data loaded:', flights, 'Filters:', filters, 'Search:', q);
    return flights.filter((f) => {
      // Search: flight number, origin, destination
      if (q) {
        const hit =
          f.flightNumber.toLowerCase().includes(q) ||
          f.origin.toLowerCase().includes(q) ||
          f.destination.toLowerCase().includes(q);
        if (!hit) return false;
      }

      // Date range overlap: flight [startDate, endDate] ∩ [dateFrom, dateTo]
      if (filters.dateFrom && f.endDate < filters.dateFrom) return false;
      if (filters.dateTo && f.startDate > filters.dateTo) return false;

      // Days of operation: at least one selected day must be in the flight's days
      if (filters.days.length > 0) {
        const overlap = filters.days.some((d) => f.daysOfOperation.includes(d));
        if (!overlap) return false;
      }

      if (filters.status && f.status !== filters.status) return false;
      if (filters.aoc && f.aoc !== filters.aoc) return false;
      if (filters.bodyType && f.bodyType !== filters.bodyType) return false;

      return true;
    });
  }, [flights, search, filters]);

  // ─── AOC options (derived from all flights, not filtered) ────────────────────
  const aocOptions = useMemo(
    () => [...new Set(flights.map((f) => f.aoc))].sort(),
    [flights]
  );

  // ─── Inline edit ─────────────────────────────────────────────────────────────
  const startEdit = useCallback((flight) => {
    setEditingId(flight.id);
    setEditValues({
      startDate: flight.startDate,
      endDate: flight.endDate,
      std: flight.std,
      sta: flight.sta,
      status: flight.status,
    });
    // Clear any previous error for this row
    setRowState((s) => ({ ...s, [flight.id]: null }));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValues({});
  }, []);

  const saveEdit = useCallback(
    async (id) => {
      const snapshot = { ...editValues };
      setRowState((s) => ({ ...s, [id]: 'saving' }));

      // Simulate async save (800ms)
      await new Promise((r) => setTimeout(r, 800));

      // Simulate occasional failure
      if (Math.random() < SIMULATE_FAIL_RATE) {
        setRowState((s) => ({ ...s, [id]: 'error' }));
        // Auto-clear error after 3s
        setTimeout(() => setRowState((s) => ({ ...s, [id]: null })), 3000);
        return; // values NOT applied; row reverts visually because we didn't update state
      }

      setFlights((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...snapshot } : f))
      );
      setRowState((s) => ({ ...s, [id]: null }));
      setEditingId(null);
      setEditValues({});
    },
    [editValues]
  );

  // ─── Status toggle ────────────────────────────────────────────────────────────
  const toggleStatus = useCallback((id) => {
    setFlights((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' }
          : f
      )
    );
  }, []);

  // ─── Delete ───────────────────────────────────────────────────────────────────
  const deleteFlight = useCallback((id) => {
    if (editingId === id) {
      setEditingId(null);
      setEditValues({});
    }
    setFlights((prev) => prev.filter((f) => f.id !== id));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  }, [editingId]);

  const deleteSelected = useCallback(() => {
    setFlights((prev) => prev.filter((f) => !selected.has(f.id)));
    if (selected.has(editingId)) {
      setEditingId(null);
      setEditValues({});
    }
    setSelected(new Set());
  }, [selected, editingId]);

  // ─── Selection ────────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((id) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selected.size === filteredFlights.length && filteredFlights.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredFlights.map((f) => f.id)));
    }
  }, [selected.size, filteredFlights]);

  // ─── Clear filters ────────────────────────────────────────────────────────────
  const clearFilters = useCallback(() => {
    setFilters({ dateFrom: '', dateTo: '', days: [], status: '', aoc: '', bodyType: '' });
    setSearch('');
  }, []);

  const hasActiveFilters =
    search ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.days.length > 0 ||
    filters.status ||
    filters.aoc ||
    filters.bodyType;

  return {
    // Data
    flights: filteredFlights,
    totalCount: flights.length,
    aocOptions,

    // Selection
    selected,
    toggleSelect,
    toggleSelectAll,

    // Edit
    editingId,
    editValues,
    setEditValues,
    startEdit,
    cancelEdit,
    saveEdit,
    rowState,

    // Actions
    toggleStatus,
    deleteFlight,
    deleteSelected,

    // Filters
    search,
    setSearch,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
  };
}