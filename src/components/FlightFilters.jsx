import React from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    Stack,
    ListItemText,
    Button,
    OutlinedInput,
    InputAdornment,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

const DAYS = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 7, label: 'Sun' },
];

/**
 * FlightFilters
 *
 * Props:
 *  filters          { dateFrom, dateTo, days, status, aoc, bodyType }
 *  setFilters       (updater) => void
 *  search           string
 *  setSearch        (string) => void
 *  clearFilters     () => void
 *  hasActiveFilters boolean
 *  aocOptions       string[]
 */
export const FlightFilters = ({
    filters,
    setFilters,
    search,
    setSearch,
    clearFilters,
    hasActiveFilters,
    aocOptions,
}) => {
    const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                {/* ── Search ─────────────────────────────────────────────────────── */}
                <TextField
                    size="small"
                    placeholder="Search flight, origin, dest…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 220 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* ── Date range ─────────────────────────────────────────────────── */}
                <Stack sx={{mb:"20px"}}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 100 }}
                    >
                        From
                    </Typography>
                    <TextField
                        type="date"
                        size="small"
                        value={filters.dateFrom}
                        onChange={(e) => update('dateFrom', e.target.value)}
                        sx={{ minWidth: 145 }}
                    />
                </Stack>
                <Stack sx={{mb:"20px"}}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 100 }}
                    >
                        To
                    </Typography>
                    <TextField
                        type="date"
                        size="small"
                        value={filters.dateTo}
                        onChange={(e) => update('dateTo', e.target.value)}
                        sx={{ minWidth: 145 }}
                    />
                </Stack>

                {/* ── Days of operation ──────────────────────────────────────────── */}
                <FormControl size="small" sx={{ minWidth: 175 }}>
                    <InputLabel>Days of Operation</InputLabel>
                    <Select
                        multiple
                        value={filters.days}
                        onChange={(e) => update('days', e.target.value)}
                        input={<OutlinedInput label="Days of Operation" />}
                        renderValue={(selected) =>
                            selected
                                .sort()
                                .map((d) => DAYS.find((x) => x.value === d)?.label)
                                .join(', ')
                        }
                        MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
                    >
                        {DAYS.map((day) => (
                            <MenuItem key={day.value} value={day.value} dense>
                                <Checkbox
                                    checked={filters.days.includes(day.value)}
                                    size="small"
                                />
                                <ListItemText primary={day.label} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* ── Status ─────────────────────────────────────────────────────── */}
                <FormControl size="small" sx={{ minWidth: 125 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        onChange={(e) => update('status', e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>

                {/* ── AOC ────────────────────────────────────────────────────────── */}
                <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>AOC</InputLabel>
                    <Select
                        value={filters.aoc}
                        onChange={(e) => update('aoc', e.target.value)}
                        label="AOC"
                    >
                        <MenuItem value="">All</MenuItem>
                        {aocOptions.map((a) => (
                            <MenuItem key={a} value={a}>
                                {a}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* ── Body type ──────────────────────────────────────────────────── */}
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Body Type</InputLabel>
                    <Select
                        value={filters.bodyType}
                        onChange={(e) => update('bodyType', e.target.value)}
                        label="Body Type"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="narrow_body">Narrow Body</MenuItem>
                        <MenuItem value="wide_body">Wide Body</MenuItem>
                    </Select>
                </FormControl>

                {/* ── Clear all ──────────────────────────────────────────────────── */}
                {hasActiveFilters && (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<FilterListOffIcon />}
                        onClick={clearFilters}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        Clear All
                    </Button>
                )}
            </Box>
        </Box>
    );
}