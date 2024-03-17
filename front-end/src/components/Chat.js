import * as React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  Checkbox,
  Input,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getLastNMessages, sendMessage } from "../utils/api";
import { usePageVisibility } from "../utils/hooks/usePageVisibility";
import toast from "react-hot-toast";
import { getUploadUrl, uploadStory } from "../utils/api";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisuallyHiddenInput from '@mui/material/Input';
import TimerIcon from '@mui/icons-material/Timer';
import {
  Unstable_NumberInput as NumberInput,
  NumberInputProps,
} from '@mui/base/Unstable_NumberInput';

import { styled } from '@mui/material/styles';
// const messages = [
//   { id: 1, text: "Hi there!", sender: "bot" },
//   { id: 2, text: "Hello!", sender: "test" },
//   { id: 3, text: "How can I assist you today?", sender: "bot" },
//   { id: 4, text: "I'd like to know more about your products", sender: "bot" },
// ];

const blue = {
  100: '#daecff',
  200: '#b6daff',
  300: '#66b2ff',
  400: '#3399ff',
  500: '#007fff',
  600: '#0072e5',
  800: '#004c99',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 400;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`,
);

const StyledInput = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.375;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  border-radius: 4px;
  margin: 0 4px;
  padding: 10px 12px;
  outline: 0;
  min-width: 0;
  width: 1rem;
  text-align: center;

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
  }

  &:focus-visible {
    outline: 0;
  }
`,
);

