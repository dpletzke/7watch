/** @flow */
// import Immutable from "immutable";
// import PropTypes from "prop-types";
import * as React from "react";
import { AutoSizer, MultiGrid } from "react-virtualized";
import styles from "../../assets/css/MultiGrid.css";

import Square from "./Square";
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


export default function GridContainer() {
  const gridStore = useGridStore();

  const _cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    return (
      <div className={styles.Cell} key={key} style={style}>
        <Square {...{ columnIndex, rowIndex }} />
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
          columnWidth={60}
          columnCount={gridStore.observations.size() + 1}
          enableFixedColumnScroll
          enableFixedRowScroll
          height={height}
          rowHeight={20}
          rowCount={gridStore.deviceIds.length + 1}
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
}
