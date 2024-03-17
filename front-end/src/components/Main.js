import { styled } from '@mui/material/styles'
import { Grid, Paper } from "@mui/material"
import UserHeader from './UserHeader';
import ChatList from './ChatList';
import AddContact from './AddContact';
import Chat from './Chat';
import StoriesList from './StoriesList';

import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { useEffect, useState, Fragment } from 'react';

import { addContact, login } from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Main({}){
    const localStorage = window.localStorage;
    const history = useHistory();
    const [user, setUser] = useState({});
    const [currentChat, setCurrentChat] = useState(undefined);

    useEffect(() => {
        if(localStorage.getItem('user') === null){
            toast.error('You must be logged in to view this page');
            history.push('/login');
        }else{
            setUser(login(`username=${localStorage.getItem('user')}`,true));
        }
    }, []);

    return(
        <>
            <Grid container spacing={2} style={{ height: '100%'}}>
                <Grid item xs={2.5} style={{ height: '100%'}}>
                    <Grid item style={{ height: '10%'}}>
                        <Item style={{ height: '100%'}} xs={12} >
                            <UserHeader user={user} />
                        </Item>
                    </Grid>
                    <Grid item style={{ height: '85%'}}>
                        <Item style={{ height: '100%'}} xs={12} >
                            <ChatList setCurrentChat={setCurrentChat} />
                        </Item>
                    </Grid>
                    <Grid item style={{ height: '5%'}}>
                        <Item style={{ height: '100%'}} xs={12} >
                            <AddContact />
                        </Item>
                    </Grid>
                </Grid>
                <Grid item xs={8.5} >
                    <Item style={{ height: '98%'}} >
                        <Chat currentChat={currentChat} />
                    </Item>
                </Grid>
                <Grid item xs={1} >
                    <Item style={{ height: '98%'}} >
                        <StoriesList />
                    </Item>
                </Grid>
            </Grid>
      </>
    )
}