import { Box, Icon, Input, Modal, Typography, Button } from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';

import { Fragment, useState } from "react";
import { addContact, createChat } from "../utils/api";
import toast from "react-hot-toast";

const styleUpload = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    border: '1px solid grey',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 24,
    p: 1,
};

export default function AddContact() {
    const [value, setValue] = useState('');
    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [chatName, setChatName] = useState('');
    const [contactsName, setContactsName] = useState('');

    const handleChatNameChange = (e) => {
        setChatName(e.target.value);
    }
    const handleContactsNameChange = (e) => {
        setContactsName(e.target.value);
    }

    const handleAddContact = (user) => {
        addContact({
            userId: JSON.parse(localStorage.getItem('userdata')).id,
            contactId: user
        }).then((res) => {
            res && toast.success(`Adding contact successful: ${user}!`);
        });
    }

    const handleCreateChat = () => {
        if(chatName === '' || contactsName === '' || contactsName === null || chatName === null || contactsName === undefined || chatName === undefined
        || chatName.trim() === '' || contactsName.trim() === ''){
            toast.error('Please fill in all fields');
            return;
        }
        const contacts = contactsName.split(',');
        const body = {
            name: chatName,
            participants: [JSON.parse(localStorage.getItem('userdata')).id, ...contacts]
        }
        createChat(body).then((res) => {
            res && toast.success(`Creating chat successful: ${chatName}!`);
            console.log(res)
        });
    }

    

    return(
        <Fragment>
             <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={styleUpload}>
                    <Typography id="modal-modal-title" variant="subtitle1" component="h2">
                        Create Chat
                    </Typography>
                <Box >
                <Input 
                    placeholder="Enter Chat Name" 
                    value={chatName}
                    onChange={(e) => 
                    handleChatNameChange(e)} 
                />
                <Input 
                    placeholder="Enter Contacts Name separated by comma" 
                    value={contactsName}
                    onChange={(e) => 
                    handleContactsNameChange(e)} 
                />
                <Button
                    component="label"
                    variant="contained"
                    minWidth="10px"
                    onClick={handleCreateChat}
                >
                Create
                </Button>
                </Box>
                </Box>
            </Modal>
            <Box width="100%" style={{display:"flex", alignItems:"center", justifyContent:"space-around", padding:"0 10px"}}>
                <Input placeholder="Enter Contact Name" value={value} onChange={(e) => handleChange(e)} />
                <Box style={{display:"flex", alignItems:"center", justifyContent:"space-around", width:"70px"}}>
                    <Icon onClick={() => handleAddContact(value)} >add_circle</Icon>
                    <MessageIcon onClick={() => handleOpen()} />
                </Box>
            </Box>
        </Fragment>
    )
}