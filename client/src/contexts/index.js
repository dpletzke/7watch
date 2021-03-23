import { LogsProvider, useLogsStore } from "./logsContext";
import { GateProvider, useGateStore } from "./gateContext";
import { GridProvider, useGridStore } from "./gridContext";

import { configure } from "mobx";

configure({
  // enforceActions: "always",
  // computedRequiresReaction: true,
  // reactionRequiresObservable: true,
  // observableRequiresReaction: true,
  // disableErrorBoundaries: true,
});

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
