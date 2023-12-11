import { Icon } from "@iconify/react";
import { Avatar, Checkbox, ListItem, ListItemIcon } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { styled } from "@mui/system";
import { useState } from "react";

const AgentMessageContainer = styled(ListItem)({
    backgroundColor: blueGrey[700],
    wordBreak: "break-word",
    alignItems: "flex-start",
    flexDirection: "column",
});

const MessageContent = styled("div")({
    maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    width: "100%",
    whiteSpace: "pre-wrap",
});

const StyledCheckbox = styled(Checkbox)({
    color: blueGrey[100],
    "&.Mui-checked": {
        color: "#1C282E",
    },
});

const StyledHeader = styled("div")({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});

const AgentMessage = ({ message }) => {
    // State for checkbox and processed messages
    const [checked, setChecked] = useState(false);
    return (
        <AgentMessageContainer>
            <StyledHeader>
                <ListItemIcon>
                    <Avatar
                        variant="square"
                        sx={{
                            bgcolor: "secondary.main",
                            width: "30px",
                            height: "30px",
                        }}
                    >
                        <Icon icon="mdi:robot" style={{ fontSize: "33px" }} />
                    </Avatar>
                </ListItemIcon>
                <StyledCheckbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    inputProps={{ "aris-label": "Select message" }}
                />
            </StyledHeader>
            <MessageContent>
                {message.map((msg, index) => {
                    if (msg.type === "text") {
                        return <p key={`text${index}`}>{msg.content}</p>;
                    } else if (msg.type === "code") {
                        return (
                            <pre
                                key={`code${index}`}
                                className={`language-${msg.language}`}
                            >
                                <code
                                    dangerouslySetInnerHTML={{
                                        __html: msg.content,
                                    }}
                                />
                            </pre>
                        );
                    }
                    return null;
                })}
            </MessageContent>
        </AgentMessageContainer>
    );
};

export default AgentMessage;
