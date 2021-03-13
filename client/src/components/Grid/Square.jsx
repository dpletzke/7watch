import { useMemo } from "react";
import { observer } from "mobx-react-lite";

import { useGridStore } from "../../contexts";

export default function Square(props) {
  const { columnIndex, rowIndex } = props;
  const gridStore = useGridStore();

  const [deviceId, observationId] = useMemo(() => {
    return gridStore.getIds(columnIndex, rowIndex);
  }, [columnIndex, gridStore, rowIndex]);

  if (columnIndex === 0) {
    return observer(gridStore.deviceIds[rowIndex]);
  }

  if (rowIndex === 0) {
    return observer(gridStore.observations.entries()[rowIndex].common);
  }

  return observer(gridStore.getValue(deviceId, observationId));
}
