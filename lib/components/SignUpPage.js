"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SignUp;
var _react = require("react");
var _auth = require("firebase/auth");
var _AuthContext = require("../contexts/AuthContext");
var _reactRouterDom = require("react-router-dom");
var _system = require("@mui/system");
var _Avatar = _interopRequireDefault(require("@mui/material/Avatar"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _TextField = _interopRequireDefault(require("@mui/material/TextField"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _LockOutlined = _interopRequireDefault(require("@mui/icons-material/LockOutlined"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Container = _interopRequireDefault(require("@mui/material/Container"));
var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));
var _DialogActions = _interopRequireDefault(require("@mui/material/DialogActions"));
var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));
var _DialogContentText = _interopRequireDefault(require("@mui/material/DialogContentText"));
var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var StyledContainer = (0, _system.styled)(_Container.default)(function (_ref) {
  var theme = _ref.theme;
  return {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };
});
var WelcomeMessageText = (0, _system.styled)(_Typography.default)(function (_ref2) {
  var theme = _ref2.theme;
  return {
    marginTop: theme.spacing(2),
    fontSize: '1.11rem',
    textAlign: 'center'
  };
});
function SignUp() {
  var _useState = (0, _react.useState)({
      username: true,
      email: true,
      password: true,
      openAiApiKey: true,
      serpApiKey: true
    }),
    _useState2 = _slicedToArray(_useState, 2),
    formValid = _useState2[0],
    setFormValid = _useState2[1];
  var _useState3 = (0, _react.useState)(''),
    _useState4 = _slicedToArray(_useState3, 2),
    serverError = _useState4[0],
    setServerError = _useState4[1];
  var _useState5 = (0, _react.useState)({
      username: '',
      email: '',
      password: '',
      openAiApiKey: '',
      serpApiKey: ''
    }),
    _useState6 = _slicedToArray(_useState5, 2),
    formValues = _useState6[0],
    setFormValues = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    open = _useState8[0],
    setOpen = _useState8[1];
  var navigate = (0, _reactRouterDom.useNavigate)();
  var auth = (0, _auth.getAuth)();
  var _useContext = (0, _react.useContext)(_AuthContext.AuthContext),
    idToken = _useContext.idToken;
  var handleClose = function handleClose() {
    setOpen(false);
    navigate('/');
  };
  var isValid = {
    // username must be between 5 and 10 characters long and can only contain alphanumeric characters and underscores
    username: function username(_username) {
      return /^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/.test(_username);
    },
    // Email must be a valid email address
    email: function email(_email) {
      return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(_email);
    },
    // Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number
    password: function password(_password) {
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(_password);
    },
    // Must not be empty
    openAiApiKey: function openAiApiKey(key) {
      return key && key.trim().length > 0;
    },
    // Must not be empty
    serpApiKey: function serpApiKey(key) {
      return key && key.trim().length > 0;
    }
  };
  var errorMessages = {
    username: 'Username should be 5 or more characters, and can contain alphanumeric characters and underscore.',
    email: 'Invalid email address.',
    password: 'Password should be 8 or more characters, and must contain at least one uppercase, one lowercase letter and a digit.'
  };
  var handleInputChange = function handleInputChange(event) {
    var fieldName = event.target.name;
    var value = event.target.value;
    setFormValues(_objectSpread(_objectSpread({}, formValues), {}, _defineProperty({}, fieldName, value)));
    setFormValid(_objectSpread(_objectSpread({}, formValid), {}, _defineProperty({}, fieldName, isValid[fieldName](value))));
  };
  var handleSubmit = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
      var userCredential, user, uid, response;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            event.preventDefault();
            // Check if all fields are valid before submitting
            if (!Object.values(formValid).every(function (field) {
              return field;
            })) {
              _context.next = 22;
              break;
            }
            _context.prev = 2;
            _context.next = 5;
            return (0, _auth.createUserWithEmailAndPassword)(auth, formValues.email, formValues.password);
          case 5:
            userCredential = _context.sent;
            user = userCredential.user;
            uid = user.uid;
            if (user) {
              _context.next = 10;
              break;
            }
            throw new Error('User not created');
          case 10:
            _context.next = 12;
            return fetch('http://localhost:5000/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: idToken
              },
              body: JSON.stringify({
                uid: uid,
                username: formValues.username,
                openAiApiKey: formValues.openAiApiKey,
                serpApiKey: formValues.serpApiKey,
                authorized: false
              })
            });
          case 12:
            response = _context.sent;
            if (response.ok) {
              _context.next = 15;
              break;
            }
            throw new Error('Error when saving user data');
          case 15:
            setOpen(true);
            _context.next = 22;
            break;
          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](2);
            console.error(_context.t0);
            setServerError(_context.t0.message);
          case 22:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[2, 18]]);
    }));
    return function handleSubmit(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/_react.React.createElement(StyledContainer, {
    component: "main",
    maxWidth: "xs"
  }, /*#__PURE__*/_react.React.createElement(_Avatar.default, {
    sx: {
      m: 1,
      bgcolor: 'secondary.main'
    }
  }, /*#__PURE__*/_react.React.createElement(_LockOutlined.default, null)), /*#__PURE__*/_react.React.createElement(_Typography.default, {
    component: "h1",
    variant: "h5"
  }, "Sign up"), /*#__PURE__*/_react.React.createElement(WelcomeMessageText, {
    sx: {
      mt: 2
    },
    variant: "body2",
    color: "text.secondary"
  }, "In order to use the app a couple of api keys are needed. OpenAI is a paid api but it is very reasonable, and SerpAPI is has a generous free tier. I take security serious, keys are encrypted using Google's Key Management Service (KMS), stored and used only on the server side.", /*#__PURE__*/_react.React.createElement("br", null), /*#__PURE__*/_react.React.createElement("br", null), "Once your account has been approved you will be notified."), /*#__PURE__*/_react.React.createElement(_Box.default, {
    component: "form",
    noValidate: true,
    onSubmit: handleSubmit,
    sx: {
      mt: 3
    }
  }, /*#__PURE__*/_react.React.createElement(_Grid.default, {
    container: true,
    spacing: 2
  }, /*#__PURE__*/_react.React.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.React.createElement(_TextField.default, {
    required: true,
    fullWidth: true,
    id: "username",
    label: "Username",
    name: "username",
    value: formValues.username,
    error: !formValid.username,
    helperText: !formValid.username ? errorMessages.username : '',
    onChange: handleInputChange
  })), /*#__PURE__*/_react.React.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.React.createElement(_TextField.default, {
    required: true,
    fullWidth: true,
    id: "email",
    label: "Email Address",
    name: "email",
    value: formValues.email,
    error: !formValid.email,
    helperText: !formValid.email ? errorMessages.email : '',
    autoComplete: "email",
    onChange: handleInputChange
  })), /*#__PURE__*/_react.React.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.React.createElement(_TextField.default, {
    required: true,
    fullWidth: true,
    id: "openAiApiKey",
    label: "OpenAI API Key",
    name: "openAiApiKey",
    value: formValues.openAiApiKey,
    error: !formValid.openAiApiKey,
    helperText: !formValid.openAiApiKey ? errorMessages.openAiApiKey : '',
    type: "password",
    onChange: handleInputChange
  })), /*#__PURE__*/_react.React.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.React.createElement(_TextField.default, {
    required: true,
    fullWidth: true,
    id: "serpApiKey",
    label: "SerpAPI Key",
    name: "serpApiKey",
    value: formValues.serpApiKey,
    error: !formValid.serpApiKey,
    helperText: !formValid.serpApiKey ? errorMessages.serpApiKey : '',
    type: "password",
    onChange: handleInputChange
  })), /*#__PURE__*/_react.React.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.React.createElement(_TextField.default, {
    required: true,
    fullWidth: true,
    name: "password",
    label: "Password",
    type: "password",
    id: "password",
    value: formValues.password,
    error: !formValid.password,
    helperText: !formValid.password ? errorMessages.password : '',
    autoComplete: "new-password",
    onChange: handleInputChange
  }))), /*#__PURE__*/_react.React.createElement(_Button.default, {
    type: "submit",
    fullWidth: true,
    variant: "contained",
    sx: {
      mt: 3,
      mb: 2
    }
  }, "Sign Up"), /*#__PURE__*/_react.React.createElement(_Grid.default, {
    container: true,
    justifyContent: "center"
  }, /*#__PURE__*/_react.React.createElement(_Grid.default, {
    item: true
  }, /*#__PURE__*/_react.React.createElement(_Link.default, {
    href: "/",
    variant: "body2"
  }, "Already have an account? Sign in")))), /*#__PURE__*/_react.React.createElement(_Dialog.default, {
    open: open,
    onClose: handleClose,
    "aria-labelledby": "alert-dialog-title",
    "aria-describedby": "alert-dialog-description"
  }, /*#__PURE__*/_react.React.createElement(_DialogTitle.default, {
    id: "alert-dialog-title"
  }, 'Request Received'), /*#__PURE__*/_react.React.createElement(_DialogContent.default, null, /*#__PURE__*/_react.React.createElement(_DialogContentText.default, {
    id: "alert-dialog-description"
  }, "Your request has been received. You will be contacted when approved.")), /*#__PURE__*/_react.React.createElement(_DialogActions.default, null, /*#__PURE__*/_react.React.createElement(_Button.default, {
    onClick: handleClose,
    color: "primary",
    autoFocus: true
  }, "Ok"))));
}