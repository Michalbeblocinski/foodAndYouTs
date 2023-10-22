import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import {useEffect, useState} from "react";
import {collection, doc} from "firebase/firestore";
import {db} from "../../firebaseConfig/config";
import { deleteDoc, query, where, getDocs } from "firebase/firestore";
import {UserApp} from "../../utils/types/user";

interface Data {
    _id: string;
    email: string;
    username: string;
    lastName: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: string },
    b: { [key in Key]:  string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array:  T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    _id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells:  HeadCell[] = [
    {
        _id: 'email',
        numeric: false,
        disablePadding: true,
        label: 'Email',
    },
    {
        _id: '_id',
        numeric: false,
        disablePadding: false,
        label: '_id',
    },
    {
        _id: 'username',
        numeric: false,
        disablePadding: false,
        label: 'Username',
    },
    {
        _id: 'lastName',
        numeric: false,
        disablePadding: false,
        label: 'Last Name',
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell._id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell._id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell._id}
                            direction={orderBy === headCell._id ? order : 'asc'}
                            onClick={createSortHandler(headCell._id)}
                        >
                            {headCell.label}
                            {orderBy === headCell._id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}



interface EnhancedTableToolbarProps {
    numSelected: number;
    selected:  string[];
    deleteUser: (selectedIds: string[]) => Promise<void>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, selected, deleteUser } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Users
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={() => deleteUser(selected)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}
interface EnhancedTablePropsHeaderProps {
    refreshPage: () => void;
}
export default function EnhancedTable({ refreshPage }: EnhancedTablePropsHeaderProps) {

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('_id');
    const [selected, setSelected] = React.useState< string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = useState<UserApp[] >([]);
    const getData = async () => {
        try {
            const usersCollectionRef = collection(db, "users");
            const querySnapshot = await getDocs(usersCollectionRef);

            const usersDataFromFirebase: UserApp[] = [];
            querySnapshot.forEach((doc) => {
                if (doc.exists()) {
                    if (doc.exists()) {
                        const userData = doc.data() as UserApp;
                        userData._id = doc.id;
                        usersDataFromFirebase.push(userData);
                    }
                }
            });

            setUsers(usersDataFromFirebase);
        } catch (error) {
            console.error("Error during get data", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);
    const refreshTable = () => {
        refreshPage();
        getData();
    };

    const deleteRecipesForUser = async (userId: string) => {
        const recipesCollectionRef = collection(db, "recipes");
        const userRecipesQuery = query(recipesCollectionRef, where("user._id", "==", userId));
        const userRecipesSnapshot = await getDocs(userRecipesQuery);

        for (const doc of userRecipesSnapshot.docs) {
            try {
                const recipeDocRef = doc.ref;
                await deleteDoc(recipeDocRef);
            } catch (error) {
                console.error("Error deleting recipe for user with _id", userId, error);
            }
        }

        refreshPage()
    };

    const deleteUser = async (selectedIds: string[]) => {
        const usersCollectionRef = collection(db, "users");

        for (const userId of selectedIds) {
            await deleteRecipesForUser(userId);

            try {
                const userDocRef = doc(usersCollectionRef, userId);
                await deleteDoc(userDocRef);
                await   refreshTable();
            } catch (error) {
                console.error("Error deleting user with _id", userId, error);
            }
        }
        refreshTable();
        alert("users deleted successfully");
        setSelected([]);
    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = users?.map((user: UserApp) => user._id) || [];
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, _id: string) => {
        const selectedIndex = selected.indexOf(_id);
        let newSelected:  string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, _id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (_id: string) => selected.indexOf(_id) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (users?.length || 0)) : 0;

    const visibleRows = React.useMemo(
        () => {
            const usersTmp = users.map((user) => {

                if (user.lastName === null) {

                    return { ...user, lastName: "" };
                } else {
                    return user;
                }
            });

            return stableSort(usersTmp as Data[] , getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            );
        },
        [order, orderBy, page, rowsPerPage, users]
    );

    return (
        <Box sx={{ w_idth: '100%', zIndex: "100", position: "relative" }}>
            <Paper sx={{ w_idth: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} selected={selected} deleteUser={deleteUser} />
                <TableContainer>
                    <Table
                        sx={{ minW_idth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={users?.length || 0}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row._id);
                                const label_id = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row._id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row._id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': label_id,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={label_id}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.email}
                                        </TableCell>
                                        <TableCell align="right">{row._id}</TableCell>
                                        <TableCell>{row.username}</TableCell>
                                        <TableCell>{row.lastName}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={users?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
