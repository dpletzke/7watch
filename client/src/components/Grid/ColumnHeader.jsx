import { observer } from "mobx-react-lite";

import { useGridStore } from "../../contexts";

const ColumnHeader = observer((props) => {
  const { columnIndex } = props;
  const gridStore = useGridStore();

  const observation = gridStore.getObservationFromIndex(columnIndex - 1);
  const title = `${observation.id} - ${observation.full}`;
  const value = observation.common;

  return (
    <div className="header column" title={title}>
      {value}
    </div>
  );
});

export default ColumnHeader;
