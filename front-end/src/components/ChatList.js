
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { getUserChats } from '../utils/api';

const useStyles = makeStyles((theme) => ({
  thinScrollbar: {
    scrollbarWidth: 'thin', /* For Firefox */
    scrollbarColor: '#888 transparent', /* For Firefox */
    '&::-webkit-scrollbar': {
      width: '5px', /* Adjust the width as needed */
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888', /* Color of the scrollbar thumb */
      borderRadius: '10px', /* Radius of the scrollbar thumb */
    },
  },
}));

function renderRow(props) {
    const { index, style, data } = props;
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText primary={`${data[index].name}`} onClick={() => data.setCurrentChat(data[index])} />
        </ListItemButton>
      </ListItem>
    );
  }

export default function ChatList({setCurrentChat}){
  const [chats, setChats] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    getUserChats(JSON.parse(localStorage.getItem('userdata')).id).then((res) => {
      res && setChats(res);
    });
  }, []);

    return(
        <div className={classes.thinScrollbar}>
          {
            chats &&
              <FixedSizeList
                  height={740}
                  itemSize={46}
                  itemCount={chats.length}
                  overscanCount={5}
                  itemData={{...chats, setCurrentChat}}
              >
              {renderRow}
              </FixedSizeList>
          }
        </div>
    )
}