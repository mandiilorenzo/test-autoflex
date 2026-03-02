import {
    Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Button
} from '@mui/material';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} color="inherit">
                    Cancelar
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
                    Excluir
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;