import { Box, Button, Title } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import LogoutIcon from "@mui/icons-material/Logout";

export default function UserHeader({user}){
    const handleLogout = () => {
        window.localStorage.removeItem('user');
        window.location.reload();
    }

    return(
        <Box style={{padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <Box
                style={{
                    display:"flex",
                }}
            >
                <Avatar>OP</Avatar>
                <h3 style={{margin:"10px"}}>OP</h3>
            </Box>
            <Button
              style={{ width:"2px" }}
              size="large"
              color="error"
              endIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
            </Button>
        </Box>
    )
}