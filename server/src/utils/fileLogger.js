const fs = require("fs");

const { getLogFilePath } = require("./pathUtils");

const {
  getLogBuffer,
  isLogBufferEmpty,
  resetLogBuffer,
} = require("./logBufferUtils");

const writeLogsToFile = () => {
  console.log("Writing logs to file...");

  if (isLogBufferEmpty()) return;

  const logFilePath = getLogFilePath();

  const logsToWrite = getLogBuffer().join("\n") + "\n";

  fs.appendFile(logFilePath, logsToWrite, (err) => {
    if (err) {
      console.error("Error writing logs to file:", err.message);
    } else {
      console.log("Logs written successfully!");

      resetLogBuffer();
    }
  });
};

module.exports = { writeLogsToFile };
