import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const DeleteConfirmationDialog = ({ open, handleClose, handleConfirm }) => (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to delete this news article?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
    </Dialog>
);

export default DeleteConfirmationDialog;
