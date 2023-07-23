import React, { useState, useEffect, useContext } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { styled } from '@mui/system';
import ReactCardFlip from 'react-card-flip';
import gpt_35 from '../../assets/images/GPT_35.png';
import gpt_4 from '../../assets/images/GPT_4.png';
import agent_debate from '../../assets/images/AgentDebate.png';
import { AuthContext } from '../../contexts/AuthContext';
import { blueGrey } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import DebateSetupForm from '../DebateForm';

import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    CardActionArea,
    Grid,
    IconButton,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';

const BotCard = styled(Card)(({ theme }) => ({
    transition: '0.3s',
    boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
    margin: theme.spacing(1),
    height: '300px', // fixed height
    width: '100%', // takes full width of the parent
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: blueGrey[800],
}));

const ScrollableCardContent = styled(CardContent)({
    maxHeight: '250px',
    overflow: 'auto',
    textAlign: 'center',
});

const BotCardList = ({ handleClose }) => {
    const [botProfiles, setBotProfiles] = useState([]);
    const {
        setSelectedAgentId,
        setSelectedAgentName,
        setConversationId,
        addConversation,
    } = useContext(ChatContext);
    const [isFlipped, setIsFlipped] = useState(botProfiles.map(() => false));
    const [overlayVisible, setOverlayVisible] = useState(
        botProfiles.map(() => false)
    );
    const { idToken } = useContext(AuthContext);
    const [open, setOpen] = React.useState(false);

    const botImages = {
        AgentDebate: agent_debate,
        'GPT-3.5': gpt_35,
        'GPT-4': gpt_4,
    };

    useEffect(() => {
        fetch('http://localhost:5000/get_bots', {
            method: 'GET',
            headers: {
                Authorization: idToken,
            },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => setBotProfiles(data.bot_profiles))
            .catch((error) => console.error(error));
    }, []);

    const showDebateSetupForm = () => {
        setOpen(true);
    };

    const handleDebateFormClose = () => {
        setOpen(false);
    };

    const startConversation = (bot_profile_id, bot_name) => {
        fetch('http://localhost:5000/start_conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: idToken,
            },
            credentials: 'include',
            body: JSON.stringify({ bot_profile_id, bot_name }),
        })
            .then((response) => response.json())
            .then((data) => {
                const newConversation = data.conversation;
                setConversationId(newConversation.id);
                addConversation(newConversation); 
                setSelectedAgentId(newConversation.agent_id);
                setSelectedAgentName(newConversation.agent_name);
                handleClose();
            })
            .catch((error) => console.error(error));
    };

    const flipCard = (index) => {
        setIsFlipped((prevState) => {
            const newFlipState = [...prevState];
            newFlipState[index] = !newFlipState[index];
            return newFlipState;
        });
    };

    return (
        <Grid
            container
            spacing={2}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {botProfiles.map((bot, index) => (
                <Grid item xs={12} sm={6} md={4} key={bot.bot_profile_id}>
                    <ReactCardFlip
                        isFlipped={isFlipped[index]}
                        flipDirection="horizontal"
                    >
                        <BotCard
                            variant="outlined"
                            onClick={() => flipCard(index)}
                        >
                            <CardMedia
                                component="img"
                                alt={bot.bot_name}
                                height="100%" // takes full height of the BotCard
                                width="100%" // takes full width of the BotCard
                                style={{ objectFit: 'cover' }} // cover ensures the image covers the entire CardMedia
                                image={botImages[bot.bot_name]}
                                title={bot.bot_name}
                            />
                        </BotCard>

                        <BotCard
                            variant="outlined"
                            onClick={() => flipCard(index)}
                        >
                            <CardActionArea
                                style={{ height: '100%', width: '100%' }} // takes full height and width of the BotCard
                                onMouseOver={() => setOverlayVisible(true)}
                                onMouseLeave={() => setOverlayVisible(false)}
                            >
                                <CardContent
                                    style={{
                                        padding: 0,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography variant="h5" align="center">
                                        {bot.bot_name}
                                    </Typography>
                                    <ScrollableCardContent>
                                        <Typography variant="body2">
                                            {bot.bot_description}
                                        </Typography>
                                    </ScrollableCardContent>
                                </CardContent>
                                <ScrollableCardContent>
                                    <Typography variant="body2">
                                        {bot.bot_description}
                                    </Typography>
                                </ScrollableCardContent>
                                {overlayVisible && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor:
                                                'rgba(0, 0, 0, 0.3)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-start',
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => {
                                                if (
                                                    bot.bot_name ===
                                                    'AgentDebate'
                                                ) {
                                                    showDebateSetupForm();
                                                } else {
                                                    startConversation(
                                                        bot.id,
                                                        bot.bot_name
                                                    );
                                                }
                                            }}
                                            style={{
                                                padding: '10px',
                                                color: '#fff',
                                                alignSelf: 'flex-end',
                                            }}
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </CardActionArea>
                        </BotCard>
                    </ReactCardFlip>
                </Grid>
            ))}
            <Dialog
                open={open}
                onClose={handleDebateFormClose}
            >
                <DialogTitle>Set Up Debate</DialogTitle>
                <DialogContent>
                    <DebateSetupForm />
                </DialogContent>
            </Dialog>
        </Grid>
    );
};

export default BotCardList;
