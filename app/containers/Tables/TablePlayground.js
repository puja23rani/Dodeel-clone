import React, { useState } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import { PapperBlock } from "enl-components";
import EnhancedTableHead from "enl-components/Tables/tableParts/TableHeader";
import EnhancedTableToolbar from "enl-components/Tables/tableParts/TableToolbar";
import useStyles from "enl-components/Tables/tableStyle-jss";
import { injectIntl } from "react-intl";
import messages from "./messages";

function TablePlayground(props) {
  const {
    size = "small",
    styles = {},
    toolbarOptions = {},
    intl,
    columnData, // Passed from parent
    rowData, // Passed from parent
    page, // Passed from parent
    rowsPerPage, // Passed from parent
    onPageChange, // Function from parent to handle page change
    onRowsPerPageChange, // Function from parent to handle rows per page change
    title,
    pagination,
    count,
  } = props;

  const [selected, setSelected] = useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(rowData.map((n) => n.id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const thisIsSelected = (id) => selected.indexOf(id) !== -1;

  const { classes, cx } = useStyles();
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rowData.length - page * rowsPerPage);

  const renderCell = (dataArray, keyArray) =>
    keyArray.map((itemCell, index) => (
      <TableCell
        align="left"
        key={index.toString()}
        style={{ paddingLeft: "20px" }}
      >
        {dataArray[itemCell.id]}
      </TableCell>
    ));

  return (
    <div>
      <Grid container className={classes.rootTable}>
        <Grid item xs={12}>
          <Paper className={classes.rootTable}>
            {toolbarOptions.enabled && (
              <EnhancedTableToolbar title={title} placeholder="Search" />
            )}
            <div className={classes.tableWrapper}>
              <Table
                className={cx(
                  classes.table,
                  styles.hovered && classes.hover,
                  styles.stripped && classes.stripped,
                  styles.bordered && classes.bordered,
                  classes[size]
                )}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={rowData.length}
                  columnData={columnData}
                  checkcell={toolbarOptions.checkcell}
                />
                <TableBody>
                  {pagination ? (
                    <>
                      {" "}
                      {rowData.map((n) => {
                        const isSelected = thisIsSelected(n.id);
                        return (
                          <TableRow
                            role="checkbox"
                            tabIndex={-1}
                            key={n.id}
                            onClick={(event) => handleClick(event, n.id)}
                          >
                            {toolbarOptions.checkcell && (
                              <TableCell padding="checkbox" align="left">
                                <Checkbox checked={isSelected} />
                              </TableCell>
                            )}
                            {renderCell(
                              n,
                              columnData.filter((col) => col.id !== "actions")
                            )}
                            {/* Manually render the action buttons for the "Action" column */}
                            <TableCell align="center">{n.actions}</TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {" "}
                      {rowData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((n) => {
                          const isSelected = thisIsSelected(n.id);
                          return (
                            <TableRow
                              role="checkbox"
                              tabIndex={-1}
                              key={n.id}
                              onClick={(event) => handleClick(event, n.id)}
                            >
                              {toolbarOptions.checkcell && (
                                <TableCell padding="checkbox" align="left">
                                  <Checkbox checked={isSelected} />
                                </TableCell>
                              )}
                              {renderCell(
                                n,
                                columnData.filter((col) => col.id !== "actions")
                              )}
                              {/* Manually render the action buttons for the "Action" column */}
                              <TableCell align="center">{n.actions}</TableCell>
                            </TableRow>
                          );
                        })}
                    </>
                  )}

                  {/* {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )} */}
                </TableBody>
              </Table>
            </div>
            {pagination ? (
              <>
                {" "}
                {toolbarOptions.pagination && (
                  <TablePagination
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                  />
                )}
              </>
            ) : (
              <>
                {" "}
                {toolbarOptions.pagination && (
                  <TablePagination
                    component="div"
                    count={rowData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                  />
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

TablePlayground.propTypes = {
  intl: PropTypes.object.isRequired,
  size: PropTypes.string,
  title: PropTypes.string,
  styles: PropTypes.shape({
    bordered: PropTypes.bool,
    stripped: PropTypes.bool,
    hovered: PropTypes.bool,
  }),
  toolbarOptions: PropTypes.shape({
    enabled: PropTypes.bool,
    checkcell: PropTypes.bool,
    pagination: PropTypes.bool,
  }),
  columnData: PropTypes.array.isRequired, // New Prop
  rowData: PropTypes.array.isRequired, // New Prop
  page: PropTypes.number.isRequired, // New Prop
  rowsPerPage: PropTypes.number.isRequired, // New Prop
  count: PropTypes.number.isRequired, // New Prop
  onPageChange: PropTypes.func.isRequired, // New Prop
  onRowsPerPageChange: PropTypes.func.isRequired, // New Prop
  pagination: PropTypes.bool,
};

TablePlayground.defaultProps = {
  size: "small",
  styles: {
    bordered: true,
    stripped: true,
    hovered: true,
  },
  toolbarOptions: {
    enabled: true,
    checkcell: false,
    pagination: true,
  },
};

export default injectIntl(TablePlayground);
