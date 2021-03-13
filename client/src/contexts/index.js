import { LogsProvider, useLogsStore } from "./logsContext";
import { GateProvider, useGateStore } from "./gateContext";
import { GridProvider, useGridStore } from "./gridContext";

export default function IndexProvider({ children }) {
  return (
    <GridProvider>
      <LogsProvider>
        <GateProvider>{children}</GateProvider>
      </LogsProvider>
    </GridProvider>
  );
}

export { useGateStore, useLogsStore, useGridStore };
