import { createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff', // or any color you want for primary
        },
        secondary: {
            main: '#FF4500', // or any color you want for secondary
        },
        background: {
            default: blueGrey[900], // color for background
            paper: '#1C282E', // color for elements with a paper background
        },
        text: {
            primary: '#ffffff', // or any color you want for primary text
            secondary: grey[300], // or any color you want for secondary text
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1C282E',
                    color: '#fff', // replace with your desired color
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});
