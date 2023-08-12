import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import AgentMenu from './AgentMenu';
import { styled } from '@mui/system';

const StyledDialogContent = styled(DialogContent)({
    overflowY: 'auto', // add vertical scrolling
});

const NewChatDialog = ({ open, handleClose }) => {
    const { handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        reset();
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle variant="h4" align="center">
                Select Your Agent
            </DialogTitle>
            <StyledDialogContent>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <AgentMenu handleClose={handleClose} />
                </Box>
            </StyledDialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewChatDialog;
