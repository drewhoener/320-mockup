import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const PendingState = {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2,
    COMPLETED: 3,
    0: 'Pending',
    1: 'Accepted',
    2: 'Rejected',
    3: 'Completed',
};

export default function RequestList({ classes, status, requests, setRequests }) {

    const handleAccept = (request) => {
        console.log('accepted');
        axios.post('/api/accept-request', request)
            .then(({ data }) => {
                console.log('nice');
                if (data && data.request) {
                    const newRequests = [data.request, ...requests.filter(o => o._id.toString() !== data.request._id.toString())];
                    console.log(requests);
                    console.log(newRequests);
                    setRequests(newRequests);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleReject = (request) => {
        console.log('rejected');
        axios.post('/api/delete-request', request)
            .then(() => {
                const newRequests = [...requests.filter(o => o._id.toString() !== request._id.toString())];
                setRequests(newRequests);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const history = useHistory();

    const redirectToEditor = (reviewId) => {
        history.push(`/write/${ reviewId }`);
    };


    return (
        <List className={ classes.list }>
            {
                requests.filter(req => req.statusNumber === status)
                    .map(request => {
                        return (
                            <React.Fragment
                                key={ `${ request.firstName }_${ request.lastName }_${ request._id }` }>
                                <Divider/>
                                <ListItem
                                    className={ classes.listItem }
                                    aria-label={`${PendingState[status]} request from ${request.firstName} ${request.lastName}, ${request.position}`}>
                                    <ListItemText tabIndex={ 0 } primary={ request.firstName + ' ' + request.lastName }
                                                  primaryTypographyProps={ { className: classes.listItemText } }
                                                  secondary={ request.position }/>
                                    {
                                        status === 0 &&
                                        <>
                                            <Button aria-label={ `Accept pending request from ${request.firstName} ${request.lastName}` }
                                                    style={ { color: '#4caf50' } }
                                                    onClick={ () => handleAccept(request) }>
                                                    Accept
                                            </Button>
                                            <Button aria-label={ `Reject pending request from ${request.firstName} ${request.lastName}` }
                                                    style={ { color: '#f44336' } }
                                                    onClick={ () => handleReject(request) }>
                                                    Reject
                                            </Button>
                                        </>
                                    }
                                    {
                                        status === 1 &&
                                        <>
                                            <Button aria-label={ `Write review for ${request.firstName} ${request.lastName}` }
                                                    style={ { color: '#000000' } }
                                                    onClick={ () => redirectToEditor(request) }>
                                                    Write
                                            </Button>
                                            <Button aria-label={ `Reject request from ${request.firstName} ${request.lastName}` }
                                                    style={ { color: '#f44336' } }
                                                    onClick={ () => handleReject(request) }>
                                                    Reject
                                            </Button>
                                        </>
                                    }
                                </ListItem>
                            </React.Fragment>
                        );
                    })
            }
            <Divider/>
        </List>
    );
}