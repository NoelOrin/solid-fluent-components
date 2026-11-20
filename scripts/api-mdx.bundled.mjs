var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react-jsx-runtime.production.js
var require_react_jsx_runtime_production = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    function jsxProd(type, config, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config.key && (key = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      config = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
      };
    }
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsx = jsxProd;
    exports.jsxs = jsxProd;
  }
});

// node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/react/cjs/react.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports.Activity = REACT_ACTIVITY_TYPE;
    exports.Children = Children;
    exports.Component = Component;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.PureComponent = PureComponent;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports.cacheSignal = function() {
      return null;
    };
    exports.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports.isValidElement = isValidElement;
    exports.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    exports.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports.version = "19.2.7";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.2.7";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production();
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children)
          if (isStaticChildren)
            if (isArrayImpl(children)) {
              for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                validateChildKeys(children[isStaticChildren]);
              Object.freeze && Object.freeze(children);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
          children = getComponentNameFromType(type);
          var keys = Object.keys(config).filter(function(k) {
            return "key" !== k;
          });
          isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
          didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
            isStaticChildren,
            children,
            keys,
            children
          ), didWarnAboutKeySpread[children + isStaticChildren] = true);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(
          maybeKey,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        return ReactElement(
          type,
          children,
          maybeKey,
          getOwner(),
          debugStack,
          debugTask
        );
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var React = require_react(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      React = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(
        React,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutKeySpread = {};
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          false,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.jsxs = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          true,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
    })();
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_jsx_runtime_production();
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  }
});

// ../../../private/tmp/solid-fluent-api.mjs
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);

// ../../../private/tmp/solid-fluent-mdx-provider.mjs
var useMDXComponents = () => ({});

// ../../../private/tmp/solid-fluent-storybook-blocks.mjs
var Meta = () => null;

