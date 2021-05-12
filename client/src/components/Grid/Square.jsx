import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";

import { useGridStore } from "../../contexts";
import { autorun } from "mobx";

const Square = observer((props) => {
  const { columnIndex, rowIndex } = props;
  const gridStore = useGridStore();

  const [color, setColor] = useState('white');

  const [deviceId, observationId] = useMemo(() => {
    // offset row and column index for header columns
    const ids = gridStore.getIds(rowIndex - 1, columnIndex - 1);
    return ids;
  }, [columnIndex, gridStore, rowIndex]);

  useEffect(() => {
    let timer;
    autorun(() => {
      gridStore.getValue(deviceId, observationId);
      setColor('yellow');
      timer = setTimeout(() => {
        setColor('white');
      }, 2300);
    })
    return () => {
      clearInterval(timer);
    }
  }, []);
  
  const title = `${deviceId} - ${observationId}`;
  const value = gridStore.getValue(deviceId, observationId);
  


  return <div title={title} style={{backgroundColor: color}}>{value}</div>;
});

export default Square;
