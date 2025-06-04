//React Imports
import React, { useState } from "react";
import PropTypes from "prop-types";

//local
import useStyles from "../../../utils/styles/styles";
import { currencyNumber } from "../../../utils/funtions/functions";
// MUI
//import SearchBar from "material-ui-search-bar";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button, Typography } from "@mui/material"; // use it to any text style
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

import FormControl from "@mui/material/FormControl";

//MUI Icons
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

export default function TableComp(props) {

  // Hooks
  const [rows, setRows] = useState(
    props.items
      ? props.items.map((each, index) => {
        return {
          ...each,
          ["myValue"]: currencyNumber(each.myValue || 0),
          ["myCost"]: currencyNumber(each.myCost || 0),
        };
      })
      : [props.objkeys]
  ); //pega os dados em forma de JSON para renderizar na tabela
  const keyNames = Object.keys(props.objkeys); //Quais as propriedades do objeto que eu quero mostrar (JSON format)

  const [fcoft, setFcoft] = useState(false); //Fist-Click-On-Fund-Table
  const [openSelectFilter, setOpenSelectFilter] = useState(false);

  const [addNewItemMsg, setAddNewItemMsg] = useState("");
  const [searched, setSearched] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [columnToSearch, setColumnToSearch] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  //Const Declarations
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles;

  //Local Functions
  function checkSelected() {
    return props.preSelected ? setRows(props.preSelected) : null;
  }

  React.useEffect(() => {
    checkSelected();
  }, []);

  // Sorting Functions

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  //---

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  //---

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  //---

  //---

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, headCellsKeys, headCellsNames } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCellsKeys.map((headCell, index) => (
            <TableCell
              key={headCell}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell ? order : false}
              style={
                index === 0
                  ? {
                    /* borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px", */

                    backgroundColor: "#C8C6C6",
                    align: headCell.numeric ? "right" : "left",
                    borderRight: "1px solid #4B6587",
                  }
                  : index === headCellsKeys.length - 1
                    ? {
                      /* borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px", */
                      backgroundColor: "#C8C6C6",
                    }
                    : {
                      backgroundColor: "#C8C6C6",
                      borderRight: "1px solid #4B6587",
                    }
              }
            >
              <TableSortLabel
                active={orderBy === headCell}
                direction={orderBy === headCell ? order : "asc"}
                onClick={createSortHandler(headCell)}
              >
                <p style={{ ...classes.textColoured, padding: 0, margin: 0 }}>
                  {headCellsNames[index]}
                </p>

                {orderBy === headCell ? (
                  <Box component="span" sx={{ display: "none" }}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  //--------

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = props.items.filter((row) => {
      return JSON.stringify(row[keyNames[columnToSearch ? columnToSearch : 0]])
        .toLowerCase()
        .includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
    if (props.exportFilteredRows) {
      props.exportFilteredRows(filteredRows);
    }
    props.exportRequest && props.exportRequest(searchedVal);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  // --- Filtragem

  function SimpleDialog(props) {
    const { onClose, selectedValue, open, optionsToFilterNames } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
      onClose(value);
    };

    return (
      <Dialog onClose={handleClose} open={open} fullScreen={fullScreen}>
        <DialogTitle>Selecione a coluna para filtrar a busca</DialogTitle>
        <List sx={{ pt: 0 }}>
          {optionsToFilterNames.map((option, index) => (
            <>
              <ListItem
                button
                onClick={(event) => {
                  event.preventDefault();
                  handleListItemClick(index);
                }}
                key={option}
              >
                <IconButton style={{ width: "50px", heigh: "50px" }}>
                  {index + 1}.
                </IconButton>
                <ListItemText primary={option} />
              </ListItem>
              <Divider component="li" />
            </>
          ))}
        </List>
      </Dialog>
    );
  }

  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
  };

  //---

  const handleCloseFilter = (value) => {
    setOpenSelectFilter(false);
    setColumnToSearch(value);
  };

  //---

  return (
    <>
      <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
        {props.whatToSearch && (
          <Typography
            gutterBottom
            variant="h5"
          >
            {props.whatToSearch}
          </Typography>
        )}
        {rows ? (
          props.showSearchBar === "donotshow" ? null : (
            <Toolbar
              sx={{
                width: "100%",
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2% 0",
              }}
            >

              <Stack
                direction={"column"}
                justifyContent="flex-start"
                alignContent={"flex-start"}
                spacing={2}
                sx={{ width: "98%" }}
              >
                <Stack
                  direction={"row"}
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <ButtonGroup size="small" aria-label="small button group">
                    {props.tableHead.map((each, index) => (
                      <Button
                        variant={
                          index === columnToSearch ? "contained" : "outlined"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setColumnToSearch(index);
                        }}
                      >
                        {each}
                      </Button>
                    ))}
                  </ButtonGroup>
                  {props.addItem ? (
                    <div>

                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={props.addItem}
                      >
                        {" "}
                        <AddIcon /> Cadastrar{" "}
                      </Button>
                    </div>
                  ) : null}
                </Stack>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="pesquisar">
                    Pesquisar
                  </InputLabel>
                  <OutlinedInput
                    labelId='pesquisar'
                    id="filled-adornment"
                    value={searched}
                    onChange={(e) => {
                      e.preventDefault();
                      requestSearch(e.target.value);
                      setSearched(e.target.value);
                    }}
                    label='pesquisar'
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          edge="end"
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                {window.screen.width > 1000 && props.children && props.children}
              </Stack>
            </Toolbar>
          )
        ) : null}

        <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
          {rows ? (
            <Table
              style={classes.myTable}
              stickyHeader
              aria-label="customized table"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                headCellsKeys={keyNames}
                headCellsNames={props.tableHead}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />

              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (

                      <TableRow
                        key={index}

                        hover
                        role="checkbox"
                        tabIndex={-1}
                        onClick={
                          props.WhenClicked
                            ? (event) => {
                              event.preventDefault();

                              props.WhenClicked(row._id); // = chamar a função do Pai:  goToUser(row._id)
                            }
                            : null
                        }
                        style={
                          { cursor: 'pointer' }
                        }
                      >

                        {keyNames.map((objectName) => (

                          <TableCell align="left">{row[objectName]}</TableCell>

                        ))}


                      </TableRow>

                    );
                  })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table style={classes.myTable} aria-label="customized table">
              <TableHead style={classes.tableHead}>
                <TableRow style={classes.tableHead}>
                  {props.tableHead.map((titulos) => (
                    <TableCell style={classes.myCell} align="left">
                      <Typography
                        gutterBottom
                        variant="h5"
                        style={classes.textWhite}
                      >
                        {titulos}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow style={classes.eachRow}>
                  <TableCell align="left">Não há registros</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, rows.length].sort((a, b) =>
            a < b ? -1 : 1
          )}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <br />
    </>
  );
}
