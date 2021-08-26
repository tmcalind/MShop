import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setObjectIdListSelected,
  setObjectIdList,
  setObjectId,
} from "../slices/featureSlice";

import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { useRowSelect, useTable, usePagination } from "react-table";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import PrintIcon from "@material-ui/icons/Print";
import Badge from "@material-ui/core/Badge";
import { FiX as ClearIcon, FiMap as MapIcon } from "react-icons/fi";
import {
  MdFirstPage as FirstPageIcon,
  MdLastPage as LastPageIcon,
} from "react-icons/md";
import {
  GrFormPrevious as PreviousIcon,
  GrFormNext as NextIcon,
  GrCheckboxSelected as CheckboxSelectedIcon,
  GrUserWorker as WorkorderIcon,
} from "react-icons/gr";

import PrintDialog from "./PrintDialog";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const columns = [
  {
    Header: "Meter",
    columns: [
      {
        Header: "Number",
        accessor: "MeterNumber",
      },
      {
        Header: "Address",
        accessor: "PremiseAddress",
      },
    ],
  },

  {
    Header: "Status",
    columns: [
      {
        Header: "Current",
        accessor: "Status",
      },
      {
        Header: "Date",
        accessor: "StatusDate",
      },
    ],
  },
];

const Table = ({ columns, data }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [dense] = useState(true);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const clearHandler = () => {
    dispatch(setObjectId(null));
    dispatch(setObjectIdList([]));
    dispatch(setObjectIdListSelected([]));
  };

  const mapSelectedHandler = (selectedItems) => {
    const objListSelected = selectedItems.map((item) => item.original.OBJECTID);
    dispatch(setObjectIdListSelected(objListSelected));
  };

  const printHandler = (selectedItems) => {
    const objListSelected = selectedItems.map((item) => item.original.OBJECTID);
    dispatch(setObjectIdListSelected(objListSelected));
    setPrintDialogOpen(true);
  };

  const createWorkordersHandler = (selectedItems) => {};

  const getRowDataHandler = (data) => {
    dispatch(setObjectId(data.OBJECTID));
  };

  return (
    <>
      {selectedFlatRows.length > 0 ? (
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                edge="start"
                color="inherit"
              >
                <Badge 
                  badgeContent={selectedFlatRows.length} 
                  max={999} 
                  color="primary"
                >
                  <CheckboxSelectedIcon />
                </Badge>
              </IconButton>

              <IconButton
                onClick={() => printHandler(selectedFlatRows)}
                className={classes.menuButton}
                edge="start"
                color="inherit"
              >
                <PrintIcon />
              </IconButton>
              <PrintDialog
                open={printDialogOpen}
                onClose={() => setPrintDialogOpen(false)}
              />
              <IconButton
                onClick={() => createWorkordersHandler(selectedFlatRows)}
                className={classes.menuButton}
                edge="start"
                color="inherit"
              >
                <WorkorderIcon />
              </IconButton>
              <IconButton
                onClick={() => mapSelectedHandler(selectedFlatRows)}
                className={classes.menuButton}
                edge="start"
                color="inherit"
              >
                <MapIcon />
              </IconButton>
            </Toolbar>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={2}>
            <Toolbar>
              <IconButton
                onClick={clearHandler}
                className={classes.menuButton}
                edge="end"
                color="inherit"
              >
                <ClearIcon />
              </IconButton>
            </Toolbar>
          </Grid>
        </Grid>
      ) : (
        // <div className={classes.root}>

        // </div>
        <>
          <Grid container spacing={0}>
            <Grid item xs={4}></Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={2}>
              <Toolbar>
                <IconButton
                  onClick={clearHandler}
                  className={classes.menuButton}
                  edge="end"
                  color="inherit"
                >
                  <ClearIcon />
                </IconButton>
              </Toolbar>
            </Grid>
          </Grid>
        </>
      )}
      <MaUTable {...getTableProps()} size={dense ? "small" : "medium"}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                onClick={() => getRowDataHandler(row.original)}
              >
                {row.cells.map((cell) => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MaUTable>
      <div>
        <IconButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <FirstPageIcon />
        </IconButton>
        <IconButton onClick={() => previousPage()} disabled={!canPreviousPage}>
          <PreviousIcon />
        </IconButton>
        <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
          <NextIcon />
        </IconButton>
        <IconButton
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <LastPageIcon />
        </IconButton>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
          {` (${data.length} total) `}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        {" per page"}
      </div>
      {/* <div>
        <pre>
          <code>
            {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                "selectedFlatRows[].original": selectedFlatRows.map(
                  (d) => d.original
                ),
              },
              null,
              2
            )}
          </code>
        </pre>
      </div> */}
    </>
  );
};

const MeterList = () => {
  const objectIdList = useSelector((state) => state.feature.objectIdList);

  const [meters, setMeters] = useState([]);

  useEffect(() => {
    if (objectIdList && objectIdList.length > 0) {
      // fetch feature info
      queryFeatures({
        url: "https://citymapdev/arcgisa/rest/services/WaterMeters/FeatureServer/0",
        objectIds: objectIdList,
      }).then((response) => {
        const featureAttributes = response.features.map(
          (item) => item.attributes
        );
        setMeters(featureAttributes);
      });
    }
  }, [objectIdList]);

  return (
    <>
      <CssBaseline />
      <Table columns={columns} data={meters} />
    </>
  );
};

export default MeterList;
