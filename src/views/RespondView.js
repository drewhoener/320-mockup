import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import RequestList from '../components/RequestList';
import axios from 'axios';

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
    margin: {
        margin: theme.spacing(1)
    },
    list: {
        width: '100%'
    },
    listItem: {
        [theme.breakpoints.down('sm')]: {
            width: '69.69%',
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: '30%'
        }
    },
    listItemText: {
        fontWeight: 'bold'
    }
}));

export default function RespondView(props) {
    const classes = useStyle();
    const [requests, setRequests] = React.useState([]);
    React.useEffect(() => {
        axios.get('/api/open-requests')
            .then(({ data }) => {
                setRequests(data.requests);
            })
            .catch(err => {
                //const error = {companyId: '-1', companyName: 'Error Fetching Companies'};
                //setCompanies([error]);
                //setSelectedCompany(error);
            });
    }, []);
    const newRequests = [...requests];
    return (
        <React.Fragment>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <Container maxWidth='xl'>
                    <h1>Pending</h1>
                    <Paper className={ classes.paper }>
                        <RequestList status={ 0 } classes={ classes } requests={ newRequests }/>
                    </Paper>
                    <h1>Accepted</h1>
                    <Paper className={ classes.paper }>
                        <RequestList status={ 1 } classes={ classes } requests={ newRequests }/>
                    </Paper>
                    <h1>Completed</h1>
                    <Paper className={ classes.paper }>
                        <RequestList status={ 2 } classes={ classes } requests={ newRequests }/>
                    </Paper>
                </Container>
            </div>
        </React.Fragment>
    );
}