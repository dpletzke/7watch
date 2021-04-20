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

  const title = `${deviceId} - ${observationId}`;
  const value = gridStore.getValue(deviceId, observationId);

  return <div title={title}>{value}</div>;
});

export default Square;
