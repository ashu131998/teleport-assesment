export const COLUMNS = [
    { key: 'check',     label: '',        width: 20  },
    { key: 'id',        label: 'ID',      width: 60 },
    { key: 'flight',    label: 'Flight',  width: 80 },
    { key: 'aoc',       label: 'AOC',     width: 60  },
    { key: 'origin',    label: 'Origin',  width: 60  },
    { key: 'dest',      label: 'Dest',    width: 60  },
    { key: 'std',       label: 'STD',     width: 90  },
    { key: 'sta',       label: 'STA',     width: 90  },
    { key: 'days',      label: 'Days',    width: 120 },
    { key: 'body',      label: 'Body',    width: 100 },
    { key: 'startDate', label: 'Start',   width: 120 },
    { key: 'endDate',   label: 'End',     width: 120 },
    { key: 'status',    label: 'Status',  width: 140 },
    { key: 'actions',   label: 'Actions', width: 115 },
  ];
  
  export const TOTAL_WIDTH = COLUMNS.reduce((s, c) => s + c.width, 0);
  export const ROW_HEIGHT = 52;