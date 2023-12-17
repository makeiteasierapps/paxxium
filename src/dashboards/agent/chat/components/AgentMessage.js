import { Icon } from "@iconify/react";
import { Avatar, ListItemIcon, Box } from "@mui/material";
import { useState } from "react";
import { MessageContainer, MessageContent, StyledHeader, StyledCheckbox } from "../../agentStyledComponents";

const AgentMessage = ({ message }) => {
    const [checked, setChecked] = useState(false);
    return (
        <MessageContainer >
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
                        return <Box key={`text${index}`}>{msg.content}</Box>;
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

export default AgentMessage;
