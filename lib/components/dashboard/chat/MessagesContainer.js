"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _system = require("@mui/system");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var MessagesContainerStyled = (0, _system.styled)('div')({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  whiteSpace: 'pre-line'
});
var MessagesContainer = function MessagesContainer(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_react.default.createElement(MessagesContainerStyled, null, children);
};
var _default = MessagesContainer;
exports.default = _default;