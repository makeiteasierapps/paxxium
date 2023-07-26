"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _ChatContext = require("../../contexts/ChatContext");
var _system = require("@mui/system");
var _reactCardFlip = _interopRequireDefault(require("react-card-flip"));
var _GPT_ = _interopRequireDefault(require("../../assets/images/GPT_35.png"));
var _GPT_2 = _interopRequireDefault(require("../../assets/images/GPT_4.png"));
var _AgentDebate = _interopRequireDefault(require("../../assets/images/AgentDebate.png"));
var _AuthContext = require("../../contexts/AuthContext");
var _colors = require("@mui/material/colors");
var _Check = _interopRequireDefault(require("@mui/icons-material/Check"));
var _DebateForm = _interopRequireDefault(require("../DebateForm"));
var _material = require("@mui/material");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var BotCard = (0, _system.styled)(_material.Card)(function (_ref) {
  var theme = _ref.theme;
  return {
    transition: '0.3s',
    boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
    margin: theme.spacing(1),
    height: '300px',
    // fixed height
    width: '100%',
    // takes full width of the parent
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: _colors.blueGrey[800]
  };
});
var ScrollableCardContent = (0, _system.styled)(_material.CardContent)({
  maxHeight: '250px',
  overflow: 'auto',
  textAlign: 'center'
});
var BotCardList = function BotCardList(_ref2) {
  var handleClose = _ref2.handleClose;
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    botProfiles = _useState2[0],
    setBotProfiles = _useState2[1];
  var _useContext = (0, _react.useContext)(_ChatContext.ChatContext),
    setSelectedAgentId = _useContext.setSelectedAgentId,
    setSelectedAgentName = _useContext.setSelectedAgentName,
    setConversationId = _useContext.setConversationId,
    addConversation = _useContext.addConversation;
  var _useState3 = (0, _react.useState)(botProfiles.map(function () {
      return false;
    })),
    _useState4 = _slicedToArray(_useState3, 2),
    isFlipped = _useState4[0],
    setIsFlipped = _useState4[1];
  var _useState5 = (0, _react.useState)(botProfiles.map(function () {
      return false;
    })),
    _useState6 = _slicedToArray(_useState5, 2),
    overlayVisible = _useState6[0],
    setOverlayVisible = _useState6[1];
  var _useContext2 = (0, _react.useContext)(_AuthContext.AuthContext),
    idToken = _useContext2.idToken;
  var _React$useState = _react.default.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    open = _React$useState2[0],
    setOpen = _React$useState2[1];
  var botImages = {
    AgentDebate: _AgentDebate.default,
    'GPT-3.5': _GPT_.default,
    'GPT-4': _GPT_2.default
  };
  (0, _react.useEffect)(function () {
    fetch('http://localhost:5000/get_bots', {
      method: 'GET',
      headers: {
        Authorization: idToken
      },
      credentials: 'include'
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      return setBotProfiles(data.bot_profiles);
    }).catch(function (error) {
      return console.error(error);
    });
  }, []);
  var showDebateSetupForm = function showDebateSetupForm() {
    setOpen(true);
  };
  var handleDebateFormClose = function handleDebateFormClose() {
    setOpen(false);
  };
  var startConversation = function startConversation(bot_profile_id, bot_name) {
    fetch('http://localhost:5000/start_conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: idToken
      },
      credentials: 'include',
      body: JSON.stringify({
        bot_profile_id: bot_profile_id,
        bot_name: bot_name
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      var newConversation = data.conversation;
      setConversationId(newConversation.id);
      addConversation(newConversation);
      setSelectedAgentId(newConversation.agent_id);
      setSelectedAgentName(newConversation.agent_name);
      handleClose();
    }).catch(function (error) {
      return console.error(error);
    });
  };
  var flipCard = function flipCard(index) {
    setIsFlipped(function (prevState) {
      var newFlipState = _toConsumableArray(prevState);
      newFlipState[index] = !newFlipState[index];
      return newFlipState;
    });
  };
  return /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    spacing: 2,
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, botProfiles.map(function (bot, index) {
    return /*#__PURE__*/_react.default.createElement(_material.Grid, {
      item: true,
      xs: 12,
      sm: 6,
      md: 4,
      key: bot.bot_profile_id
    }, /*#__PURE__*/_react.default.createElement(_reactCardFlip.default, {
      isFlipped: isFlipped[index],
      flipDirection: "horizontal"
    }, /*#__PURE__*/_react.default.createElement(BotCard, {
      variant: "outlined",
      onClick: function onClick() {
        return flipCard(index);
      }
    }, /*#__PURE__*/_react.default.createElement(_material.CardMedia, {
      component: "img",
      alt: bot.bot_name,
      height: "100%" // takes full height of the BotCard
      ,
      width: "100%" // takes full width of the BotCard
      ,
      style: {
        objectFit: 'cover'
      } // cover ensures the image covers the entire CardMedia
      ,
      image: botImages[bot.bot_name],
      title: bot.bot_name
    })), /*#__PURE__*/_react.default.createElement(BotCard, {
      variant: "outlined",
      onClick: function onClick() {
        return flipCard(index);
      }
    }, /*#__PURE__*/_react.default.createElement(_material.CardActionArea, {
      style: {
        height: '100%',
        width: '100%'
      } // takes full height and width of the BotCard
      ,
      onMouseOver: function onMouseOver() {
        return setOverlayVisible(true);
      },
      onMouseLeave: function onMouseLeave() {
        return setOverlayVisible(false);
      }
    }, /*#__PURE__*/_react.default.createElement(_material.CardContent, {
      style: {
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
      variant: "h5",
      align: "center"
    }, bot.bot_name), /*#__PURE__*/_react.default.createElement(ScrollableCardContent, null, /*#__PURE__*/_react.default.createElement(_material.Typography, {
      variant: "body2"
    }, bot.bot_description))), /*#__PURE__*/_react.default.createElement(ScrollableCardContent, null, /*#__PURE__*/_react.default.createElement(_material.Typography, {
      variant: "body2"
    }, bot.bot_description)), overlayVisible && /*#__PURE__*/_react.default.createElement(_material.Box, {
      sx: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        color: '#fff',
        textAlign: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement(_material.IconButton, {
      onClick: function onClick() {
        if (bot.bot_name === 'AgentDebate') {
          showDebateSetupForm();
        } else {
          startConversation(bot.id, bot.bot_name);
        }
      },
      style: {
        padding: '10px',
        color: '#fff',
        alignSelf: 'flex-end'
      }
    }, /*#__PURE__*/_react.default.createElement(_Check.default, null)))))));
  }), /*#__PURE__*/_react.default.createElement(_material.Dialog, {
    open: open,
    onClose: handleDebateFormClose
  }, /*#__PURE__*/_react.default.createElement(_material.DialogTitle, null, "Set Up Debate"), /*#__PURE__*/_react.default.createElement(_material.DialogContent, null, /*#__PURE__*/_react.default.createElement(_DebateForm.default, null))));
};
var _default = BotCardList;
exports.default = _default;