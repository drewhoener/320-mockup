import { List } from 'react-virtualized';
import React from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import { Checkbox, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { sendRequests, toggleEmployeeSelect } from '../state/selector/RequestSelector';
import Button from '@material-ui/core/Button';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { colorButtonTheme } from '../util';

const useStyle = makeStyles(theme => ({
    smallScrollbar: {
        '&::-webkit-scrollbar': {
            width: '0.8em',
            height: '0.6em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 10px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '2px solid slategrey'
        }
    },
}));

function EmployeeList(
    {
        width,
        height,
        employees,
        filteredEmployees,
        selectedEmployees,
        selectEmployee,
        sendSingleRequest,
        ...rest
    }) {

    const classes = useStyle();

    const SecondaryActionWrapper = ({ ...props }) => <ListItemSecondaryAction { ...props }/>;
    SecondaryActionWrapper.muiName = ListItemSecondaryAction.muiName;

    const rowRenderer = ({
                             // Unique key within array of rows
                             key,
                             // Index of row within collection
                             index,
                             // The List is currently being scrolled
                             isScrolling,
                             // This row is visible within the List (eg it is not an overscanned row)
                             isVisible,
                             // Style object to be applied to row (to position it)
                             style,
                         }) => {

        if (index % 2 === 1) {
            return (<Divider key={ key } style={ style }/>);
        }

        const employee = employees[filteredEmployees[Math.floor(index / 2)]];
        if (!employee) {
            return null;
        }

        return (
            <div key={ key } style={ style }>
                <ListItem ContainerComponent='div' role={ undefined } disableRipple button
                          onClick={ selectEmployee(employee._id.toString()) }>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={ selectedEmployees.some(item => employee._id.toString() === item) }
                            tabIndex={ -1 }
                            disableRipple
                            inputProps={ { 'aria-labelledby': 'Add or Remove from Review Request' } }
                            color='primary'
                        />
                    </ListItemIcon>
                    <ListItemText primary={ employee.fullName }
                                  secondary={ employee.position }
                    />
                    <ListItemSecondaryAction>
                        <Button edge='end' color='primary' variant='outlined'
                                onClick={ sendSingleRequest(employee._id.toString()) }>
                            Request
                        </Button>
                    </ListItemSecondaryAction>
                </ListItem>
            </div>
        );
    };


    return (
        <ThemeProvider theme={ colorButtonTheme }>
            <List
                className={ classes.smallScrollbar }
                width={ width }
                height={ height }
                rowCount={ filteredEmployees.length * 2 }
                rowHeight={ ({ index }) => index % 2 === 1 ? 1 : 72 }
                rowRenderer={ rowRenderer }
                overscanRowCount={ 5 }
                { ...rest }
            />
        </ThemeProvider>
    );
}

const mapStateToProps = state => ({
    employees: state.requests.employees,
    filteredEmployees: state.requests.filteredEmployees,
    selectedEmployees: state.requests.selectedEmployees,
});

const mapDispatchToProps = (dispatch, getState) => ({
    selectEmployee: idx => () => dispatch(toggleEmployeeSelect(idx)),
    sendSingleRequest: requestId => () => dispatch(sendRequests([requestId])),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeList);