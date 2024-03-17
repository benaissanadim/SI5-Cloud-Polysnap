
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import { Avatar, Box, Button, Modal, Typography, LinearProgress, Input } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Fragment, useEffect, useState } from 'react';


import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import toast from 'react-hot-toast';
import { fetchContactStories, getUploadUrl, lookup, uploadStory, uploadStoryToService } from '../utils/api';

const imageFormats = ['jpg', 'jpeg', 'png', 'gif'];
const videoFormats = ['mp4', 'mov', 'avi', 'mkv'];

const useStyles = makeStyles((theme) => ({
  thinScrollbar: {
    scrollbarWidth: 'thin', /* For Firefox */
    scrollbarColor: '#888 transparent', /* For Firefox */
    '&::-webkit-scrollbar': {
      width: '2px', /* Adjust the width as needed */
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888', /* Color of the scrollbar thumb */
      borderRadius: '10px', /* Radius of the scrollbar thumb */
    },
  },
}));

const groupBy = (input, key) => {
    return input.reduce((acc, currentValue) => {
      let groupKey = currentValue[key];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(currentValue);
      return acc;
    }, {});
  };

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

const styleStory = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    border: '1px solid grey',
    boxShadow: 24,
    p: 1,
};

function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
      </Box>
    );
  }

export default function StoriesList() {
    const classes = useStyles();

    // Upload Story Modal state
    const [openUpload, setOpenUpload] = useState(false);
    const handleOpenUpload = () => setOpenUpload(true);
    const handleCloseUpload = () => setOpenUpload(false);
    const [selectedFile, setSelectedFile] = useState(null);

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

    const handleUpload = async (event) => {
        if(!selectedFile){
            toast.error("No file selected");
            return;
        }
        getUploadUrl({filename:`${selectedFile.name}`, filetype:`${selectedFile.type}`})
            .then((res) => {
                const { uploadUrl } = res;
                const reader = new FileReader();
                reader.onload = function() {
                    const fileData = reader.result; // The raw octet stream
                    uploadStory(uploadUrl,selectedFile.type,fileData)
                    .then(response => {
                        response && toast.success('File uploaded successfully'); 
                        uploadStoryToService({
                            "title": selectedFile.name,
                            "userId": JSON.parse(window.localStorage.getItem('userdata')).id,
                            "filename": selectedFile.name,
                            "format": selectedFile.name.split('.')[1]
                        }).then((res) => {
                            console.log(res)
                            res && toast.success('Story uploaded successfully');
                            //handleCloseUpload();
                        });
                    })
                };
                reader.readAsArrayBuffer(selectedFile);
        })
    }

    // Show story Modal state
    const [openStory, setOpenStory] = useState(false);    
    const [currentUserStories, setCurrentUserStories] = useState([]);
    const [currentUserStory, setCurrentUserStory] = useState({}); // [0
    const [currentStory, setCurrentStory] = useState({});
    const [random, setRandom] = useState(Math.random());
    const handleOpenStory = (stories) => {
        setOpenStory(true);
        console.log(stories)
        setCurrentUserStory(stories);
        setCurrentStory(stories[0]);
    }
    const handleCloseStory = () => setOpenStory(false);

    // 
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const handleNext = () => {
      setActiveStep((prevActiveStep) => 
        (prevActiveStep + 1 === currentUserStory.length) ? 
        0 :
        prevActiveStep + 1);
        setCurrentStory(currentUserStory[activeStep]); 
        setRandom(Math.random());
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => 
        (prevActiveStep - 1 === -1) ? 
        currentUserStory.length - 1 : 
        prevActiveStep - 1);
        setCurrentStory(currentUserStory[activeStep]);
        setRandom(Math.random());
    };

    useEffect(() => {
        fetchContactStories(JSON.parse(window.localStorage.getItem('userdata')).id).then((res) => {
            let stories = groupBy(res.map((res)=>  {return {downloadUrl: res.downloadUrl,...res.story}}), 'userId');
            let promiseArray = [];
            Object.keys(stories).forEach((key) => {
                promiseArray.push(lookup(key).then((user) => {
                    stories[key].forEach((story) => {
                        story.username = user.username;
                    })
                }))
            });
            Promise.all(promiseArray).then(() => {
                console.log(stories)
                setCurrentUserStories(stories ? Object.values(stories) : []);
            })
        });
    }, [currentUserStories.length]);

    return(
        <Fragment>
            {/* Upload Story Modal */}
            <Modal
                open={openUpload}
                onClose={handleCloseUpload}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={styleUpload}>
                    <Typography id="modal-modal-title" variant="subtitle1" component="h2">
                        Upload Story
                    </Typography>
                <Box style={{ display:"flex", }}>
                <Input
                    type="file"
                    onChange={handleFileChange}
                    hidden
                />
                <Button
                    component="label"
                    variant="contained"
                    minWidth="10px"
                    onClick={handleUpload}
                >
                Upload
                </Button>
                </Box>
                </Box>
            </Modal>


            {/* View Story Modal */}
            <Modal
                open={openStory}
                onClose={handleCloseStory}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={styleStory}>
                    <LinearProgressWithLabel value={(activeStep/(currentUserStory.length-1))*100} />
                    <div class="wrap">
                        <iframe key={random} class="frame" title={currentStory.title} src={currentStory.downloadUrl}></iframe>
                    </div>
                    <MobileStepper
                    variant="dots"
                    steps={currentUserStory.length}
                    position="static"
                    activeStep={activeStep}
                    sx={{ maxWidth: 400, flexGrow: 1 }}
                    nextButton={
                        <Button size="small" onClick={handleNext} disabled={activeStep === currentUserStory.length-1}>
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                        </Button>
                    }
                    />
                </Box>
            </Modal>


        <div className={classes.thinScrollbar}>
            <Box style={{display:"flex", justifyContent:"center", alignItems:"center", overflow: "hidden", whiteSpace:"pre-wrap"}}>
                <Typography variant="h6" style={{paddingLeft:"10px"}}>Stories &nbsp;</Typography>
                <Button
                    size='large'
                    style={{ width:"1px", minWidth:"0px"}}
                    color="success"
                    endIcon={<AddIcon />}
                    onClick={handleOpenUpload}
                >
                </Button>
            </Box>
            {
                currentUserStories.length > 0 && currentUserStories.map((stories, index) => {
                    return(
                        <ListItem key={index} component="div" disablePadding>
                            <ListItemButton style={{ display:"flex", flexDirection:"column"}} 
                                onClick={()=>handleOpenStory(stories)}
                            >
                                <Avatar>{stories[0].username}</Avatar>
                                <ListItemText primary={stories[0].username} />
                            </ListItemButton>
                        </ListItem>
                    )
                })
            }
        </div>
        </Fragment>
    )
}