"use strict";

var _react = _interopRequireDefault(require("react"));
require("./index.css");
var _App = _interopRequireDefault(require("./App"));
var _reportWebVitals = _interopRequireDefault(require("./reportWebVitals"));
var _material = require("@mui/material");
var _client = require("react-dom/client");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var root = (0, _client.createRoot)(document.getElementById('root'));
root.render( /*#__PURE__*/_react.default.createElement(_react.default.StrictMode, null, /*#__PURE__*/_react.default.createElement(_material.CssBaseline, null), /*#__PURE__*/_react.default.createElement(_App.default, null)));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
(0, _reportWebVitals.default)();