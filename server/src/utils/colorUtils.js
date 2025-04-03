const ANSI_COLORS = {
  red: "\x1b[31m",

  yellow: "\x1b[33m",

  cyan: "\x1b[36m",

  green: "\x1b[32m",

  reset: "\x1b[0m",
};

const getStatusColor = (status) => {
  if (status >= 500) return ANSI_COLORS.red;

  if (status >= 400) return ANSI_COLORS.yellow;

  if (status >= 300) return ANSI_COLORS.cyan;

  if (status >= 200) return ANSI_COLORS.green;

  return ANSI_COLORS.reset;
};

const colorizeStatus = (status) => {
  const color = getStatusColor(status);

  return `${color}${status}${ANSI_COLORS.reset}`;
};

module.exports = {
  ANSI_COLORS,
  getStatusColor,
  colorizeStatus,
};
