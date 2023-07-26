"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));
var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));
var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));
var _DialogActions = _interopRequireDefault(require("@mui/material/DialogActions"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _reactHookForm = require("react-hook-form");
var _BotCardList = _interopRequireDefault(require("./BotCardList"));
var _system = require("@mui/system");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var StyledDialogContent = (0, _system.styled)(_DialogContent.default)({
  overflowY: 'auto' // add vertical scrolling
});

var NewChatDialog = function NewChatDialog(_ref) {
  var open = _ref.open,
    handleClose = _ref.handleClose;
  var _useForm = (0, _reactHookForm.useForm)(),
    handleSubmit = _useForm.handleSubmit,
    reset = _useForm.reset;
  var onSubmit = function onSubmit(data) {
    reset();
    handleClose();
  };
  return /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    open: open,
    onClose: handleClose,
    maxWidth: "md",
    fullWidth: true
  }, /*#__PURE__*/_react.default.createElement(_DialogTitle.default, {
    variant: "h4",
    align: "center"
  }, "Select Your Bot"), /*#__PURE__*/_react.default.createElement(StyledDialogContent, null, /*#__PURE__*/_react.default.createElement(_Box.default, {
    component: "form",
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/_react.default.createElement(_BotCardList.default, {
    handleClose: handleClose
  }))), /*#__PURE__*/_react.default.createElement(_DialogActions.default, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    onClick: handleClose
  }, "Cancel")));
};
var _default = NewChatDialog;
exports.default = _default;