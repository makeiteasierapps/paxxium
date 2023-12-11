import { Avatar, Checkbox, ListItem, ListItemIcon } from "@mui/material";
import { blueGrey, green, red } from "@mui/material/colors";
import { styled } from "@mui/system";
import { useState } from "react";

//styled Components
const AgentMessageStyled = styled(ListItem)({
    wordBreak: "break-word",
    alignItems: "flex-start",
    flexDirection: "column",
});

const MessageContent = styled("div")({ wordBreak: "break-word" });

const StyledCheckbox = styled(Checkbox)({
    color: blueGrey[100], // Specify your styles here
    "&.Mui-checked": {
        color: "#1C282E", // Specify your styles for checked state
    },
});

const StyledHeader = styled("div")({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});

const DebateMessage = ({ message, agent }) => {
    const [checked, setChecked] = useState(false);

    const getAvatarColor = (agent) => {
        switch (agent) {
            case "agent1":
                return green[500];
            case "agent2":
                return red[500];
            default:
                return blueGrey[700];
        }
    };

    return (
        <AgentMessageStyled
            sx={{
                backgroundColor:
                    agent === "agent1" ? blueGrey[800] : blueGrey[700],
            }}
        >
            <StyledHeader>
                <ListItemIcon>
                    <Avatar
                        variant="square"
                        sx={{
                            width: "30px",
                            height: "30px",
                            bgcolor: getAvatarColor(agent),
                            color: blueGrey[700],
                            fontSize: "33px",
                        }}
                    />
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
        </AgentMessageStyled>
    );
};

export default DebateMessage;