// ../../../private/tmp/solid-fluent-api.mjs
function _createMdxContent(props) {
  const _components = {
    blockquote: "blockquote",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    hr: "hr",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...useMDXComponents(),
    ...props.components
  };
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
    children: [(0, import_jsx_runtime.jsx)(Meta, {
      title: "Introduction/API"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h1, {
      children: "Solid Fluent Components \xB7 API \u603B\u89C8"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0, import_jsx_runtime.jsxs)(_components.p, {
        children: ["\u4F7F\u7528 ", (0, import_jsx_runtime.jsx)(_components.strong, {
          children: "SolidJS + Vite 8 + TypeScript 7"
        }), " \u91CD\u5199\u7684 Fluent UI \u98CE\u683C\u7EC4\u4EF6\u5E93\u3002\n\u672C\u9875\u662F\u7EC4\u4EF6 API \u7684\u5355\u4E00\u5165\u53E3\uFF1A\u5148\u770B\u300C\u4E0A\u624B\u300D\u4E0E\u300C\u7EC4\u4EF6\u603B\u89C8\u300D\uFF0C\u518D\u6309\u5DE6\u4FA7\u5206\u7C7B\u70B9\u5F00\u5BF9\u5E94 Story \u8C03\u8BD5\u3002"]
      }), "\n"]
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: ["\u7531\u4E8E\u672C\u9879\u76EE\u7684 Storybook \u5173\u95ED\u4E86 TypeScript docgen\uFF08\u517C\u5BB9 TS 7\uFF09\uFF0CProps \u4EE5", (0, import_jsx_runtime.jsx)(_components.strong, {
        children: "\u672C\u9875\u603B\u8868"
      }), "\u4E0E\u5404 Story \u7684 Docs \u63CF\u8FF0\u4E3A\u51C6\uFF1BControls \u9762\u677F\u5BF9 ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "Button"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "Input"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "Badge"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "Avatar"
      }), " \u7B49\u652F\u6301\u5B9E\u65F6\u8C03\u53C2\u3002"]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "\u4E0A\u624B"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "\u5B89\u88C5\u4E0E\u5F15\u5165"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.pre, {
      children: (0, import_jsx_runtime.jsx)(_components.code, {
        className: "language-tsx",
        children: 'import {\n  Button,\n  FluentProvider,\n  webLightTheme,\n} from "@solid-fluent/components";\nimport "@solid-fluent/components/styles.css";\n'
      })
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "\u6700\u5C0F\u7528\u6CD5"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.pre, {
      children: (0, import_jsx_runtime.jsx)(_components.code, {
        className: "language-tsx",
        children: 'import { FluentProvider, webLightTheme, Button } from "@solid-fluent/components";\n\nexport function App() {\n  return (\n    <FluentProvider theme={webLightTheme} applyToDocument>\n      <Button appearance="primary">\u5F00\u59CB\u4F7F\u7528</Button>\n    </FluentProvider>\n  );\n}\n'
      })
    }), "\n", (0, import_jsx_runtime.jsx)(_components.p, {
      children: "\u7EA6\u5B9A\uFF1A"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0, import_jsx_runtime.jsxs)(_components.li, {
        children: ["\u4E3B\u9898\u901A\u8FC7 ", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "FluentProvider"
        }), " \u6CE8\u5165 CSS \u53D8\u91CF\uFF08", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "--sf-*"
        }), "\uFF09\uFF0C\u6240\u6709\u7EC4\u4EF6\u8BFB\u53D6\u8FD9\u4E9B\u53D8\u91CF\u3002"]
      }), "\n", (0, import_jsx_runtime.jsxs)(_components.li, {
        children: ["\u5927\u591A\u6570\u63A7\u4EF6\u540C\u65F6\u652F\u6301", (0, import_jsx_runtime.jsx)(_components.strong, {
          children: "\u53D7\u63A7"
        }), "\uFF08", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "value"
        }), " + ", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "onChange"
        }), "\uFF09\u4E0E", (0, import_jsx_runtime.jsx)(_components.strong, {
          children: "\u975E\u53D7\u63A7"
        }), "\uFF08", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "defaultValue"
        }), "\uFF09\u4E24\u79CD\u6A21\u5F0F\u3002"]
      }), "\n", (0, import_jsx_runtime.jsx)(_components.li, {
        children: "\u4E8B\u4EF6\u56DE\u8C03\u547D\u540D\u5C3D\u91CF\u8D34\u8FD1 Fluent UI v9\uFF0C\u4F46\u5E76\u975E 1:1 \u517C\u5BB9\u3002"
      }), "\n", (0, import_jsx_runtime.jsxs)(_components.li, {
        children: ["\u5207\u6362\u4E3B\u9898\uFF1A\u628A ", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "FluentProvider"
        }), " \u7684 ", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "theme"
        }), " \u6362\u6210 ", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "webDarkTheme"
        }), " \u5373\u53EF\uFF0CStorybook \u9876\u90E8\u5DE5\u5177\u680F\u4E5F\u63D0\u4F9B\u4E86 Light / Dark \u5207\u6362\u3002"]
      }), "\n"]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "\u8BBE\u8BA1\u4EE4\u724C\u901F\u67E5"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: [(0, import_jsx_runtime.jsx)(_components.code, {
        children: "webLightTheme"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "webDarkTheme"
      }), " \u4EE5\u53CA ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "tokens"
      }), " \u5747\u4E3A\u666E\u901A\u5BF9\u8C61\uFF0C\u53EF\u76F4\u63A5\u7528\u4E8E inline style\u3002"]
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7528\u9014"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5B57\u6BB5\u793A\u4F8B"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u54C1\u724C\u4E3B\u8272"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.colorBrandBackground"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.colorBrandBackgroundHover"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u4E2D\u6027\u524D\u666F\uFF08\u6B21\u8981\u6587\u5B57\uFF09"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.colorNeutralForeground2"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.colorNeutralForeground3"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u4E2D\u6027\u80CC\u666F"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.colorNeutralBackground1"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.colorNeutralBackground2"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5B57\u4F53\u65CF"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.fontFamilyBase"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.fontFamilyMonospace"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.fontFamilyNumeric"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5B57\u53F7"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.fontSizeBase300"
            }), "\uFF08\u6B63\u6587\uFF09\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.fontSizeHero800"
            }), "\uFF08\u5927\u6807\u9898\uFF09"]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5B57\u91CD"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.fontWeightRegular"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Medium"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Semibold"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Bold"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.p, {
      children: "\u81EA\u5B9A\u4E49\u54C1\u724C\u8272\uFF1A"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.pre, {
      children: (0, import_jsx_runtime.jsx)(_components.code, {
        className: "language-tsx",
        children: 'import { createLightTheme, createDarkTheme, brandWeb } from "@solid-fluent/components";\n\nconst brand = { ...brandWeb, 100: "#479ef5" /* \u8986\u76D6\u4EFB\u610F\u6863\u4F4D */ };\nconst theme = createLightTheme(brand);\n'
      })
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "\u7EC4\u4EF6\u603B\u89C8"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.p, {
      children: "\u6309\u5DE6\u4FA7 Storybook \u4FA7\u8FB9\u680F\u5206\u7C7B\u3002\u70B9\u51FB\u7EC4\u4EF6\u540D\u53EF\u8DF3\u5230\u4E0B\u65B9 API\uFF1B\u70B9\u51FB Story \u6807\u9898\u8FDB\u5165\u4EA4\u4E92\u6F14\u793A\u3002"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5206\u7C7B"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "Theme"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "FluentProvider"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens"
            }), "\u3001\u4E3B\u9898\u5DE5\u5382"]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "Inputs"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Button"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Input"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "SearchBox"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Textarea"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Checkbox"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Radio"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "RadioGroup"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Switch"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "SpinButton"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Select"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Dropdown"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "ComboboxField"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Slider"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Rating"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "Display"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Text"
            }), "(\u542B ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Title"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Body"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Caption"
            }), ")\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Badge"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "PresenceBadge"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Avatar"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "AvatarGroup"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Link"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Divider"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Image"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Card"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Spinner"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Skeleton"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "ProgressBar"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "Feedback"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Dialog"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Drawer"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Toast"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "MessageBar"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "Navigation"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Menu"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "TabList"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Accordion"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Breadcrumb"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Toolbar"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Nav"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Tree"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Pagination"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "Overlay"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Tooltip"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Popover"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Overlay"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "TeachingPopover"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "InlineDrawer"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "Data"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Table"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "DataGrid"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "List"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Tag"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "TagPicker"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "SwatchPicker"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "Layout / \u6742\u9879"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Stack"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Portal"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Field"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "InfoLabel"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Persona"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "ColorPicker"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "DatePicker"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "TimePicker"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "Theme"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "FluentProvider"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7C7B\u578B"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u9ED8\u8BA4"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "theme"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Theme"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "webLightTheme"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: ["\u4F20\u5165 ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "webLightTheme"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "webDarkTheme"
            }), " \u6216\u81EA\u5B9A\u4E49\u4E3B\u9898"]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "applyToDocument"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "boolean"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "false"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: ["\u662F\u5426\u628A\u4E3B\u9898\u53D8\u91CF\u5199\u5230 ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "document.documentElement"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "themeOverrides"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "PartialTheme"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5728 base \u4E3B\u9898\u4E0A\u5408\u5E76\u8986\u76D6"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "dir"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"ltr" | "rtl"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"ltr"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u4E66\u5199\u65B9\u5411"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "style"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "class"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "CSS"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5BB9\u5668\u6837\u5F0F"
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "tokens"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: ["\u5BFC\u51FA\u8BBE\u8BA1\u4EE4\u724C\u5BF9\u8C61\uFF08\u989C\u8272\u3001\u5B57\u4F53\u3001\u95F4\u8DDD\u7B49\uFF09\uFF0C\u53EF\u76F4\u63A5\u7528\u4E8E inline style\uFF0C\u4F8B\u5982 ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "tokens.colorBrandBackground"
      }), "\u3002"]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "Inputs"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Button"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7C7B\u578B"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u9ED8\u8BA4"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "appearance"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"primary" | "secondary" | "outline" | "subtle" | "transparent"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"secondary"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u89C6\u89C9\u6837\u5F0F"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"small" | "medium" | "large"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"medium"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5C3A\u5BF8"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "shape"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"rounded" | "circular" | "square"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"rounded"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5F62\u72B6"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "icon"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "JSX.Element"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u56FE\u6807"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "iconPosition"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"before" | "after"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"before"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u56FE\u6807\u4F4D\u7F6E"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "disabled"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "disabledFocusable"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "boolean"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "false"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u7981\u7528 / \u7981\u7528\u4F46\u53EF\u805A\u7126"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "children"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "JSX.Element"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u6309\u94AE\u6587\u672C"
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Input / SearchBox / Textarea"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E\u5C5E\u6027"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Input"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "contentBefore"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "contentAfter"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "invalid"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "disabled"
            }), "\uFF0C\u5176\u4F59\u900F\u4F20\u539F\u751F ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "input"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "SearchBox"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "value"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onInput"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onDismiss"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "appearance"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "contentBefore"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "contentAfter"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Textarea"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: ["\u540C ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Input"
            }), " \u601D\u8DEF\uFF0C\u900F\u4F20\u539F\u751F ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "textarea"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Field"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7C7B\u578B"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u9ED8\u8BA4"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "label"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "JSX.Element"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u6807\u7B7E\uFF08\u81EA\u52A8\u5173\u8054\u5B50\u63A7\u4EF6 id\uFF09"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "hint"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "JSX.Element"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5E2E\u52A9\u6587\u6848"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "validationMessage"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "JSX.Element"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u6821\u9A8C\u4FE1\u606F"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "validationState"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"error" | "warning" | "success" | "none"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"none"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u6821\u9A8C\u72B6\u6001"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "required"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "boolean"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "false"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5FC5\u586B\u6807\u8BB0"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "orientation"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"vertical" | "horizontal"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"vertical"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5E03\u5C40\u65B9\u5411"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "children"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "JSX.Element"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: ["\u5B50\u63A7\u4EF6\uFF08", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Input"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Select"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Textarea"
            }), " \u8BFB\u53D6\u5176\u4E0A\u4E0B\u6587 id\uFF09"]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Checkbox / Radio / Switch"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E\u5C5E\u6027"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Checkbox"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "label"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "checked"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "indicator"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "disabled"
            }), "\u3001\u539F\u751F ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onChange"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Radio"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "RadioGroup"
            })]
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "label"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "checked"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "name"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "disabled"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Switch"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "label"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "labelPosition"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "checked"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "disabled"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "SpinButton / Rating / Slider"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E\u5C5E\u6027"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "SpinButton"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "value"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "defaultValue"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "min"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "max"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "step"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "precision"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onChange(value, displayValue)"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Rating"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "value"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "defaultValue"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "max"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "step(0.5|1)"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "color"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "readOnly"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "disabled"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onChange"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Slider"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "value"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "defaultValue"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "min"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "max"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "step"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onChange"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "disabled"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Dropdown / ComboboxField / Select"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.p, {
      children: (0, import_jsx_runtime.jsx)(_components.strong, {
        children: "Dropdown"
      })
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "options"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "{ value, label, disabled?, text? }[]"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "value"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "defaultValue"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5F53\u524D\u503C"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onOptionSelect"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "{ value, option }"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "placeholder"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "disabled"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5360\u4F4D\u4E0E\u7981\u7528"
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.p, {
      children: (0, import_jsx_runtime.jsx)(_components.strong, {
        children: "ComboboxField"
      })
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "options"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "{ value, label, disabled? }[]"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "multiselect"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u591A\u9009"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "selectedOptions"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "defaultSelectedOptions"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u591A\u9009\u503C"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "open"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "defaultOpen"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onOpenChange"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5C55\u5F00\u72B6\u6001"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "clearable"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "freeform"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u6E05\u7A7A / \u81EA\u7531\u8F93\u5165"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onOptionSelect"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "{ value, selectedOptions, optionValue?, optionText? }"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onInput"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u8F93\u5165\u8FC7\u6EE4"
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: [(0, import_jsx_runtime.jsx)(_components.strong, {
        children: "Select"
      }), "\uFF1A\u539F\u751F ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "<select>"
      }), " \u5C01\u88C5\uFF0C\u5C5E\u6027\u4E0E\u539F\u751F\u4E00\u81F4\u3002"]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "Display"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Text \u4E0E\u6392\u7248\u522B\u540D"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: [(0, import_jsx_runtime.jsx)(_components.code, {
        children: "Text"
      }), " \u652F\u6301\u901A\u8FC7 ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "as"
      }), " \u6E32\u67D3\u4EFB\u610F\u8BED\u4E49\u6807\u7B7E\uFF1B", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "Title1-3"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "Subtitle1-2"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "Body1-2"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "Caption1-2"
      }), " \u662F\u9884\u8BBE ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "as"
      }), "+", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "size"
      }), "+", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "weight"
      }), " \u7684\u5FEB\u6377\u7EC4\u4EF6\u3002"]
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7C7B\u578B"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u9ED8\u8BA4"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "as"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"span"|"p"|"h1"\u2026"h6"|"label"|"div"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"span"'
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: ["\u8BED\u4E49\u6807\u7B7E\uFF08\u7528 ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Dynamic"
            }), " \u6E32\u67D3\uFF0C\u652F\u6301\u5B57\u7B26\u4E32\u4E0E\u7EC4\u4EF6\uFF09"]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "100-1000"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "300"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5B57\u53F7\u6863\u4F4D"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "weight"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"regular"|"medium"|"semibold"|"bold"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"regular"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5B57\u91CD"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "align"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"start"|"center"|"end"|"justify"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5BF9\u9F50"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "truncate"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "block"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "wrap"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "boolean"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u622A\u65AD / \u5757\u7EA7 / \u4E0D\u6362\u884C"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "italic"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "underline"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "strikethrough"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "boolean"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u6587\u672C\u4FEE\u9970"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "font"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: '"base"|"numeric"|"monospace"'
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5B57\u4F53\u65CF"
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Badge / PresenceBadge"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7C7B\u578B"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u9ED8\u8BA4"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "appearance"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "filled | ghost | outline | tint"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "filled"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "color"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "brand | danger | important | informative | severe | subtle | success | warning"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "brand"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tiny | extra-small | small | medium | large | extra-large"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "medium"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "shape"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "circular | rounded | square"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "circular"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "count"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "overflowCount"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "dot"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "showZero"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "CounterBadge \u4E13\u7528"
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "-"
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Avatar / Persona"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E\u5C5E\u6027"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Avatar"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "name"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "image"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size(16-128)"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "color"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "shape"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "initials"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "icon"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Persona"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "name"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "secondaryText"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tertiaryText"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "avatar"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "presence"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "AvatarGroup"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "items"
            }), " \u6216 ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "children"
            }), "\uFF0C\u6EA2\u51FA\u6298\u53E0"]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Card"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "appearance"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "filled"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "filled-alternative"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "outline"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "subtle"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "small"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "medium"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "large"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "orientation"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "vertical"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "horizontal"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5B50\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "CardHeader"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "CardPreview"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "CardFooter"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Spinner / ProgressBar / Image / Skeleton"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E\u5C5E\u6027"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Spinner"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "label"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "labelPosition"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "appearance"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "ProgressBar"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "value"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "max"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "thickness"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "shape"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "color"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Image"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "src"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "shape"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "fit"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "bordered"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "shadow"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "width"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "height"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Skeleton"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "appearance"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "width"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "height"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "<SkeletonItem>"
            }), " \u7EC4\u5408"]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "Feedback"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Dialog"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "open"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "defaultOpen"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onOpenChange"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5F00\u5173\u63A7\u5236"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "modalType"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "modal"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "non-modal"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "alert"
            }), "\uFF08", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "alert"
            }), " \u7981\u6B62\u70B9\u906E\u7F69\u5173\u95ED\u4E0E Esc\uFF09"]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u7ED3\u6784\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "DialogTrigger"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "DialogSurface"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "DialogTitle"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "DialogBody"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "DialogActions"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "DialogContent"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: [(0, import_jsx_runtime.jsx)(_components.code, {
        children: "DialogContent"
      }), " \u5FEB\u6377\u5C5E\u6027\uFF1A", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "title"
      }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "actions"
      }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "onClose"
      }), "\u3002"]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Drawer / Toast / MessageBar"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E\u5C5E\u6027"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Drawer"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "open"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onOpenChange"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "position(start|end)"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "modalType"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Toast"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Toaster"
            }), " \u5BB9\u5668 + ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "dispatchToast"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "dismissToast"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "clearToasts"
            }), "\uFF1B", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "intent: info|success|warning|error"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "MessageBar"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "intent"
            }), " + ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "MessageBarBody"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "MessageBarTitle"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "MessageBarActions"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.p, {
      children: "Toast \u7528\u6CD5\uFF1A"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.pre, {
      children: (0, import_jsx_runtime.jsx)(_components.code, {
        className: "language-tsx",
        children: 'const id = dispatchToast({ intent: "success", title: "\u5DF2\u4FDD\u5B58", body: "\u64CD\u4F5C\u6210\u529F", timeout: 4000 });\ndismissToast(id);\n'
      })
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "Navigation / Overlay"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Menu"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.pre, {
      children: (0, import_jsx_runtime.jsx)(_components.code, {
        className: "language-tsx",
        children: "<Menu>\n  <MenuTrigger><Button>\u6253\u5F00</Button></MenuTrigger>\n  <MenuPopover>\n    <MenuList>\n      <MenuItem>\u65B0\u5EFA</MenuItem>\n      <MenuItem disabled>\u5206\u4EAB</MenuItem>\n    </MenuList>\n  </MenuPopover>\n</Menu>\n"
      })
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "open"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "defaultOpen"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onOpenChange"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5F00\u5173"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u5B50\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "MenuItem"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "MenuItemCheckbox"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "MenuItemRadio"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "MenuDivider"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "MenuGroup"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Tooltip / Popover / Overlay"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E\u5C5E\u6027"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Tooltip"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "content"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "positioning"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "withArrow"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "visible"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "relationship"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Popover"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "PopoverTrigger"
            }), " + ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "PopoverSurface"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "SimplePopover"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "content"
            }), " \u5FEB\u6377\u7528\u6CD5"]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Overlay"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: ["\u906E\u7F69\u5BB9\u5668\uFF0C", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "isRelative"
            }), "\u3001\u70B9\u51FB\u5173\u95ED"]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Tab / Accordion / Breadcrumb / Toolbar / Nav / Tree / Pagination"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E\u5C5E\u6027"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "TabList"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "items: { value, label, content, disabled? }[]"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Accordion"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "multiple"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "openItems"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "defaultOpenItems"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Breadcrumb"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "items: { children, href?, current? }[]"
            })
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Toolbar"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "ToolbarButton"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "ToolbarDivider"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Nav"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "items"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "selectedValue"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onValueChange"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Tree"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "items"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "openItems"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "selectedItems"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "selectionMode"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onSelect"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Pagination"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "page"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "pageCount"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onPageChange"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "Data / Layout"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Table / DataGrid"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: ["\u7ED3\u6784\u5F0F\u8868\u683C\uFF1A", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "Table"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "TableHeader"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "TableBody"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "TableRow"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "TableHeaderCell"
      }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "TableCell"
      }), "\u3002"]
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: [(0, import_jsx_runtime.jsx)(_components.code, {
        children: "DataGrid"
      }), "\uFF1A"]
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5C5E\u6027"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u8BF4\u660E"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "items"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "columns"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u6570\u636E\u4E0E\u5217\u5B9A\u4E49"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "getRowId"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u884C ID"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "sortable"
            })
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u6392\u5E8F"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "selectionMode"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "none"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "single"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "multiselect"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "selectedItems"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onSelectionChange"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u9009\u62E9"
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "virtualized"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "height"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "rowHeight"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u865A\u62DF\u6EDA\u52A8"
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: ["\u5217\u5B9A\u4E49 ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "DataGridColumnDef"
      }), "\uFF1A", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "columnId"
      }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "label"
      }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "width"
      }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "compare"
      }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "renderCell"
      }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "renderHeaderCell"
      }), "\u3002"]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "List / Stack"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E\u5C5E\u6027"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "List"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "items"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "selectionMode"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "selectedItems"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onSelectionChange"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "Stack"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "horizontal"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "reversed"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "wrap"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "verticalAlign"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "horizontalAlign"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.childrenGap"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "tokens.padding"
            }), "\uFF1B", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "StackItem"
            }), " \u652F\u6301 ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "grow"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "disableShrink"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "align"
            })]
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "\u9009\u62E9\u5668\u8865\u5145"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.table, {
      children: [(0, import_jsx_runtime.jsx)(_components.thead, {
        children: (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u7EC4\u4EF6"
          }), (0, import_jsx_runtime.jsx)(_components.th, {
            children: "\u5173\u952E API"
          })]
        })
      }), (0, import_jsx_runtime.jsxs)(_components.tbody, {
        children: [(0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Tag"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "TagPicker"
            })]
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "appearance"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "size"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "shape"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "dismissible"
            }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onDismiss"
            }), "\uFF1B", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "TagPicker"
            }), ": ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "options"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "selectedOptions"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onOptionSelect"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "placeholder"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "SwatchPicker"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "items"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "value"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onSelectionChange"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "ColorPicker"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "color"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onColorChange"
            }), "\uFF0C\u4EE5\u53CA ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "ColorArea"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "ColorSlider"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "AlphaSlider"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "DatePicker"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "DateRangePicker"
            })]
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "value"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onSelectDate"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onSelectRange"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsx)(_components.td, {
            children: (0, import_jsx_runtime.jsx)(_components.code, {
              children: "TimePicker"
            })
          }), (0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "value"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "minuteStep"
            }), "\u3001", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "onTimeChange"
            })]
          })]
        }), (0, import_jsx_runtime.jsxs)(_components.tr, {
          children: [(0, import_jsx_runtime.jsxs)(_components.td, {
            children: [(0, import_jsx_runtime.jsx)(_components.code, {
              children: "Calendar"
            }), " / ", (0, import_jsx_runtime.jsx)(_components.code, {
              children: "CalendarDateRange"
            })]
          }), (0, import_jsx_runtime.jsx)(_components.td, {
            children: "\u65E5\u5386\u672C\u4F53"
          })]
        })]
      })]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "\u5E38\u89C1\u6A21\u5F0F"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "\u53D7\u63A7\u4E0E\u975E\u53D7\u63A7"
    }), "\n", (0, import_jsx_runtime.jsx)(_components.pre, {
      children: (0, import_jsx_runtime.jsx)(_components.code, {
        className: "language-tsx",
        children: '// \u975E\u53D7\u63A7\uFF1A\u7ED9\u521D\u503C\uFF0C\u7EC4\u4EF6\u5185\u90E8\u7EF4\u62A4\u72B6\u6001\n<Input defaultValue="hello" />\n\n// \u53D7\u63A7\uFF1A\u81EA\u5DF1\u6301\u6709\u72B6\u6001\nconst [v, setV] = createSignal("");\n<Input value={v()} onInput={(e) => setV(e.currentTarget.value)} />\n'
      })
    }), "\n", (0, import_jsx_runtime.jsx)(_components.h3, {
      children: "Field \u8054\u52A8"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.p, {
      children: [(0, import_jsx_runtime.jsx)(_components.code, {
        children: "Field"
      }), " \u4F1A\u81EA\u52A8\u628A ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "label"
      }), " \u4E0E ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "hint"
      }), " \u5173\u8054\u5230\u5185\u90E8\u63A7\u4EF6\uFF08\u901A\u8FC7 context \u6CE8\u5165 ", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "id"
      }), "/", (0, import_jsx_runtime.jsx)(_components.code, {
        children: "aria-*"
      }), "\uFF09\uFF1A"]
    }), "\n", (0, import_jsx_runtime.jsx)(_components.pre, {
      children: (0, import_jsx_runtime.jsx)(_components.code, {
        className: "language-tsx",
        children: '<Field label="\u90AE\u7BB1" hint="\u7528\u4E8E\u767B\u5F55" validationState="none">\n  <Input type="email" />\n</Field>\n'
      })
    }), "\n", (0, import_jsx_runtime.jsx)(_components.hr, {}), "\n", (0, import_jsx_runtime.jsx)(_components.h2, {
      children: "\u5DF2\u77E5\u9650\u5236"
    }), "\n", (0, import_jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0, import_jsx_runtime.jsx)(_components.li, {
        children: "TypeScript docgen \u5DF2\u5173\u95ED\uFF08\u517C\u5BB9 TS 7\uFF09\uFF0C\u56E0\u6B64\u672C\u9875\u4E0E\u5404 Story Docs \u662F Props \u7684\u6743\u5A01\u6765\u6E90\u3002"
      }), "\n", (0, import_jsx_runtime.jsxs)(_components.li, {
        children: ["\u5E76\u975E\u6240\u6709 Fluent UI v9 \u7684 Props \u90FD 1:1 \u5B9E\u73B0\uFF0C\u65B0\u589E\u7EC4\u4EF6\u4E0E\u5B57\u6BB5\u4EE5\u672C\u4ED3\u5E93\u6E90\u7801\u4E3A\u51C6\uFF08", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "src/components"
        }), "\uFF09\u3002"]
      }), "\n", (0, import_jsx_runtime.jsxs)(_components.li, {
        children: ["\u90E8\u5206\u6DF1\u5EA6\u4EA4\u4E92\uFF08\u865A\u62DF\u8868\u683C\u3001\u65E5\u671F\u8303\u56F4\u3001\u952E\u76D8\u5BFC\u822A\uFF09\u96C6\u4E2D\u5728 ", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "Polish"
        }), " \u4E0E ", (0, import_jsx_runtime.jsx)(_components.code, {
          children: "Complete"
        }), " \u5206\u7C7B\u6F14\u793A\u3002"]
      }), "\n"]
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
    ...props,
    children: (0, import_jsx_runtime.jsx)(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
export {
  MDXContent as default
};
/*! Bundled license information:

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
