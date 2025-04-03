const cron = require("node-cron");

let logBuffer = [];
let tasks = [];

const isLogBufferEmpty = () => logBuffer.length === 0;

const resetLogBuffer = () => {
  logBuffer = [];
};

const addLogToBuffer = (log) => {
  logBuffer.push(log);
};

const getLogBuffer = () => logBuffer;

const startTask = (schedule, taskFunction) => {
  const task = cron.schedule(schedule, taskFunction);
  tasks.push(task);
  return task;
};

const stopAllTasks = () => {
  tasks.forEach((task) => task.stop());
  tasks = [];
};

module.exports = {
  isLogBufferEmpty,
  resetLogBuffer,
  addLogToBuffer,
  getLogBuffer,
  startTask,
  stopAllTasks,
};
