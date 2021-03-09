import { LogsProvider, useLogsStore } from "./logsContext";
import { GateProvider, useGateStore } from "./gateContext";

export default function IndexProvider({ children }) {
  return (
    <LogsProvider>
      <GateProvider>{children}</GateProvider>
    </LogsProvider>
  );
};

export {
  useGateStore,
  useLogsStore
}