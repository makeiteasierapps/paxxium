import { Avatar, ListItemIcon } from "@mui/material";
import { blueGrey, green, red } from "@mui/material/colors";
import { useState } from "react";
import {
    StyledHeader,
    MessageContent,
    MessageContainer,
    StyledCheckbox,
} from "../agentStyledComponents";

const DebateMessage = ({ message, agent }) => {
    const [checked, setChecked] = useState(false);

    return (
        <MessageContainer
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
                            bgcolor: agent === "agent1" ? green[500] : red[500],
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
        </MessageContainer>
    );
};

export default DebateMessage;
