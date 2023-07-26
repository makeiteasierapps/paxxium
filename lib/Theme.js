"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theme = void 0;
var _styles = require("@mui/material/styles");
var _colors = require("@mui/material/colors");
var theme = (0, _styles.createTheme)({
  palette: {
    primary: {
      main: '#ffffff' // or any color you want for primary
    },

    secondary: {
      main: '#FF4500' // or any color you want for secondary
    },

    background: {
      default: _colors.blueGrey[900],
      // color for background
      paper: '#1C282E' // color for elements with a paper background
    },

    text: {
      primary: '#ffffff',
      // or any color you want for primary text
      secondary: _colors.grey[300] // or any color you want for secondary text
    }
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C282E',
          color: '#fff' // replace with your desired color
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    }
  }
});
exports.theme = theme;