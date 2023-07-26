"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
var _system = require("@mui/system");
var _colors = require("@mui/material/colors");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var UserMessageStyled = (0, _system.styled)(_material.ListItem)({
  backgroundColor: _colors.blueGrey[800],
  wordBreak: 'break-word',
  alignItems: 'flex-start'
});
var MessageText = (0, _system.styled)(_material.ListItemText)({
  wordBreak: 'break-word'
});
var StyledCheckbox = (0, _system.styled)(_material.Checkbox)({
  color: _colors.blueGrey[800],
  // Specify your styles here
  '&.Mui-checked': {
    color: '#1C282E' // Specify your styles for checked state
  }
});

var UserMessage = function UserMessage(_ref) {
  var message = _ref.message;
  var _React$useState = _react.default.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    checked = _React$useState2[0],
    setChecked = _React$useState2[1];
  var handleCheck = function handleCheck(event) {
    setChecked(event.target.checked);
  };
  return /*#__PURE__*/_react.default.createElement(UserMessageStyled, null, /*#__PURE__*/_react.default.createElement(_material.ListItemIcon, null, /*#__PURE__*/_react.default.createElement(_material.Avatar, {
    variant: "square",
    sx: {
      bgcolor: '#1C282E',
      color: _colors.blueGrey[700],
      fontSize: '33px'
    }
  })), /*#__PURE__*/_react.default.createElement(MessageText, {
    primary: message.message_content
  }), /*#__PURE__*/_react.default.createElement(StyledCheckbox, {
    checked: checked,
    onChange: handleCheck,
    inputProps: {
      'aris-label': 'Select message'
    }
  }));
};
var _default = UserMessage;
exports.default = _default;