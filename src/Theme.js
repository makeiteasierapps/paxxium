import { createTheme } from "@mui/material/styles";
import { grey, blueGrey } from "@mui/material/colors";

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ffffff", // or any color you want for primary
        },
        secondary: {
            main: "#e33d00", // or any color you want for secondary
            light: "#FF4500", // lighter shade of secondary color
            dark: "#5c1c08", // darker shade of secondary color
        },

        background: {
            default: "#344249", // color for background
            paper: blueGrey[700], // color for elements with a paper background
        },
        text: {
            primary: "#ffffff", // or any color you want for primary text
            secondary: grey[300], // or any color you want for secondary text
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#344249",
                    color: "#fff", // replace with your desired color
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
    },
});
