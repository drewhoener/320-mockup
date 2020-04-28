import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RequestList from '../components/RequestList';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 8,
        width: '100%'
    },
    modalPaper: {
        position: 'absolute',
        height: '75vh',
        width: '75vw',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    margin: {
        margin: theme.spacing(1)
    },
}));

export default function WriteView() {
    const classes = useStyle();
    const [requests, setRequests] = React.useState([]);
    React.useEffect(() => {
        axios.get('/api/open-requests')
            .then(({ data }) => {
                setRequests(data.requests);
            })
            .catch(err => {
                console.log(err);
                // const error = {};
                // setRequests([error]);
            });
    }, []);
    return (
        <React.Fragment>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <Container maxWidth='xl'>
                    <Switch>
                        <Route path={ '/write/accept-pending' }>
                            <h1>Pending</h1>
                            <Paper className={ classes.paper }>
                                <RequestList status={ 0 } requests={ requests }
                                             setRequests={ setRequests }/>
                            </Paper>
                        </Route>
                        <Route path={ '/write/write-request' }>
                            <h1>Accepted</h1>
                            <Paper className={ classes.paper }>
                                <RequestList status={ 1 } requests={ requests }
                                             setRequests={ setRequests }/>
                            </Paper>
                        </Route>
                        <Route path={ '/write/completed' }>
                            <h1>Completed</h1>
                            <Paper className={ classes.paper }>
                                <RequestList status={ 3 } requests={ requests }
                                             setRequests={ setRequests }/>
                            </Paper>
                        </Route>
                    </Switch>
                </Container>
            </div>
        </React.Fragment>
    );
}