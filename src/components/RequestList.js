import { ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { blueGrey, green, red } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PendingState } from '../state/action/RequestActions';
import { pushErrorMessage } from '../state/selector/RequestSelector.js';

const useStyle = makeStyles(theme => ({
    list: {
        width: '100%'
    },
    listItem: {
        backgroundColor: '#ffffff',
        '&:hover': {
            backgroundColor: '#eeeeee'
        }
    },
    listItemText: {
        fontWeight: 'bold'
    },
    emptyRequestSet: {
        textAlign: 'center',
    },
    spacedButton: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    accept: {
        color: green[500],
        borderColor: green[500],
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    reject: {
        color: red.A700,
        borderColor: red.A700,
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    write: {
        color: blueGrey[700],
        borderColor: blueGrey[700],
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    }
}));

function RequestList({ status, requests, setRequests, emptyText, pushError }) {

    const classes = useStyle();

    // Using useMemo so that we don't waste time filtering every time we call this
    // The memoized value will only change if status or requests change
    const renderableRequests = React.useMemo(() => {
        return requests.filter(request => request.statusNumber === status);
    }, [status, requests]);

    const handleAccept = (request) => {
        console.log('accepted');
        axios.post('/api/accept-request', request)
            .then(({ data }) => {
                if (data && data.request) {
                    pushError('success', 'Request accepted');
                    return data;
                }
            })
            .catch(err => {
                pushError('error', 'Request couldn\'t be accepted. It either expired or does not exist.');
            }).then((data) => {
            let newRequests = requests.filter(o => o._id.toString() !== request._id.toString());
            if (data && data.request) newRequests = [data.request, ...newRequests];
            setRequests(newRequests);
        });
    };

    const handleReject = (request) => {
        console.log('rejected');
        axios.post('/api/delete-request', request)
            .then(() => {
                pushError('success', 'Request rejected');
            })
            .catch(err => {
                pushError('error', 'Request couln\'t be rejected. It either expired or does not exist.');
            })
            .then(() => {
                const newRequests = [...requests.filter(o => o._id.toString() !== request._id.toString())];
                setRequests(newRequests);
            });
    };

    const history = useHistory();

    const redirectToEditor = (reviewId) => {
        axios.get('/api/editor/review-valid', {
            params: {
                reviewId
            }
        }).then(() => {
            history.push(`/write/editor/${ reviewId }`);
        }).catch(() => {
            pushError('warning', 'Cannot open editor, this review might not exist.');
        });
    };


    return (
        <List className={ classes.list }>
            {
                renderableRequests.length <= 0 && (
                    <>
                        <Divider/>
                        <ListItem
                            tabIndex={ 0 }
                            aria-labelledby={ `req_emptystatus_${ status }` }
                            className={ classes.listItem }>
                            <ListItemText
                                className={ classes.emptyRequestSet }
                                aria-label={ 'Nothing to display' }
                                id={ `req_emptystatus_${ status }` }
                                primary={ emptyText || 'No Requests to display' }
                            />
                        </ListItem>
                    </>
                )
            }
            {
                renderableRequests.length > 0 &&
                renderableRequests.map(request => {
                    return (
                        <React.Fragment
                            key={ `${ request.firstName }_${ request.lastName }_${ request._id }` }>
                            <Divider/>
                            <ListItem
                                tabIndex={ 0 }
                                aria-labelledby={ `req_${ request._id }` }
                                className={ classes.listItem }>
                                <ListItemText
                                    aria-label={ status === PendingState.COMPLETED ?
                                        `${ PendingState[status] } review for ${ request.firstName } ${ request.lastName }` :
                                        `${ PendingState[status] } request from ${ request.firstName } ${ request.lastName }, ${ request.position }`
                                    }
                                    id={ `req_${ request._id }` }
                                    primary={ request.firstName + ' ' + request.lastName }
                                    primaryTypographyProps={ { className: classes.listItemText } }
                                    secondary={ request.position }
                                />
                                <ListItemSecondaryAction>
                                    {
                                        status === 0 &&
                                        <>
                                            <Button className={ classes.accept } variant={ 'outlined' }
                                                    aria-label={ `Accept pending request from ${ request.firstName } ${ request.lastName }` }
                                                    onClick={ () => handleAccept(request) }>
                                                Accept
                                            </Button>
                                            <Button className={ classes.reject } variant={ 'outlined' }
                                                    aria-label={ `Reject pending request from ${ request.firstName } ${ request.lastName }` }
                                                    onClick={ () => handleReject(request) }>
                                                Reject
                                            </Button>
                                        </>
                                    }
                                    {
                                        status === 1 &&
                                        <>
                                            <Button className={ classes.write } color={ 'primary' }
                                                    variant={ 'outlined' }
                                                    aria-label={ `Write review for ${ request.firstName } ${ request.lastName }` }
                                                    onClick={ () => redirectToEditor(request._id) }>
                                                Write
                                            </Button>
                                            <Button className={ classes.reject } variant={ 'outlined' }
                                                    aria-label={ `Reject request from ${ request.firstName } ${ request.lastName }` }
                                                    onClick={ () => handleReject(request) }>
                                                Reject
                                            </Button>
                                        </>
                                    }
                                </ListItemSecondaryAction>
                            </ListItem>
                        </React.Fragment>
                    );
                })
            }
            <Divider/>
        </List>
    );
}

const mapDispatchToProps = (dispatch) => ({
    pushError: (severity, message) => dispatch(pushErrorMessage(severity, message))
});

export default connect(null, mapDispatchToProps)(RequestList);