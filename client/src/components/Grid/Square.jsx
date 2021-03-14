import { useMemo } from "react";
import { observer } from "mobx-react-lite";

import { useGridStore } from "../../contexts";

const Square = observer((props) => {
  const { columnIndex, rowIndex } = props;
  const gridStore = useGridStore();

  const [deviceId, observationId] = useMemo(() => {
    // offset row and column index for header columns
    const ids = gridStore.getIds(rowIndex - 1, columnIndex - 1);
    return ids;
  }, [columnIndex, gridStore, rowIndex]);

  let value;
  if (columnIndex === 0 && rowIndex === 0) {
    value = "Table";
  } else if (columnIndex === 0 && deviceId) {
    value = deviceId;
  } else if (rowIndex === 0 && gridStore.observations.get(observationId)) {
    value = gridStore.observations.get(observationId).common;
  } else if (deviceId && gridStore.observations.get(observationId)) {
    value = gridStore.getValue(deviceId, observationId);
  }

  return <div>{value}</div>;
});

export default Square;
