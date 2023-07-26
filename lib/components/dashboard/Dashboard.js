"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Chat = _interopRequireDefault(require("./chat/Chat"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var Dashboard = function Dashboard() {
  return /*#__PURE__*/_react.default.createElement(_Chat.default, null);
};
var _default = Dashboard;
exports.default = _default;