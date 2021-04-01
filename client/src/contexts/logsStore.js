import { nanoid } from "nanoid";

export function createLogsStore() {
  return {
    logs: [],
    addLog(log) {
      this.logs.push({
        ...log,
        id: nanoid(),
      });
    },
    removeLog(id) {
      this.logs = this.logs.filter((log) => log.id !== id);
    },
  };
}
