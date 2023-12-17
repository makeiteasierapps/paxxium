import { Avatar, ListItemIcon } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { useState } from "react";

import {
    MessageContainer,
    MessageContent,
    StyledHeader,
    StyledCheckbox,
} from "../../agentStyledComponents";

const UserMessage = ({ message }) => {
    const [checked, setChecked] = useState(false);

    return (
        <MessageContainer
            style={{
                backgroundColor:
                    message.message_from === "user"
                        ? blueGrey[800]
                        : blueGrey[700],
            }}
        >
            <StyledHeader>
                <ListItemIcon>
                    <Avatar
                        variant="square"
                        sx={{
                            width: "30px",
                            height: "30px",
                            bgcolor: "#1C282E",
                            color: blueGrey[700],
                        }}
                    />
                </ListItemIcon>
                <StyledCheckbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    inputProps={{ "aris-label": "Select message" }}
                />
            </StyledHeader>
            <MessageContent>{message.content}</MessageContent>
        </MessageContainer>
    );
};

export default UserMessage;