const StyledButton = styled('button')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  line-height: 1.5;
  border: 0;
  border-radius: 999px;
  color: ${theme.palette.mode === 'dark' ? blue[300] : blue[600]};
  background: transparent;
  width: 40px;
  height: 40px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? blue[800] : blue[100]};
    cursor: pointer;
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`,
);

const Chat = ({ currentChat }) => {
  const localStorage = window.localStorage;
  const isPageVisible = usePageVisibility();
  const timerIdRef = React.useRef(null);
  const [isPollingEnabled, setIsPollingEnabled] = React.useState(true);
  const [receivedPollingReply, setReceivedPollingReply] = React.useState(true);

  const [messages, setMessages] = React.useState([]);
  const [expiring, setExpiring] = React.useState(false);
  const [expirationTime, setExpirationTime] = React.useState(0);
  
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if(selectedFile && !selectedFile.type.startsWith('image/') &&
    !selectedFile.type.startsWith('video/')){
        toast.error("Invalid file type");
        event.target.value = null;
        return;
    }
    setSelectedFile(selectedFile);
  };

  const [input, setInput] = React.useState("");
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  React.useEffect(() => {
    currentChat &&
    getLastNMessages(currentChat.id, JSON.parse(localStorage.getItem('userdata')).id, 10).then((res) => {
      res && setMessages(res);
      console.log(res);
    });

    const pollingMessages = () => {
      console.log("polling");
      currentChat && 
      getLastNMessages(currentChat.id, JSON.parse(localStorage.getItem('userdata')).id, 10).then((res) => {
        console.log(res);
        res && setMessages(res);
        setReceivedPollingReply(true);
      });
    }

    const startPolling = () => {
      // pollingCallback(); // To immediately start fetching data
      // Polling every 30 seconds
      timerIdRef.current = setInterval(pollingMessages, 500);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPageVisible && isPollingEnabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };

  }, [isPageVisible, isPollingEnabled,currentChat]);

  const handleSend = () => {
    const attachment = {
      type: "",
      name: "",
      link: "",
    }

    const now = new Date();
    const utcNow = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
    ));
    const messageBody = {
      chatId: currentChat.id,
      senderId: JSON.parse(localStorage.getItem('userdata')).id,
      content: input,
      attachment: attachment,
      expiring: expiring,
      expirationTime: +expirationTime,
      date: utcNow,
    }
    if(selectedFile){
      getUploadUrl({filename:`${selectedFile.name}`, filetype:`${selectedFile.type}`})
          .then((res) => {
              const { uploadUrl } = res;
              const reader = new FileReader();
              reader.onload = function() {
                  const fileData = reader.result; // The raw octet stream
                  uploadStory(uploadUrl,selectedFile.type,fileData)
                  .then(response => {
                      response && toast.success('File uploaded successfully'); 
                      attachment.type = selectedFile.type.split('/')[0];
                      attachment.name = selectedFile.name;
                      attachment.link = process.env.REACT_APP_BUCKET_URL + selectedFile.name;
                      console.log("here");
                      console.log(process.env.REACT_APP_BUCKET_URL + selectedFile.name);
                      _handleSendHelper(messageBody);
                  })
              };
              reader.readAsArrayBuffer(selectedFile);
      })
    }else{
      _handleSendHelper(messageBody);
    }

  };

  const _handleSendHelper = (messageBody) => {
    sendMessage(messageBody).then((res) => {
      console.log(res);
    });
    if (input.trim() !== "") {
      setInput("");
    }
    if (selectedFile) {
      setSelectedFile(null);
    }
  }

  return (
    <React.Fragment>
      {!currentChat ? (
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Select a chat to start messaging
        </Typography>
      ) : (
        <React.Fragment>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Chatting with {currentChat.name}
          </Typography>
          <Box
            sx={{ height: "94vh", display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
              {messages.map((message) => {
                return (
                  <>
                    {/* <Avatar>message.id</Avatar> */}
                    <Message key={message.id * message.id} message={message} />
                  </>
                );
              })}
            </Box>
            <Box sx={{ p: 1, backgroundColor: "background.default" }}>
              <Grid container spacing={2}>
                <Grid item xs={8.5}>
                  <TextField
                    style={{ height: "10px" }}
                    fullWidth
                    placeholder="Type a message"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSend();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={1.2}>
                  <Button component="label" variant="contained" color={(selectedFile ? "success" : "primary")} startIcon={<CloudUploadIcon />}>
                    {(selectedFile ? selectedFile.name.substring(0,8) : "Upload")}
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                  </Button>
                </Grid>
                <Grid item xs={1} style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                  <Checkbox
                    checked={expiring}
                    onChange={(e) => setExpiring(e.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                    icon={<TimerIcon />}
                    checkedIcon={<TimerIcon style={{color:"red"}} />}
                  />
                  <NumberInput 
                    min={0} 
                    slots={{
                      root: StyledInputRoot,
                      input: StyledInput,
                      incrementButton: StyledButton,
                      decrementButton: StyledButton,
                    }}
                    slotProps={{
                      incrementButton: {
                        children: <AddIcon />,
                        className: 'increment',
                      },
                      decrementButton: {
                        children: <RemoveIcon />,
                      },
                    }} 
                    placeholder="Expiration Time" 
                    style={{ display: expiring ? "flex" : "none" }}
                    type="number"
                    value={expirationTime}
                    onChange={(e) => 
                    setExpirationTime(e.target.value)}
                    disabled={!expiring}
                    
                  />
                  {/* <Input 
                    placeholder="Expiration Time" 
                    style={{width:"20px", }}
                    type="number"
                    value={expirationTime}
                    onChange={(e) => 
                    setExpirationTime(e.target.value)}
                    disabled={!expiring}
                  /> */}
                </Grid>
                <Grid item xs={1}>
                  <Button
                    fullWidth
                    style={{ height: "50px" }}
                    size="large"
                    color="primary"
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSend}
                  ></Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const Message = ({ message }) => {
  const isNotUser = message.sender !== window.localStorage.getItem("user");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isNotUser ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Avatar sx={{ m: 1 }}>{message.senderId}</Avatar>
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          backgroundColor: isNotUser ? "#F1EFEF" : "primary.main",
          color: isNotUser ? "#000" : "#fff",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "black", textAlign: "left" }}
        >
          {message.senderId}
        </Typography>
        {
          message.attachment && ( message.attachment.type === 'image' &&
          <img src={message.attachment.link} alt={message.attachment.name} width={720} height={576} /> )
          || ( message.attachment.type === 'video' &&
          <video src={message.attachment.link} controls /> )
        }
        <Typography variant="body1">{message.content}</Typography>
      </Paper>
    </Box>
  );
};

export default Chat;
