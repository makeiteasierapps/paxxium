import { styled } from "@mui/system";
import { Box, List, ListItem, Checkbox } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

// AgentDash.js
export const Container = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

export const Settings = styled(Box)(({ theme }) => ({
    width: "100%",
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.63)",
}));

export const Chats = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.63)",
}));

// Used for both Debate and Chat
export const ChatContainerStyled = styled(Box)(() => ({
    height: "75vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.63)",
    overflow: "auto",
    borderRadius: "5px",
}));

export const MessageArea = styled(List)({
    flexGrow: 1,
    overflowY: "auto",
    width: "100%",
});

export const MessagesContainer = styled(Box)({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    whiteSpace: "pre-line",
});

// Used for Chat, Debate, and User
export const MessageContainer = styled(ListItem)({
    backgroundColor: blueGrey[700],
    wordBreak: "break-word",
    alignItems: "flex-start",
    flexDirection: "column",
});

export const MessageContent = styled(Box)({
    maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    width: "100%",
    whiteSpace: "pre-wrap",
});

export const StyledCheckbox = styled(Checkbox)({
    color: blueGrey[100],
    "&.Mui-checked": {
        color: "#1C282E",
    },
});

export const StyledHeader = styled(Box)({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});

// Chatbar
export const Bar = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: '1px solid #e0e0e0',
}));

export const ChatBarIcons = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

export const InputArea = styled(Box)({
    padding: "20px",
    display: "flex",
    alignItems: "center", 
    justifyContent: "space-between",
});



