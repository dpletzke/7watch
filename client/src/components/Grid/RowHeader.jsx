import { observer } from "mobx-react-lite";

import { useGridStore } from "../../contexts";

const RowHeader = observer((props) => {
  const { rowIndex } = props;
  const gridStore = useGridStore();
  const deviceId = gridStore.getDeviceFromIndex(rowIndex - 1);

  return <div>{deviceId}</div>;
});

export default RowHeader;
