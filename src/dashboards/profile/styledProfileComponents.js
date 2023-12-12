import {
    Box,
    Tabs,
    TextField,
    Typography,
    Avatar,
} from "@mui/material";
import { styled } from "@mui/system";

export const MainPaper = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: theme.spacing(2),
}));
export const StyledTabs = styled(Tabs)(({ theme }) => ({
    "& .MuiTabs-indicator": {
        display: "none",
    },
}));
export const Question = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));
export const Answer = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: theme.palette.secondary.dark,
        },
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary.light,
        },
        "&:hover fieldset": {
            borderColor: theme.palette.secondary.light,
        },
        "&.Mui-disabled fieldset": {
            borderColor: theme.palette.secondary.dark,
        },
    },
    "& label.Mui-focused": {
        color: theme.palette.secondary.light,
    },
}));


export const UserContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    margin: "auto",
    width: "100%",
    maxWidth: "800px",
    height: "50%",
    backgroundColor: theme.palette.background.paper,
}));

export const AvatarContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: theme.spacing(4),
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 96,
    height: 100,
    margin: theme.spacing(1),
    alignSelf: "center",
}));

export const TextFieldContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "center",
}));

export const Username = styled(Typography)(({ theme }) => ({
    fontSize: "2rem",
    marginLeft: theme.spacing(3),
    color: theme.palette.secondary.dark,
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1),
    width: "80%",
    borderRadius: "5px",
    padding: 0,
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary.light,
        },
        "&.Mui-disabled fieldset": {
            border: `2px solid ${theme.palette.secondary.dark}`,
        },
        "&:not(.Mui-disabled):hover fieldset": {
            borderColor: theme.palette.secondary.light,
        },
    },
    "& label.Mui-focused": {
        color: theme.palette.secondary.light,
    },
    "& .MuiInputLabel-outlined": {
        color: theme.palette.secondary.dark,
    },
}));
