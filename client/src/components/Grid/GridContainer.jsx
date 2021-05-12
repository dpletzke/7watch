/** @flow */
// import Immutable from "immutable";
// import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { AutoSizer, MultiGrid } from "react-virtualized";
import { observer } from "mobx-react-lite";

import styles from "../../assets/css/MultiGrid.css";

import Square from "./Square";
import RowHeader from "./RowHeader";
import ColumnHeader from "./ColumnHeader";

import {
  initialDeviceIds,
  initialObservations,
} from "../../contexts/initialGrid";
import { useGridStore } from "../../contexts";

const STYLE = {
  border: "1px solid #ddd",
};
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: "2px solid #aaa",
  backgroundColor: "#f7f7f7",
};
const STYLE_TOP_LEFT_GRID = {
  borderBottom: "2px solid #aaa",
  borderRight: "2px solid #aaa",
  fontWeight: "bold",
};
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: "2px solid #aaa",
  fontWeight: "bold",
};

const GridContainer = observer(() => {
  const gridStore = useGridStore();

  // for testing
  useEffect(() => {
    gridStore.destroyAll();
    gridStore.addDevices(initialDeviceIds);
    gridStore.addObservations(initialObservations);
  });

  const _cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const indices = { columnIndex, rowIndex };
    let cellContent;

    if (columnIndex === 0 && rowIndex === 0) {
      cellContent = "Table";
    } else if (columnIndex === 0) {
      cellContent = <RowHeader {...indices} />;
    } else if (rowIndex === 0) {
      cellContent = <ColumnHeader {...indices} />;
    } else {
      cellContent = <Square {...indices} />;
    }
    return (
      <div className={styles.Cell} key={key} style={style}>
        {cellContent}
      </div>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <MultiGrid
          fixedColumnCount={1}
          fixedRowCount={1}
          scrollToColumn={0}
          scrollToRow={0}
          cellRenderer={_cellRenderer}
          columnWidth={({ index }) => (index === 0 ? 150 : 100)}
          columnCount={gridStore.observations.size + 1}
          enableFixedColumnScroll
          enableFixedRowScroll
          height={height}
          rowHeight={({ index }) => (index === 0 ? 50 : 20)}
          rowCount={gridStore.deviceIds.size + 1}
          style={STYLE}
          styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
          styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
          styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
          width={width}
          hideTopRightGridScrollbar
          hideBottomLeftGridScrollbar
        />
      )}
    </AutoSizer>
  );
});

export default GridContainer;
