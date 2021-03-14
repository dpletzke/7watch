import { useMemo } from "react";
import { observer } from "mobx-react-lite";

import { useGridStore } from "../../contexts";

const Square = observer((props) => {
  const { columnIndex, rowIndex } = props;
  const gridStore = useGridStore();

  const [deviceId, observationId] = useMemo(() => {
    return gridStore.getIds(columnIndex, rowIndex);
  }, [columnIndex, gridStore, rowIndex]);

  let value;

  if (columnIndex === 0) {
    value = deviceId;
  } else if (rowIndex === 0) {
    value = gridStore.observations.get(observationId).common;
  } else {
    value = gridStore.getValue(deviceId, observationId);
  }

  return (
      <div>{value}</div>
  );
})

export default Square;