import {
  _extends,
  require_jsx_runtime
} from "./chunk-BON3UWJ6.js";
import {
  __commonJS,
  __export,
  __toESM,
  require_react
} from "./chunk-DDNM7ENY.js";

// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
var require_use_sync_external_store_shim_development = __commonJS({
  "node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React3 = require_react();
        var ReactSharedInternals = React3.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useState3 = React3.useState, useEffect11 = React3.useEffect, useLayoutEffect2 = React3.useLayoutEffect, useDebugValue = React3.useDebugValue;
        var didWarnOld18Alpha = false;
        var didWarnUncachedGetSnapshot = false;
        function useSyncExternalStore2(subscribe, getSnapshot, getServerSnapshot) {
          {
            if (!didWarnOld18Alpha) {
              if (React3.startTransition !== void 0) {
                didWarnOld18Alpha = true;
                error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.");
              }
            }
          }
          var value = getSnapshot();
          {
            if (!didWarnUncachedGetSnapshot) {
              var cachedValue = getSnapshot();
              if (!objectIs(value, cachedValue)) {
                error("The result of getSnapshot should be cached to avoid an infinite loop");
                didWarnUncachedGetSnapshot = true;
              }
            }
          }
          var _useState = useState3({
            inst: {
              value,
              getSnapshot
            }
          }), inst = _useState[0].inst, forceUpdate = _useState[1];
          useLayoutEffect2(function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
          }, [subscribe, value, getSnapshot]);
          useEffect11(function() {
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
            var handleStoreChange = function() {
              if (checkIfSnapshotChanged(inst)) {
                forceUpdate({
                  inst
                });
              }
            };
            return subscribe(handleStoreChange);
          }, [subscribe]);
          useDebugValue(value);
          return value;
        }
        function checkIfSnapshotChanged(inst) {
          var latestGetSnapshot = inst.getSnapshot;
          var prevValue = inst.value;
          try {
            var nextValue = latestGetSnapshot();
            return !objectIs(prevValue, nextValue);
          } catch (error2) {
            return true;
          }
        }
        function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
          return getSnapshot();
        }
        var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
        var isServerEnvironment = !canUseDOM;
        var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore2;
        var useSyncExternalStore$2 = React3.useSyncExternalStore !== void 0 ? React3.useSyncExternalStore : shim;
        exports.useSyncExternalStore = useSyncExternalStore$2;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/use-sync-external-store/shim/index.js
var require_shim = __commonJS({
  "node_modules/use-sync-external-store/shim/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_use_sync_external_store_shim_development();
    }
  }
});

// node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS({
  "node_modules/react-is/cjs/react-is.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var hasSymbol = typeof Symbol === "function" && Symbol.for;
        var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
        var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
        var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
        var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
        var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
        var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
        var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
        var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
        var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
        var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
        var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
        var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
        var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
        var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
        var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
        var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
        var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
        var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
        function isValidElementType(type) {
          return typeof type === "string" || typeof type === "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
          type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
        }
        function typeOf(object) {
          if (typeof object === "object" && object !== null) {
            var $$typeof = object.$$typeof;
            switch ($$typeof) {
              case REACT_ELEMENT_TYPE:
                var type = object.type;
                switch (type) {
                  case REACT_ASYNC_MODE_TYPE:
                  case REACT_CONCURRENT_MODE_TYPE:
                  case REACT_FRAGMENT_TYPE:
                  case REACT_PROFILER_TYPE:
                  case REACT_STRICT_MODE_TYPE:
                  case REACT_SUSPENSE_TYPE:
                    return type;
                  default:
                    var $$typeofType = type && type.$$typeof;
                    switch ($$typeofType) {
                      case REACT_CONTEXT_TYPE:
                      case REACT_FORWARD_REF_TYPE:
                      case REACT_LAZY_TYPE:
                      case REACT_MEMO_TYPE:
                      case REACT_PROVIDER_TYPE:
                        return $$typeofType;
                      default:
                        return $$typeof;
                    }
                }
              case REACT_PORTAL_TYPE:
                return $$typeof;
            }
          }
          return void 0;
        }
        var AsyncMode = REACT_ASYNC_MODE_TYPE;
        var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false;
        function isAsyncMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsAsyncMode) {
              hasWarnedAboutDeprecatedIsAsyncMode = true;
              console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
            }
          }
          return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
        }
        function isConcurrentMode(object) {
          return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
        }
        function isContextConsumer(object) {
          return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        function isContextProvider(object) {
          return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        function isElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function isForwardRef(object) {
          return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        function isFragment(object) {
          return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        function isLazy(object) {
          return typeOf(object) === REACT_LAZY_TYPE;
        }
        function isMemo(object) {
          return typeOf(object) === REACT_MEMO_TYPE;
        }
        function isPortal(object) {
          return typeOf(object) === REACT_PORTAL_TYPE;
        }
        function isProfiler(object) {
          return typeOf(object) === REACT_PROFILER_TYPE;
        }
        function isStrictMode(object) {
          return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        function isSuspense(object) {
          return typeOf(object) === REACT_SUSPENSE_TYPE;
        }
        exports.AsyncMode = AsyncMode;
        exports.ConcurrentMode = ConcurrentMode;
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
        exports.isValidElementType = isValidElementType;
        exports.typeOf = typeOf;
      })();
    }
  }
});

// node_modules/react-is/index.js
var require_react_is = __commonJS({
  "node_modules/react-is/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_is_development();
    }
  }
});

// node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
var require_hoist_non_react_statics_cjs = __commonJS({
  "node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"(exports, module) {
    "use strict";
    var reactIs = require_react_is();
    var REACT_STATICS = {
      childContextTypes: true,
      contextType: true,
      contextTypes: true,
      defaultProps: true,
      displayName: true,
      getDefaultProps: true,
      getDerivedStateFromError: true,
      getDerivedStateFromProps: true,
      mixins: true,
      propTypes: true,
      type: true
    };
    var KNOWN_STATICS = {
      name: true,
      length: true,
      prototype: true,
      caller: true,
      callee: true,
      arguments: true,
      arity: true
    };
    var FORWARD_REF_STATICS = {
      "$$typeof": true,
      render: true,
      defaultProps: true,
      displayName: true,
      propTypes: true
    };
    var MEMO_STATICS = {
      "$$typeof": true,
      compare: true,
      defaultProps: true,
      displayName: true,
      propTypes: true,
      type: true
    };
    var TYPE_STATICS = {};
    TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
    TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
    function getStatics(component) {
      if (reactIs.isMemo(component)) {
        return MEMO_STATICS;
      }
      return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
    }
    var defineProperty = Object.defineProperty;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var getPrototypeOf = Object.getPrototypeOf;
    var objectPrototype = Object.prototype;
    function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
      if (typeof sourceComponent !== "string") {
        if (objectPrototype) {
          var inheritedComponent = getPrototypeOf(sourceComponent);
          if (inheritedComponent && inheritedComponent !== objectPrototype) {
            hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
          }
        }
        var keys = getOwnPropertyNames(sourceComponent);
        if (getOwnPropertySymbols) {
          keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }
        var targetStatics = getStatics(targetComponent);
        var sourceStatics = getStatics(sourceComponent);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
            var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
            try {
              defineProperty(targetComponent, key, descriptor);
            } catch (e) {
            }
          }
        }
      }
      return targetComponent;
    }
    module.exports = hoistNonReactStatics;
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal2(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal2(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal2(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/react-arborist/dist/module/components/tree.js
var import_jsx_runtime16 = __toESM(require_jsx_runtime());
var import_react34 = __toESM(require_react());

// node_modules/react-arborist/dist/module/components/provider.js
var import_jsx_runtime13 = __toESM(require_jsx_runtime());
var import_react32 = __toESM(require_react());
var import_shim = __toESM(require_shim());

// node_modules/react-arborist/dist/module/context.js
var import_react = __toESM(require_react());
var TreeApiContext = (0, import_react.createContext)(null);
function useTreeApi() {
  const value = (0, import_react.useContext)(TreeApiContext);
  if (value === null)
    throw new Error("No Tree Api Provided");
  return value;
}
var NodesContext = (0, import_react.createContext)(null);
function useNodesContext() {
  const value = (0, import_react.useContext)(NodesContext);
  if (value === null)
    throw new Error("Provide a NodesContext");
  return value;
}
var DndContext = (0, import_react.createContext)(null);
function useDndContext() {
  const value = (0, import_react.useContext)(DndContext);
  if (value === null)
    throw new Error("Provide a DnDContext");
  return value;
}
var DataUpdatesContext = (0, import_react.createContext)(0);
function useDataUpdates() {
  (0, import_react.useContext)(DataUpdatesContext);
}

// node_modules/react-arborist/dist/module/utils.js
var utils_exports = {};
__export(utils_exports, {
  access: () => access,
  bound: () => bound,
  dfs: () => dfs,
  focusNextElement: () => focusNextElement,
  focusPrevElement: () => focusPrevElement,
  getInsertIndex: () => getInsertIndex,
  getInsertParentId: () => getInsertParentId,
  identify: () => identify,
  identifyNull: () => identifyNull,
  indexOf: () => indexOf,
  isClosed: () => isClosed,
  isDescendant: () => isDescendant,
  isItem: () => isItem,
  isOpenWithEmptyChildren: () => isOpenWithEmptyChildren,
  mergeRefs: () => mergeRefs,
  noop: () => noop,
  safeRun: () => safeRun,
  waitFor: () => waitFor,
  walk: () => walk
});
function bound(n, min, max) {
  return Math.max(Math.min(n, max), min);
}
function isItem(node) {
  return node && node.isLeaf;
}
function isClosed(node) {
  return node && node.isInternal && !node.isOpen;
}
function isOpenWithEmptyChildren(node) {
  var _a;
  return node && node.isOpen && !((_a = node.children) === null || _a === void 0 ? void 0 : _a.length);
}
var isDescendant = (a, b) => {
  let n = a;
  while (n) {
    if (n.id === b.id)
      return true;
    n = n.parent;
  }
  return false;
};
var indexOf = (node) => {
  if (!node.parent)
    throw Error("Node does not have a parent");
  return node.parent.children.findIndex((c) => c.id === node.id);
};
function noop() {
}
function dfs(node, id) {
  if (!node)
    return null;
  if (node.id === id)
    return node;
  if (node.children) {
    for (let child of node.children) {
      const result = dfs(child, id);
      if (result)
        return result;
    }
  }
  return null;
}
function walk(node, fn) {
  fn(node);
  if (node.children) {
    for (let child of node.children) {
      walk(child, fn);
    }
  }
}
function focusNextElement(target) {
  const elements = getFocusable(target);
  let next;
  for (let i = 0; i < elements.length; ++i) {
    const item = elements[i];
    if (item === target) {
      next = nextItem(elements, i);
      break;
    }
  }
  next === null || next === void 0 ? void 0 : next.focus();
}
function focusPrevElement(target) {
  const elements = getFocusable(target);
  let next;
  for (let i = 0; i < elements.length; ++i) {
    const item = elements[i];
    if (item === target) {
      next = prevItem(elements, i);
      break;
    }
  }
  next === null || next === void 0 ? void 0 : next.focus();
}
function nextItem(list, index) {
  if (index + 1 < list.length) {
    return list[index + 1];
  } else {
    return list[0];
  }
}
function prevItem(list, index) {
  if (index - 1 >= 0) {
    return list[index - 1];
  } else {
    return list[list.length - 1];
  }
}
function getFocusable(target) {
  return Array.from(document.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)')).filter((e) => e === target || !target.contains(e));
}
function access(obj, accessor) {
  if (typeof accessor === "boolean")
    return accessor;
  if (typeof accessor === "string")
    return obj[accessor];
  return accessor(obj);
}
function identifyNull(obj) {
  if (obj === null)
    return null;
  else
    return identify(obj);
}
function identify(obj) {
  return typeof obj === "string" ? obj : obj.id;
}
function mergeRefs(...refs) {
  return (instance) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref != null) {
        ref.current = instance;
      }
    });
  };
}
function safeRun(fn, ...args) {
  if (fn)
    return fn(...args);
}
function waitFor(fn) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    function check() {
      tries += 1;
      if (tries === 100)
        reject();
      if (fn())
        resolve();
      else
        setTimeout(check, 10);
    }
    check();
  });
}
function getInsertIndex(tree) {
  var _a, _b;
  const focus2 = tree.focusedNode;
  if (!focus2)
    return (_b = (_a = tree.root.children) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
  if (focus2.isOpen)
    return 0;
  if (focus2.parent)
    return focus2.childIndex + 1;
  return 0;
}
function getInsertParentId(tree) {
  const focus2 = tree.focusedNode;
  if (!focus2)
    return null;
  if (focus2.isOpen)
    return focus2.id;
  if (focus2.parent && !focus2.parent.isRoot)
    return focus2.parent.id;
  return null;
}

// node_modules/react-arborist/dist/module/components/default-cursor.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_react2 = __toESM(require_react());
var placeholderStyle = {
  display: "flex",
  alignItems: "center",
  zIndex: 1
};
var lineStyle = {
  flex: 1,
  height: "2px",
  background: "#4B91E2",
  borderRadius: "1px"
};
var circleStyle = {
  width: "4px",
  height: "4px",
  boxShadow: "0 0 0 3px #4B91E2",
  borderRadius: "50%"
};
var DefaultCursor = import_react2.default.memo(function DefaultCursor2({ top, left, indent }) {
  const style = {
    position: "absolute",
    pointerEvents: "none",
    top: top - 2 + "px",
    left: left + "px",
    right: indent + "px"
  };
  return (0, import_jsx_runtime.jsxs)("div", { style: Object.assign(Object.assign({}, placeholderStyle), style), children: [(0, import_jsx_runtime.jsx)("div", { style: Object.assign({}, circleStyle) }), (0, import_jsx_runtime.jsx)("div", { style: Object.assign({}, lineStyle) })] });
});

// node_modules/react-arborist/dist/module/components/default-row.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
function DefaultRow({ node, attrs, innerRef, children }) {
  return (0, import_jsx_runtime2.jsx)("div", Object.assign({}, attrs, { ref: innerRef, onFocus: (e) => e.stopPropagation(), onClick: node.handleClick, children }));
}

// node_modules/react-arborist/dist/module/components/default-node.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var import_react3 = __toESM(require_react());
function DefaultNode(props) {
  return (0, import_jsx_runtime3.jsxs)("div", { ref: props.dragHandle, style: props.style, children: [(0, import_jsx_runtime3.jsx)("span", { onClick: (e) => {
    e.stopPropagation();
    props.node.toggle();
  }, children: props.node.isLeaf ? "🌳" : props.node.isOpen ? "🗁" : "🗀" }), " ", props.node.isEditing ? (0, import_jsx_runtime3.jsx)(Edit, Object.assign({}, props)) : (0, import_jsx_runtime3.jsx)(Show, Object.assign({}, props))] });
}
function Show(props) {
  return (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: (0, import_jsx_runtime3.jsx)("span", { children: props.node.data.name }) });
}
function Edit({ node }) {
  const input = (0, import_react3.useRef)();
  (0, import_react3.useEffect)(() => {
    var _a, _b;
    (_a = input.current) === null || _a === void 0 ? void 0 : _a.focus();
    (_b = input.current) === null || _b === void 0 ? void 0 : _b.select();
  }, []);
  return (0, import_jsx_runtime3.jsx)("input", {
    ref: input,
    // @ts-ignore
    defaultValue: node.data.name,
    onBlur: () => node.reset(),
    onKeyDown: (e) => {
      var _a;
      if (e.key === "Escape")
        node.reset();
      if (e.key === "Enter")
        node.submit(((_a = input.current) === null || _a === void 0 ? void 0 : _a.value) || "");
    }
  });
}

// node_modules/react-arborist/dist/module/state/edit-slice.js
function edit(id) {
  return { type: "EDIT", id };
}
function reducer(state = { id: null }, action) {
  if (action.type === "EDIT") {
    return Object.assign(Object.assign({}, state), { id: action.id });
  } else {
    return state;
  }
}

// node_modules/react-arborist/dist/module/state/focus-slice.js
function focus(id) {
  return { type: "FOCUS", id };
}
function treeBlur() {
  return { type: "TREE_BLUR" };
}
function reducer2(state = { id: null, treeFocused: false }, action) {
  if (action.type === "FOCUS") {
    return Object.assign(Object.assign({}, state), { id: action.id, treeFocused: true });
  } else if (action.type === "TREE_BLUR") {
    return Object.assign(Object.assign({}, state), { treeFocused: false });
  } else {
    return state;
  }
}

// node_modules/react-arborist/dist/module/interfaces/node-api.js
var NodeApi = class _NodeApi {
  constructor(params) {
    this.handleClick = (e) => {
      if (e.metaKey && !this.tree.props.disableMultiSelection) {
        this.isSelected ? this.deselect() : this.selectMulti();
      } else if (e.shiftKey && !this.tree.props.disableMultiSelection) {
        this.selectContiguous();
      } else {
        this.select();
        this.activate();
      }
    };
    this.tree = params.tree;
    this.id = params.id;
    this.data = params.data;
    this.level = params.level;
    this.children = params.children;
    this.parent = params.parent;
    this.isDraggable = params.isDraggable;
    this.rowIndex = params.rowIndex;
  }
  get isRoot() {
    return this.id === ROOT_ID;
  }
  get isLeaf() {
    return !Array.isArray(this.children);
  }
  get isInternal() {
    return !this.isLeaf;
  }
  get isOpen() {
    return this.isLeaf ? false : this.tree.isOpen(this.id);
  }
  get isClosed() {
    return this.isLeaf ? false : !this.tree.isOpen(this.id);
  }
  get isEditable() {
    return this.tree.isEditable(this.data);
  }
  get isEditing() {
    return this.tree.editingId === this.id;
  }
  get isSelected() {
    return this.tree.isSelected(this.id);
  }
  get isOnlySelection() {
    return this.isSelected && this.tree.hasOneSelection;
  }
  get isSelectedStart() {
    var _a;
    return this.isSelected && !((_a = this.prev) === null || _a === void 0 ? void 0 : _a.isSelected);
  }
  get isSelectedEnd() {
    var _a;
    return this.isSelected && !((_a = this.next) === null || _a === void 0 ? void 0 : _a.isSelected);
  }
  get isFocused() {
    return this.tree.isFocused(this.id);
  }
  get isDragging() {
    return this.tree.isDragging(this.id);
  }
  get willReceiveDrop() {
    return this.tree.willReceiveDrop(this.id);
  }
  get state() {
    return {
      isClosed: this.isClosed,
      isDragging: this.isDragging,
      isEditing: this.isEditing,
      isFocused: this.isFocused,
      isInternal: this.isInternal,
      isLeaf: this.isLeaf,
      isOpen: this.isOpen,
      isSelected: this.isSelected,
      isSelectedEnd: this.isSelectedEnd,
      isSelectedStart: this.isSelectedStart,
      willReceiveDrop: this.willReceiveDrop
    };
  }
  get childIndex() {
    if (this.parent && this.parent.children) {
      return this.parent.children.findIndex((child) => child.id === this.id);
    } else {
      return -1;
    }
  }
  get next() {
    if (this.rowIndex === null)
      return null;
    return this.tree.at(this.rowIndex + 1);
  }
  get prev() {
    if (this.rowIndex === null)
      return null;
    return this.tree.at(this.rowIndex - 1);
  }
  get nextSibling() {
    var _a, _b;
    const i = this.childIndex;
    return (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.children[i + 1]) !== null && _b !== void 0 ? _b : null;
  }
  isAncestorOf(node) {
    if (!node)
      return false;
    let ancestor = node;
    while (ancestor) {
      if (ancestor.id === this.id)
        return true;
      ancestor = ancestor.parent;
    }
    return false;
  }
  select() {
    this.tree.select(this);
  }
  deselect() {
    this.tree.deselect(this);
  }
  selectMulti() {
    this.tree.selectMulti(this);
  }
  selectContiguous() {
    this.tree.selectContiguous(this);
  }
  activate() {
    this.tree.activate(this);
  }
  focus() {
    this.tree.focus(this);
  }
  toggle() {
    this.tree.toggle(this);
  }
  open() {
    this.tree.open(this);
  }
  openParents() {
    this.tree.openParents(this);
  }
  close() {
    this.tree.close(this);
  }
  submit(value) {
    this.tree.submit(this, value);
  }
  reset() {
    this.tree.reset();
  }
  clone() {
    return new _NodeApi(Object.assign({}, this));
  }
  edit() {
    return this.tree.edit(this);
  }
};

// node_modules/react-arborist/dist/module/data/create-root.js
var ROOT_ID = "__REACT_ARBORIST_INTERNAL_ROOT__";
function createRoot(tree) {
  var _a;
  function visitSelfAndChildren(data2, level, parent) {
    const id = tree.accessId(data2);
    const node = new NodeApi({
      tree,
      data: data2,
      level,
      parent,
      id,
      children: null,
      isDraggable: tree.isDraggable(data2),
      rowIndex: null
    });
    const children = tree.accessChildren(data2);
    if (children) {
      node.children = children.map((child) => visitSelfAndChildren(child, level + 1, node));
    }
    return node;
  }
  const root = new NodeApi({
    tree,
    id: ROOT_ID,
    // @ts-ignore
    data: { id: ROOT_ID },
    level: -1,
    parent: null,
    children: null,
    isDraggable: true,
    rowIndex: null
  });
  const data = (_a = tree.props.data) !== null && _a !== void 0 ? _a : [];
  root.children = data.map((child) => {
    return visitSelfAndChildren(child, 0, root);
  });
  return root;
}

// node_modules/react-arborist/dist/module/state/open-slice.js
var actions = {
  open(id, filtered) {
    return { type: "VISIBILITY_OPEN", id, filtered };
  },
  close(id, filtered) {
    return { type: "VISIBILITY_CLOSE", id, filtered };
  },
  toggle(id, filtered) {
    return { type: "VISIBILITY_TOGGLE", id, filtered };
  },
  clear(filtered) {
    return { type: "VISIBILITY_CLEAR", filtered };
  }
};
function openMapReducer(state = {}, action) {
  if (action.type === "VISIBILITY_OPEN") {
    return Object.assign(Object.assign({}, state), { [action.id]: true });
  } else if (action.type === "VISIBILITY_CLOSE") {
    return Object.assign(Object.assign({}, state), { [action.id]: false });
  } else if (action.type === "VISIBILITY_TOGGLE") {
    const prev = state[action.id];
    return Object.assign(Object.assign({}, state), { [action.id]: !prev });
  } else if (action.type === "VISIBILITY_CLEAR") {
    return {};
  } else {
    return state;
  }
}
function reducer3(state = { filtered: {}, unfiltered: {} }, action) {
  if (!action.type.startsWith("VISIBILITY"))
    return state;
  if (action.filtered) {
    return Object.assign(Object.assign({}, state), { filtered: openMapReducer(state.filtered, action) });
  } else {
    return Object.assign(Object.assign({}, state), { unfiltered: openMapReducer(state.unfiltered, action) });
  }
}

// node_modules/react-arborist/dist/module/state/initial.js
var initialState = (props) => {
  var _a;
  return {
    nodes: {
      // Changes together
      open: { filtered: {}, unfiltered: (_a = props === null || props === void 0 ? void 0 : props.initialOpenState) !== null && _a !== void 0 ? _a : {} },
      focus: { id: null, treeFocused: false },
      edit: { id: null },
      drag: {
        id: null,
        selectedIds: [],
        destinationParentId: null,
        destinationIndex: null
      },
      selection: { ids: /* @__PURE__ */ new Set(), anchor: null, mostRecent: null }
    },
    dnd: {
      cursor: { type: "none" },
      dragId: null,
      dragIds: [],
      parentId: null,
      index: -1
    }
  };
};

// node_modules/react-arborist/dist/module/state/selection-slice.js
var actions2 = {
  clear: () => ({ type: "SELECTION_CLEAR" }),
  only: (id) => ({
    type: "SELECTION_ONLY",
    id: identify(id)
  }),
  add: (id) => ({
    type: "SELECTION_ADD",
    ids: (Array.isArray(id) ? id : [id]).map(identify)
  }),
  remove: (id) => ({
    type: "SELECTION_REMOVE",
    ids: (Array.isArray(id) ? id : [id]).map(identify)
  }),
  set: (args) => Object.assign({ type: "SELECTION_SET" }, args),
  mostRecent: (id) => ({
    type: "SELECTION_MOST_RECENT",
    id: id === null ? null : identify(id)
  }),
  anchor: (id) => ({
    type: "SELECTION_ANCHOR",
    id: id === null ? null : identify(id)
  })
};
function reducer4(state = initialState()["nodes"]["selection"], action) {
  const ids = state.ids;
  switch (action.type) {
    case "SELECTION_CLEAR":
      return Object.assign(Object.assign({}, state), { ids: /* @__PURE__ */ new Set() });
    case "SELECTION_ONLY":
      return Object.assign(Object.assign({}, state), { ids: /* @__PURE__ */ new Set([action.id]) });
    case "SELECTION_ADD":
      if (action.ids.length === 0)
        return state;
      action.ids.forEach((id) => ids.add(id));
      return Object.assign(Object.assign({}, state), { ids: new Set(ids) });
    case "SELECTION_REMOVE":
      if (action.ids.length === 0)
        return state;
      action.ids.forEach((id) => ids.delete(id));
      return Object.assign(Object.assign({}, state), { ids: new Set(ids) });
    case "SELECTION_SET":
      return Object.assign(Object.assign({}, state), { ids: action.ids, mostRecent: action.mostRecent, anchor: action.anchor });
    case "SELECTION_MOST_RECENT":
      return Object.assign(Object.assign({}, state), { mostRecent: action.id });
    case "SELECTION_ANCHOR":
      return Object.assign(Object.assign({}, state), { anchor: action.id });
    default:
      return state;
  }
}

// node_modules/react-arborist/dist/module/state/dnd-slice.js
var actions3 = {
  cursor(cursor) {
    return { type: "DND_CURSOR", cursor };
  },
  dragStart(id, dragIds) {
    return { type: "DND_DRAG_START", id, dragIds };
  },
  dragEnd() {
    return { type: "DND_DRAG_END" };
  },
  hovering(parentId, index) {
    return { type: "DND_HOVERING", parentId, index };
  }
};
function reducer5(state = initialState()["dnd"], action) {
  switch (action.type) {
    case "DND_CURSOR":
      return Object.assign(Object.assign({}, state), { cursor: action.cursor });
    case "DND_DRAG_START":
      return Object.assign(Object.assign({}, state), { dragId: action.id, dragIds: action.dragIds });
    case "DND_DRAG_END":
      return initialState()["dnd"];
    case "DND_HOVERING":
      return Object.assign(Object.assign({}, state), { parentId: action.parentId, index: action.index });
    default:
      return state;
  }
}

// node_modules/react-arborist/dist/module/components/default-drag-preview.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var import_react4 = __toESM(require_react());
var layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%"
};
var getStyle = (offset) => {
  if (!offset)
    return { display: "none" };
  const { x, y } = offset;
  return { transform: `translate(${x}px, ${y}px)` };
};
var getCountStyle = (offset) => {
  if (!offset)
    return { display: "none" };
  const { x, y } = offset;
  return { transform: `translate(${x + 10}px, ${y + 10}px)` };
};
function DefaultDragPreview({ offset, mouse, id, dragIds, isDragging }) {
  return (0, import_jsx_runtime4.jsxs)(Overlay, { isDragging, children: [(0, import_jsx_runtime4.jsx)(Position, { offset, children: (0, import_jsx_runtime4.jsx)(PreviewNode, { id, dragIds }) }), (0, import_jsx_runtime4.jsx)(Count, { mouse, count: dragIds.length })] });
}
var Overlay = (0, import_react4.memo)(function Overlay2(props) {
  if (!props.isDragging)
    return null;
  return (0, import_jsx_runtime4.jsx)("div", { style: layerStyles, children: props.children });
});
function Position(props) {
  return (0, import_jsx_runtime4.jsx)("div", { className: "row preview", style: getStyle(props.offset), children: props.children });
}
function Count(props) {
  const { count, mouse } = props;
  if (count > 1)
    return (0, import_jsx_runtime4.jsx)("div", { className: "selected-count", style: getCountStyle(mouse), children: count });
  else
    return null;
}
var PreviewNode = (0, import_react4.memo)(function PreviewNode2(props) {
  const tree = useTreeApi();
  const node = tree.get(props.id);
  if (!node)
    return null;
  return (0, import_jsx_runtime4.jsx)(tree.renderNode, { preview: true, node, style: {
    paddingLeft: node.level * tree.indent,
    opacity: 0.2,
    background: "transparent"
  }, tree });
});

// node_modules/react-arborist/dist/module/components/default-container.js
var import_jsx_runtime12 = __toESM(require_jsx_runtime());

// node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}

// node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
  }, _setPrototypeOf(t, e);
}

// node_modules/@babel/runtime/helpers/esm/inheritsLoose.js
function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}

// node_modules/memoize-one/dist/memoize-one.esm.js
var safeIsNaN = Number.isNaN || function ponyfill(value) {
  return typeof value === "number" && value !== value;
};
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}
function memoizeOne(resultFn, isEqual2) {
  if (isEqual2 === void 0) {
    isEqual2 = areInputsEqual;
  }
  var lastThis;
  var lastArgs = [];
  var lastResult;
  var calledOnce = false;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (calledOnce && lastThis === this && isEqual2(newArgs, lastArgs)) {
      return lastResult;
    }
    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  }
  return memoized;
}
var memoize_one_esm_default = memoizeOne;

// node_modules/react-window/dist/index.esm.js
var import_react5 = __toESM(require_react());
var hasNativePerformanceNow = typeof performance === "object" && typeof performance.now === "function";
var now = hasNativePerformanceNow ? function() {
  return performance.now();
} : function() {
  return Date.now();
};
function cancelTimeout(timeoutID) {
  cancelAnimationFrame(timeoutID.id);
}
function requestTimeout(callback, delay) {
  var start = now();
  function tick() {
    if (now() - start >= delay) {
      callback.call(null);
    } else {
      timeoutID.id = requestAnimationFrame(tick);
    }
  }
  var timeoutID = {
    id: requestAnimationFrame(tick)
  };
  return timeoutID;
}
var size = -1;
function getScrollbarSize(recalculate) {
  if (recalculate === void 0) {
    recalculate = false;
  }
  if (size === -1 || recalculate) {
    var div = document.createElement("div");
    var style = div.style;
    style.width = "50px";
    style.height = "50px";
    style.overflow = "scroll";
    document.body.appendChild(div);
    size = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  }
  return size;
}
var cachedRTLResult = null;
function getRTLOffsetType(recalculate) {
  if (recalculate === void 0) {
    recalculate = false;
  }
  if (cachedRTLResult === null || recalculate) {
    var outerDiv = document.createElement("div");
    var outerStyle = outerDiv.style;
    outerStyle.width = "50px";
    outerStyle.height = "50px";
    outerStyle.overflow = "scroll";
    outerStyle.direction = "rtl";
    var innerDiv = document.createElement("div");
    var innerStyle = innerDiv.style;
    innerStyle.width = "100px";
    innerStyle.height = "100px";
    outerDiv.appendChild(innerDiv);
    document.body.appendChild(outerDiv);
    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = "positive-descending";
    } else {
      outerDiv.scrollLeft = 1;
      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = "negative";
      } else {
        cachedRTLResult = "positive-ascending";
      }
    }
    document.body.removeChild(outerDiv);
    return cachedRTLResult;
  }
  return cachedRTLResult;
}
var IS_SCROLLING_DEBOUNCE_INTERVAL = 150;
var defaultItemKey = function defaultItemKey2(_ref) {
  var columnIndex = _ref.columnIndex, data = _ref.data, rowIndex = _ref.rowIndex;
  return rowIndex + ":" + columnIndex;
};
var devWarningsOverscanCount = null;
var devWarningsOverscanRowsColumnsCount = null;
var devWarningsTagName = null;
if (true) {
  if (typeof window !== "undefined" && typeof window.WeakSet !== "undefined") {
    devWarningsOverscanCount = /* @__PURE__ */ new WeakSet();
    devWarningsOverscanRowsColumnsCount = /* @__PURE__ */ new WeakSet();
    devWarningsTagName = /* @__PURE__ */ new WeakSet();
  }
}
function createGridComponent(_ref2) {
  var _class;
  var getColumnOffset3 = _ref2.getColumnOffset, getColumnStartIndexForOffset3 = _ref2.getColumnStartIndexForOffset, getColumnStopIndexForStartIndex3 = _ref2.getColumnStopIndexForStartIndex, getColumnWidth3 = _ref2.getColumnWidth, getEstimatedTotalHeight4 = _ref2.getEstimatedTotalHeight, getEstimatedTotalWidth4 = _ref2.getEstimatedTotalWidth, getOffsetForColumnAndAlignment3 = _ref2.getOffsetForColumnAndAlignment, getOffsetForRowAndAlignment3 = _ref2.getOffsetForRowAndAlignment, getRowHeight3 = _ref2.getRowHeight, getRowOffset3 = _ref2.getRowOffset, getRowStartIndexForOffset3 = _ref2.getRowStartIndexForOffset, getRowStopIndexForStartIndex3 = _ref2.getRowStopIndexForStartIndex, initInstanceProps5 = _ref2.initInstanceProps, shouldResetStyleCacheOnItemSizeChange = _ref2.shouldResetStyleCacheOnItemSizeChange, validateProps5 = _ref2.validateProps;
  return _class = function(_PureComponent) {
    _inheritsLoose(Grid, _PureComponent);
    function Grid(props) {
      var _this;
      _this = _PureComponent.call(this, props) || this;
      _this._instanceProps = initInstanceProps5(_this.props, _assertThisInitialized(_this));
      _this._resetIsScrollingTimeoutId = null;
      _this._outerRef = void 0;
      _this.state = {
        instance: _assertThisInitialized(_this),
        isScrolling: false,
        horizontalScrollDirection: "forward",
        scrollLeft: typeof _this.props.initialScrollLeft === "number" ? _this.props.initialScrollLeft : 0,
        scrollTop: typeof _this.props.initialScrollTop === "number" ? _this.props.initialScrollTop : 0,
        scrollUpdateWasRequested: false,
        verticalScrollDirection: "forward"
      };
      _this._callOnItemsRendered = void 0;
      _this._callOnItemsRendered = memoize_one_esm_default(function(overscanColumnStartIndex, overscanColumnStopIndex, overscanRowStartIndex, overscanRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex, visibleRowStartIndex, visibleRowStopIndex) {
        return _this.props.onItemsRendered({
          overscanColumnStartIndex,
          overscanColumnStopIndex,
          overscanRowStartIndex,
          overscanRowStopIndex,
          visibleColumnStartIndex,
          visibleColumnStopIndex,
          visibleRowStartIndex,
          visibleRowStopIndex
        });
      });
      _this._callOnScroll = void 0;
      _this._callOnScroll = memoize_one_esm_default(function(scrollLeft, scrollTop, horizontalScrollDirection, verticalScrollDirection, scrollUpdateWasRequested) {
        return _this.props.onScroll({
          horizontalScrollDirection,
          scrollLeft,
          scrollTop,
          verticalScrollDirection,
          scrollUpdateWasRequested
        });
      });
      _this._getItemStyle = void 0;
      _this._getItemStyle = function(rowIndex, columnIndex) {
        var _this$props = _this.props, columnWidth = _this$props.columnWidth, direction = _this$props.direction, rowHeight = _this$props.rowHeight;
        var itemStyleCache = _this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && columnWidth, shouldResetStyleCacheOnItemSizeChange && direction, shouldResetStyleCacheOnItemSizeChange && rowHeight);
        var key = rowIndex + ":" + columnIndex;
        var style;
        if (itemStyleCache.hasOwnProperty(key)) {
          style = itemStyleCache[key];
        } else {
          var _offset = getColumnOffset3(_this.props, columnIndex, _this._instanceProps);
          var isRtl = direction === "rtl";
          itemStyleCache[key] = style = {
            position: "absolute",
            left: isRtl ? void 0 : _offset,
            right: isRtl ? _offset : void 0,
            top: getRowOffset3(_this.props, rowIndex, _this._instanceProps),
            height: getRowHeight3(_this.props, rowIndex, _this._instanceProps),
            width: getColumnWidth3(_this.props, columnIndex, _this._instanceProps)
          };
        }
        return style;
      };
      _this._getItemStyleCache = void 0;
      _this._getItemStyleCache = memoize_one_esm_default(function(_, __, ___) {
        return {};
      });
      _this._onScroll = function(event) {
        var _event$currentTarget = event.currentTarget, clientHeight = _event$currentTarget.clientHeight, clientWidth = _event$currentTarget.clientWidth, scrollLeft = _event$currentTarget.scrollLeft, scrollTop = _event$currentTarget.scrollTop, scrollHeight = _event$currentTarget.scrollHeight, scrollWidth = _event$currentTarget.scrollWidth;
        _this.setState(function(prevState) {
          if (prevState.scrollLeft === scrollLeft && prevState.scrollTop === scrollTop) {
            return null;
          }
          var direction = _this.props.direction;
          var calculatedScrollLeft = scrollLeft;
          if (direction === "rtl") {
            switch (getRTLOffsetType()) {
              case "negative":
                calculatedScrollLeft = -scrollLeft;
                break;
              case "positive-descending":
                calculatedScrollLeft = scrollWidth - clientWidth - scrollLeft;
                break;
            }
          }
          calculatedScrollLeft = Math.max(0, Math.min(calculatedScrollLeft, scrollWidth - clientWidth));
          var calculatedScrollTop = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight));
          return {
            isScrolling: true,
            horizontalScrollDirection: prevState.scrollLeft < scrollLeft ? "forward" : "backward",
            scrollLeft: calculatedScrollLeft,
            scrollTop: calculatedScrollTop,
            verticalScrollDirection: prevState.scrollTop < scrollTop ? "forward" : "backward",
            scrollUpdateWasRequested: false
          };
        }, _this._resetIsScrollingDebounced);
      };
      _this._outerRefSetter = function(ref) {
        var outerRef = _this.props.outerRef;
        _this._outerRef = ref;
        if (typeof outerRef === "function") {
          outerRef(ref);
        } else if (outerRef != null && typeof outerRef === "object" && outerRef.hasOwnProperty("current")) {
          outerRef.current = ref;
        }
      };
      _this._resetIsScrollingDebounced = function() {
        if (_this._resetIsScrollingTimeoutId !== null) {
          cancelTimeout(_this._resetIsScrollingTimeoutId);
        }
        _this._resetIsScrollingTimeoutId = requestTimeout(_this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL);
      };
      _this._resetIsScrolling = function() {
        _this._resetIsScrollingTimeoutId = null;
        _this.setState({
          isScrolling: false
        }, function() {
          _this._getItemStyleCache(-1);
        });
      };
      return _this;
    }
    Grid.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      validateSharedProps(nextProps, prevState);
      validateProps5(nextProps);
      return null;
    };
    var _proto = Grid.prototype;
    _proto.scrollTo = function scrollTo(_ref3) {
      var scrollLeft = _ref3.scrollLeft, scrollTop = _ref3.scrollTop;
      if (scrollLeft !== void 0) {
        scrollLeft = Math.max(0, scrollLeft);
      }
      if (scrollTop !== void 0) {
        scrollTop = Math.max(0, scrollTop);
      }
      this.setState(function(prevState) {
        if (scrollLeft === void 0) {
          scrollLeft = prevState.scrollLeft;
        }
        if (scrollTop === void 0) {
          scrollTop = prevState.scrollTop;
        }
        if (prevState.scrollLeft === scrollLeft && prevState.scrollTop === scrollTop) {
          return null;
        }
        return {
          horizontalScrollDirection: prevState.scrollLeft < scrollLeft ? "forward" : "backward",
          scrollLeft,
          scrollTop,
          scrollUpdateWasRequested: true,
          verticalScrollDirection: prevState.scrollTop < scrollTop ? "forward" : "backward"
        };
      }, this._resetIsScrollingDebounced);
    };
    _proto.scrollToItem = function scrollToItem(_ref4) {
      var _ref4$align = _ref4.align, align = _ref4$align === void 0 ? "auto" : _ref4$align, columnIndex = _ref4.columnIndex, rowIndex = _ref4.rowIndex;
      var _this$props2 = this.props, columnCount = _this$props2.columnCount, height = _this$props2.height, rowCount = _this$props2.rowCount, width = _this$props2.width;
      var _this$state = this.state, scrollLeft = _this$state.scrollLeft, scrollTop = _this$state.scrollTop;
      var scrollbarSize = getScrollbarSize();
      if (columnIndex !== void 0) {
        columnIndex = Math.max(0, Math.min(columnIndex, columnCount - 1));
      }
      if (rowIndex !== void 0) {
        rowIndex = Math.max(0, Math.min(rowIndex, rowCount - 1));
      }
      var estimatedTotalHeight = getEstimatedTotalHeight4(this.props, this._instanceProps);
      var estimatedTotalWidth = getEstimatedTotalWidth4(this.props, this._instanceProps);
      var horizontalScrollbarSize = estimatedTotalWidth > width ? scrollbarSize : 0;
      var verticalScrollbarSize = estimatedTotalHeight > height ? scrollbarSize : 0;
      this.scrollTo({
        scrollLeft: columnIndex !== void 0 ? getOffsetForColumnAndAlignment3(this.props, columnIndex, align, scrollLeft, this._instanceProps, verticalScrollbarSize) : scrollLeft,
        scrollTop: rowIndex !== void 0 ? getOffsetForRowAndAlignment3(this.props, rowIndex, align, scrollTop, this._instanceProps, horizontalScrollbarSize) : scrollTop
      });
    };
    _proto.componentDidMount = function componentDidMount() {
      var _this$props3 = this.props, initialScrollLeft = _this$props3.initialScrollLeft, initialScrollTop = _this$props3.initialScrollTop;
      if (this._outerRef != null) {
        var outerRef = this._outerRef;
        if (typeof initialScrollLeft === "number") {
          outerRef.scrollLeft = initialScrollLeft;
        }
        if (typeof initialScrollTop === "number") {
          outerRef.scrollTop = initialScrollTop;
        }
      }
      this._callPropsCallbacks();
    };
    _proto.componentDidUpdate = function componentDidUpdate() {
      var direction = this.props.direction;
      var _this$state2 = this.state, scrollLeft = _this$state2.scrollLeft, scrollTop = _this$state2.scrollTop, scrollUpdateWasRequested = _this$state2.scrollUpdateWasRequested;
      if (scrollUpdateWasRequested && this._outerRef != null) {
        var outerRef = this._outerRef;
        if (direction === "rtl") {
          switch (getRTLOffsetType()) {
            case "negative":
              outerRef.scrollLeft = -scrollLeft;
              break;
            case "positive-ascending":
              outerRef.scrollLeft = scrollLeft;
              break;
            default:
              var clientWidth = outerRef.clientWidth, scrollWidth = outerRef.scrollWidth;
              outerRef.scrollLeft = scrollWidth - clientWidth - scrollLeft;
              break;
          }
        } else {
          outerRef.scrollLeft = Math.max(0, scrollLeft);
        }
        outerRef.scrollTop = Math.max(0, scrollTop);
      }
      this._callPropsCallbacks();
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      if (this._resetIsScrollingTimeoutId !== null) {
        cancelTimeout(this._resetIsScrollingTimeoutId);
      }
    };
    _proto.render = function render() {
      var _this$props4 = this.props, children = _this$props4.children, className = _this$props4.className, columnCount = _this$props4.columnCount, direction = _this$props4.direction, height = _this$props4.height, innerRef = _this$props4.innerRef, innerElementType = _this$props4.innerElementType, innerTagName = _this$props4.innerTagName, itemData = _this$props4.itemData, _this$props4$itemKey = _this$props4.itemKey, itemKey = _this$props4$itemKey === void 0 ? defaultItemKey : _this$props4$itemKey, outerElementType = _this$props4.outerElementType, outerTagName = _this$props4.outerTagName, rowCount = _this$props4.rowCount, style = _this$props4.style, useIsScrolling = _this$props4.useIsScrolling, width = _this$props4.width;
      var isScrolling = this.state.isScrolling;
      var _this$_getHorizontalR = this._getHorizontalRangeToRender(), columnStartIndex = _this$_getHorizontalR[0], columnStopIndex = _this$_getHorizontalR[1];
      var _this$_getVerticalRan = this._getVerticalRangeToRender(), rowStartIndex = _this$_getVerticalRan[0], rowStopIndex = _this$_getVerticalRan[1];
      var items2 = [];
      if (columnCount > 0 && rowCount) {
        for (var _rowIndex = rowStartIndex; _rowIndex <= rowStopIndex; _rowIndex++) {
          for (var _columnIndex = columnStartIndex; _columnIndex <= columnStopIndex; _columnIndex++) {
            items2.push((0, import_react5.createElement)(children, {
              columnIndex: _columnIndex,
              data: itemData,
              isScrolling: useIsScrolling ? isScrolling : void 0,
              key: itemKey({
                columnIndex: _columnIndex,
                data: itemData,
                rowIndex: _rowIndex
              }),
              rowIndex: _rowIndex,
              style: this._getItemStyle(_rowIndex, _columnIndex)
            }));
          }
        }
      }
      var estimatedTotalHeight = getEstimatedTotalHeight4(this.props, this._instanceProps);
      var estimatedTotalWidth = getEstimatedTotalWidth4(this.props, this._instanceProps);
      return (0, import_react5.createElement)(outerElementType || outerTagName || "div", {
        className,
        onScroll: this._onScroll,
        ref: this._outerRefSetter,
        style: _extends({
          position: "relative",
          height,
          width,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          willChange: "transform",
          direction
        }, style)
      }, (0, import_react5.createElement)(innerElementType || innerTagName || "div", {
        children: items2,
        ref: innerRef,
        style: {
          height: estimatedTotalHeight,
          pointerEvents: isScrolling ? "none" : void 0,
          width: estimatedTotalWidth
        }
      }));
    };
    _proto._callPropsCallbacks = function _callPropsCallbacks() {
      var _this$props5 = this.props, columnCount = _this$props5.columnCount, onItemsRendered = _this$props5.onItemsRendered, onScroll = _this$props5.onScroll, rowCount = _this$props5.rowCount;
      if (typeof onItemsRendered === "function") {
        if (columnCount > 0 && rowCount > 0) {
          var _this$_getHorizontalR2 = this._getHorizontalRangeToRender(), _overscanColumnStartIndex = _this$_getHorizontalR2[0], _overscanColumnStopIndex = _this$_getHorizontalR2[1], _visibleColumnStartIndex = _this$_getHorizontalR2[2], _visibleColumnStopIndex = _this$_getHorizontalR2[3];
          var _this$_getVerticalRan2 = this._getVerticalRangeToRender(), _overscanRowStartIndex = _this$_getVerticalRan2[0], _overscanRowStopIndex = _this$_getVerticalRan2[1], _visibleRowStartIndex = _this$_getVerticalRan2[2], _visibleRowStopIndex = _this$_getVerticalRan2[3];
          this._callOnItemsRendered(_overscanColumnStartIndex, _overscanColumnStopIndex, _overscanRowStartIndex, _overscanRowStopIndex, _visibleColumnStartIndex, _visibleColumnStopIndex, _visibleRowStartIndex, _visibleRowStopIndex);
        }
      }
      if (typeof onScroll === "function") {
        var _this$state3 = this.state, _horizontalScrollDirection = _this$state3.horizontalScrollDirection, _scrollLeft = _this$state3.scrollLeft, _scrollTop = _this$state3.scrollTop, _scrollUpdateWasRequested = _this$state3.scrollUpdateWasRequested, _verticalScrollDirection = _this$state3.verticalScrollDirection;
        this._callOnScroll(_scrollLeft, _scrollTop, _horizontalScrollDirection, _verticalScrollDirection, _scrollUpdateWasRequested);
      }
    };
    _proto._getHorizontalRangeToRender = function _getHorizontalRangeToRender() {
      var _this$props6 = this.props, columnCount = _this$props6.columnCount, overscanColumnCount = _this$props6.overscanColumnCount, overscanColumnsCount = _this$props6.overscanColumnsCount, overscanCount = _this$props6.overscanCount, rowCount = _this$props6.rowCount;
      var _this$state4 = this.state, horizontalScrollDirection = _this$state4.horizontalScrollDirection, isScrolling = _this$state4.isScrolling, scrollLeft = _this$state4.scrollLeft;
      var overscanCountResolved = overscanColumnCount || overscanColumnsCount || overscanCount || 1;
      if (columnCount === 0 || rowCount === 0) {
        return [0, 0, 0, 0];
      }
      var startIndex = getColumnStartIndexForOffset3(this.props, scrollLeft, this._instanceProps);
      var stopIndex = getColumnStopIndexForStartIndex3(this.props, startIndex, scrollLeft, this._instanceProps);
      var overscanBackward = !isScrolling || horizontalScrollDirection === "backward" ? Math.max(1, overscanCountResolved) : 1;
      var overscanForward = !isScrolling || horizontalScrollDirection === "forward" ? Math.max(1, overscanCountResolved) : 1;
      return [Math.max(0, startIndex - overscanBackward), Math.max(0, Math.min(columnCount - 1, stopIndex + overscanForward)), startIndex, stopIndex];
    };
    _proto._getVerticalRangeToRender = function _getVerticalRangeToRender() {
      var _this$props7 = this.props, columnCount = _this$props7.columnCount, overscanCount = _this$props7.overscanCount, overscanRowCount = _this$props7.overscanRowCount, overscanRowsCount = _this$props7.overscanRowsCount, rowCount = _this$props7.rowCount;
      var _this$state5 = this.state, isScrolling = _this$state5.isScrolling, verticalScrollDirection = _this$state5.verticalScrollDirection, scrollTop = _this$state5.scrollTop;
      var overscanCountResolved = overscanRowCount || overscanRowsCount || overscanCount || 1;
      if (columnCount === 0 || rowCount === 0) {
        return [0, 0, 0, 0];
      }
      var startIndex = getRowStartIndexForOffset3(this.props, scrollTop, this._instanceProps);
      var stopIndex = getRowStopIndexForStartIndex3(this.props, startIndex, scrollTop, this._instanceProps);
      var overscanBackward = !isScrolling || verticalScrollDirection === "backward" ? Math.max(1, overscanCountResolved) : 1;
      var overscanForward = !isScrolling || verticalScrollDirection === "forward" ? Math.max(1, overscanCountResolved) : 1;
      return [Math.max(0, startIndex - overscanBackward), Math.max(0, Math.min(rowCount - 1, stopIndex + overscanForward)), startIndex, stopIndex];
    };
    return Grid;
  }(import_react5.PureComponent), _class.defaultProps = {
    direction: "ltr",
    itemData: void 0,
    useIsScrolling: false
  }, _class;
}
var validateSharedProps = function validateSharedProps2(_ref5, _ref6) {
  var children = _ref5.children, direction = _ref5.direction, height = _ref5.height, innerTagName = _ref5.innerTagName, outerTagName = _ref5.outerTagName, overscanColumnsCount = _ref5.overscanColumnsCount, overscanCount = _ref5.overscanCount, overscanRowsCount = _ref5.overscanRowsCount, width = _ref5.width;
  var instance = _ref6.instance;
  if (true) {
    if (typeof overscanCount === "number") {
      if (devWarningsOverscanCount && !devWarningsOverscanCount.has(instance)) {
        devWarningsOverscanCount.add(instance);
        console.warn("The overscanCount prop has been deprecated. Please use the overscanColumnCount and overscanRowCount props instead.");
      }
    }
    if (typeof overscanColumnsCount === "number" || typeof overscanRowsCount === "number") {
      if (devWarningsOverscanRowsColumnsCount && !devWarningsOverscanRowsColumnsCount.has(instance)) {
        devWarningsOverscanRowsColumnsCount.add(instance);
        console.warn("The overscanColumnsCount and overscanRowsCount props have been deprecated. Please use the overscanColumnCount and overscanRowCount props instead.");
      }
    }
    if (innerTagName != null || outerTagName != null) {
      if (devWarningsTagName && !devWarningsTagName.has(instance)) {
        devWarningsTagName.add(instance);
        console.warn("The innerTagName and outerTagName props have been deprecated. Please use the innerElementType and outerElementType props instead.");
      }
    }
    if (children == null) {
      throw Error('An invalid "children" prop has been specified. Value should be a React component. ' + ('"' + (children === null ? "null" : typeof children) + '" was specified.'));
    }
    switch (direction) {
      case "ltr":
      case "rtl":
        break;
      default:
        throw Error('An invalid "direction" prop has been specified. Value should be either "ltr" or "rtl". ' + ('"' + direction + '" was specified.'));
    }
    if (typeof width !== "number") {
      throw Error('An invalid "width" prop has been specified. Grids must specify a number for width. ' + ('"' + (width === null ? "null" : typeof width) + '" was specified.'));
    }
    if (typeof height !== "number") {
      throw Error('An invalid "height" prop has been specified. Grids must specify a number for height. ' + ('"' + (height === null ? "null" : typeof height) + '" was specified.'));
    }
  }
};
var DEFAULT_ESTIMATED_ITEM_SIZE = 50;
var getEstimatedTotalHeight = function getEstimatedTotalHeight2(_ref, _ref2) {
  var rowCount = _ref.rowCount;
  var rowMetadataMap = _ref2.rowMetadataMap, estimatedRowHeight = _ref2.estimatedRowHeight, lastMeasuredRowIndex = _ref2.lastMeasuredRowIndex;
  var totalSizeOfMeasuredRows = 0;
  if (lastMeasuredRowIndex >= rowCount) {
    lastMeasuredRowIndex = rowCount - 1;
  }
  if (lastMeasuredRowIndex >= 0) {
    var itemMetadata = rowMetadataMap[lastMeasuredRowIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }
  var numUnmeasuredItems = rowCount - lastMeasuredRowIndex - 1;
  var totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedRowHeight;
  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};
var getEstimatedTotalWidth = function getEstimatedTotalWidth2(_ref3, _ref4) {
  var columnCount = _ref3.columnCount;
  var columnMetadataMap = _ref4.columnMetadataMap, estimatedColumnWidth = _ref4.estimatedColumnWidth, lastMeasuredColumnIndex = _ref4.lastMeasuredColumnIndex;
  var totalSizeOfMeasuredRows = 0;
  if (lastMeasuredColumnIndex >= columnCount) {
    lastMeasuredColumnIndex = columnCount - 1;
  }
  if (lastMeasuredColumnIndex >= 0) {
    var itemMetadata = columnMetadataMap[lastMeasuredColumnIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }
  var numUnmeasuredItems = columnCount - lastMeasuredColumnIndex - 1;
  var totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedColumnWidth;
  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};
var getItemMetadata = function getItemMetadata2(itemType, props, index, instanceProps) {
  var itemMetadataMap, itemSize, lastMeasuredIndex;
  if (itemType === "column") {
    itemMetadataMap = instanceProps.columnMetadataMap;
    itemSize = props.columnWidth;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    itemMetadataMap = instanceProps.rowMetadataMap;
    itemSize = props.rowHeight;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }
  if (index > lastMeasuredIndex) {
    var offset = 0;
    if (lastMeasuredIndex >= 0) {
      var itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }
    for (var i = lastMeasuredIndex + 1; i <= index; i++) {
      var size2 = itemSize(i);
      itemMetadataMap[i] = {
        offset,
        size: size2
      };
      offset += size2;
    }
    if (itemType === "column") {
      instanceProps.lastMeasuredColumnIndex = index;
    } else {
      instanceProps.lastMeasuredRowIndex = index;
    }
  }
  return itemMetadataMap[index];
};
var findNearestItem = function findNearestItem2(itemType, props, instanceProps, offset) {
  var itemMetadataMap, lastMeasuredIndex;
  if (itemType === "column") {
    itemMetadataMap = instanceProps.columnMetadataMap;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    itemMetadataMap = instanceProps.rowMetadataMap;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }
  var lastMeasuredItemOffset = lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;
  if (lastMeasuredItemOffset >= offset) {
    return findNearestItemBinarySearch(itemType, props, instanceProps, lastMeasuredIndex, 0, offset);
  } else {
    return findNearestItemExponentialSearch(itemType, props, instanceProps, Math.max(0, lastMeasuredIndex), offset);
  }
};
var findNearestItemBinarySearch = function findNearestItemBinarySearch2(itemType, props, instanceProps, high, low, offset) {
  while (low <= high) {
    var middle = low + Math.floor((high - low) / 2);
    var currentOffset = getItemMetadata(itemType, props, middle, instanceProps).offset;
    if (currentOffset === offset) {
      return middle;
    } else if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};
var findNearestItemExponentialSearch = function findNearestItemExponentialSearch2(itemType, props, instanceProps, index, offset) {
  var itemCount = itemType === "column" ? props.columnCount : props.rowCount;
  var interval = 1;
  while (index < itemCount && getItemMetadata(itemType, props, index, instanceProps).offset < offset) {
    index += interval;
    interval *= 2;
  }
  return findNearestItemBinarySearch(itemType, props, instanceProps, Math.min(index, itemCount - 1), Math.floor(index / 2), offset);
};
var getOffsetForIndexAndAlignment = function getOffsetForIndexAndAlignment2(itemType, props, index, align, scrollOffset, instanceProps, scrollbarSize) {
  var size2 = itemType === "column" ? props.width : props.height;
  var itemMetadata = getItemMetadata(itemType, props, index, instanceProps);
  var estimatedTotalSize = itemType === "column" ? getEstimatedTotalWidth(props, instanceProps) : getEstimatedTotalHeight(props, instanceProps);
  var maxOffset = Math.max(0, Math.min(estimatedTotalSize - size2, itemMetadata.offset));
  var minOffset = Math.max(0, itemMetadata.offset - size2 + scrollbarSize + itemMetadata.size);
  if (align === "smart") {
    if (scrollOffset >= minOffset - size2 && scrollOffset <= maxOffset + size2) {
      align = "auto";
    } else {
      align = "center";
    }
  }
  switch (align) {
    case "start":
      return maxOffset;
    case "end":
      return minOffset;
    case "center":
      return Math.round(minOffset + (maxOffset - minOffset) / 2);
    case "auto":
    default:
      if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
        return scrollOffset;
      } else if (minOffset > maxOffset) {
        return minOffset;
      } else if (scrollOffset < minOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }
  }
};
var VariableSizeGrid = createGridComponent({
  getColumnOffset: function getColumnOffset(props, index, instanceProps) {
    return getItemMetadata("column", props, index, instanceProps).offset;
  },
  getColumnStartIndexForOffset: function getColumnStartIndexForOffset(props, scrollLeft, instanceProps) {
    return findNearestItem("column", props, instanceProps, scrollLeft);
  },
  getColumnStopIndexForStartIndex: function getColumnStopIndexForStartIndex(props, startIndex, scrollLeft, instanceProps) {
    var columnCount = props.columnCount, width = props.width;
    var itemMetadata = getItemMetadata("column", props, startIndex, instanceProps);
    var maxOffset = scrollLeft + width;
    var offset = itemMetadata.offset + itemMetadata.size;
    var stopIndex = startIndex;
    while (stopIndex < columnCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata("column", props, stopIndex, instanceProps).size;
    }
    return stopIndex;
  },
  getColumnWidth: function getColumnWidth(props, index, instanceProps) {
    return instanceProps.columnMetadataMap[index].size;
  },
  getEstimatedTotalHeight,
  getEstimatedTotalWidth,
  getOffsetForColumnAndAlignment: function getOffsetForColumnAndAlignment(props, index, align, scrollOffset, instanceProps, scrollbarSize) {
    return getOffsetForIndexAndAlignment("column", props, index, align, scrollOffset, instanceProps, scrollbarSize);
  },
  getOffsetForRowAndAlignment: function getOffsetForRowAndAlignment(props, index, align, scrollOffset, instanceProps, scrollbarSize) {
    return getOffsetForIndexAndAlignment("row", props, index, align, scrollOffset, instanceProps, scrollbarSize);
  },
  getRowOffset: function getRowOffset(props, index, instanceProps) {
    return getItemMetadata("row", props, index, instanceProps).offset;
  },
  getRowHeight: function getRowHeight(props, index, instanceProps) {
    return instanceProps.rowMetadataMap[index].size;
  },
  getRowStartIndexForOffset: function getRowStartIndexForOffset(props, scrollTop, instanceProps) {
    return findNearestItem("row", props, instanceProps, scrollTop);
  },
  getRowStopIndexForStartIndex: function getRowStopIndexForStartIndex(props, startIndex, scrollTop, instanceProps) {
    var rowCount = props.rowCount, height = props.height;
    var itemMetadata = getItemMetadata("row", props, startIndex, instanceProps);
    var maxOffset = scrollTop + height;
    var offset = itemMetadata.offset + itemMetadata.size;
    var stopIndex = startIndex;
    while (stopIndex < rowCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata("row", props, stopIndex, instanceProps).size;
    }
    return stopIndex;
  },
  initInstanceProps: function initInstanceProps(props, instance) {
    var _ref5 = props, estimatedColumnWidth = _ref5.estimatedColumnWidth, estimatedRowHeight = _ref5.estimatedRowHeight;
    var instanceProps = {
      columnMetadataMap: {},
      estimatedColumnWidth: estimatedColumnWidth || DEFAULT_ESTIMATED_ITEM_SIZE,
      estimatedRowHeight: estimatedRowHeight || DEFAULT_ESTIMATED_ITEM_SIZE,
      lastMeasuredColumnIndex: -1,
      lastMeasuredRowIndex: -1,
      rowMetadataMap: {}
    };
    instance.resetAfterColumnIndex = function(columnIndex, shouldForceUpdate) {
      if (shouldForceUpdate === void 0) {
        shouldForceUpdate = true;
      }
      instance.resetAfterIndices({
        columnIndex,
        shouldForceUpdate
      });
    };
    instance.resetAfterRowIndex = function(rowIndex, shouldForceUpdate) {
      if (shouldForceUpdate === void 0) {
        shouldForceUpdate = true;
      }
      instance.resetAfterIndices({
        rowIndex,
        shouldForceUpdate
      });
    };
    instance.resetAfterIndices = function(_ref6) {
      var columnIndex = _ref6.columnIndex, rowIndex = _ref6.rowIndex, _ref6$shouldForceUpda = _ref6.shouldForceUpdate, shouldForceUpdate = _ref6$shouldForceUpda === void 0 ? true : _ref6$shouldForceUpda;
      if (typeof columnIndex === "number") {
        instanceProps.lastMeasuredColumnIndex = Math.min(instanceProps.lastMeasuredColumnIndex, columnIndex - 1);
      }
      if (typeof rowIndex === "number") {
        instanceProps.lastMeasuredRowIndex = Math.min(instanceProps.lastMeasuredRowIndex, rowIndex - 1);
      }
      instance._getItemStyleCache(-1);
      if (shouldForceUpdate) {
        instance.forceUpdate();
      }
    };
    return instanceProps;
  },
  shouldResetStyleCacheOnItemSizeChange: false,
  validateProps: function validateProps(_ref7) {
    var columnWidth = _ref7.columnWidth, rowHeight = _ref7.rowHeight;
    if (true) {
      if (typeof columnWidth !== "function") {
        throw Error('An invalid "columnWidth" prop has been specified. Value should be a function. ' + ('"' + (columnWidth === null ? "null" : typeof columnWidth) + '" was specified.'));
      } else if (typeof rowHeight !== "function") {
        throw Error('An invalid "rowHeight" prop has been specified. Value should be a function. ' + ('"' + (rowHeight === null ? "null" : typeof rowHeight) + '" was specified.'));
      }
    }
  }
});
var IS_SCROLLING_DEBOUNCE_INTERVAL$1 = 150;
var defaultItemKey$1 = function defaultItemKey3(index, data) {
  return index;
};
var devWarningsDirection = null;
var devWarningsTagName$1 = null;
if (true) {
  if (typeof window !== "undefined" && typeof window.WeakSet !== "undefined") {
    devWarningsDirection = /* @__PURE__ */ new WeakSet();
    devWarningsTagName$1 = /* @__PURE__ */ new WeakSet();
  }
}
function createListComponent(_ref) {
  var _class;
  var getItemOffset3 = _ref.getItemOffset, getEstimatedTotalSize4 = _ref.getEstimatedTotalSize, getItemSize3 = _ref.getItemSize, getOffsetForIndexAndAlignment5 = _ref.getOffsetForIndexAndAlignment, getStartIndexForOffset3 = _ref.getStartIndexForOffset, getStopIndexForStartIndex3 = _ref.getStopIndexForStartIndex, initInstanceProps5 = _ref.initInstanceProps, shouldResetStyleCacheOnItemSizeChange = _ref.shouldResetStyleCacheOnItemSizeChange, validateProps5 = _ref.validateProps;
  return _class = function(_PureComponent) {
    _inheritsLoose(List, _PureComponent);
    function List(props) {
      var _this;
      _this = _PureComponent.call(this, props) || this;
      _this._instanceProps = initInstanceProps5(_this.props, _assertThisInitialized(_this));
      _this._outerRef = void 0;
      _this._resetIsScrollingTimeoutId = null;
      _this.state = {
        instance: _assertThisInitialized(_this),
        isScrolling: false,
        scrollDirection: "forward",
        scrollOffset: typeof _this.props.initialScrollOffset === "number" ? _this.props.initialScrollOffset : 0,
        scrollUpdateWasRequested: false
      };
      _this._callOnItemsRendered = void 0;
      _this._callOnItemsRendered = memoize_one_esm_default(function(overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) {
        return _this.props.onItemsRendered({
          overscanStartIndex,
          overscanStopIndex,
          visibleStartIndex,
          visibleStopIndex
        });
      });
      _this._callOnScroll = void 0;
      _this._callOnScroll = memoize_one_esm_default(function(scrollDirection, scrollOffset, scrollUpdateWasRequested) {
        return _this.props.onScroll({
          scrollDirection,
          scrollOffset,
          scrollUpdateWasRequested
        });
      });
      _this._getItemStyle = void 0;
      _this._getItemStyle = function(index) {
        var _this$props = _this.props, direction = _this$props.direction, itemSize = _this$props.itemSize, layout = _this$props.layout;
        var itemStyleCache = _this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && itemSize, shouldResetStyleCacheOnItemSizeChange && layout, shouldResetStyleCacheOnItemSizeChange && direction);
        var style;
        if (itemStyleCache.hasOwnProperty(index)) {
          style = itemStyleCache[index];
        } else {
          var _offset = getItemOffset3(_this.props, index, _this._instanceProps);
          var size2 = getItemSize3(_this.props, index, _this._instanceProps);
          var isHorizontal = direction === "horizontal" || layout === "horizontal";
          var isRtl = direction === "rtl";
          var offsetHorizontal = isHorizontal ? _offset : 0;
          itemStyleCache[index] = style = {
            position: "absolute",
            left: isRtl ? void 0 : offsetHorizontal,
            right: isRtl ? offsetHorizontal : void 0,
            top: !isHorizontal ? _offset : 0,
            height: !isHorizontal ? size2 : "100%",
            width: isHorizontal ? size2 : "100%"
          };
        }
        return style;
      };
      _this._getItemStyleCache = void 0;
      _this._getItemStyleCache = memoize_one_esm_default(function(_, __, ___) {
        return {};
      });
      _this._onScrollHorizontal = function(event) {
        var _event$currentTarget = event.currentTarget, clientWidth = _event$currentTarget.clientWidth, scrollLeft = _event$currentTarget.scrollLeft, scrollWidth = _event$currentTarget.scrollWidth;
        _this.setState(function(prevState) {
          if (prevState.scrollOffset === scrollLeft) {
            return null;
          }
          var direction = _this.props.direction;
          var scrollOffset = scrollLeft;
          if (direction === "rtl") {
            switch (getRTLOffsetType()) {
              case "negative":
                scrollOffset = -scrollLeft;
                break;
              case "positive-descending":
                scrollOffset = scrollWidth - clientWidth - scrollLeft;
                break;
            }
          }
          scrollOffset = Math.max(0, Math.min(scrollOffset, scrollWidth - clientWidth));
          return {
            isScrolling: true,
            scrollDirection: prevState.scrollOffset < scrollOffset ? "forward" : "backward",
            scrollOffset,
            scrollUpdateWasRequested: false
          };
        }, _this._resetIsScrollingDebounced);
      };
      _this._onScrollVertical = function(event) {
        var _event$currentTarget2 = event.currentTarget, clientHeight = _event$currentTarget2.clientHeight, scrollHeight = _event$currentTarget2.scrollHeight, scrollTop = _event$currentTarget2.scrollTop;
        _this.setState(function(prevState) {
          if (prevState.scrollOffset === scrollTop) {
            return null;
          }
          var scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight));
          return {
            isScrolling: true,
            scrollDirection: prevState.scrollOffset < scrollOffset ? "forward" : "backward",
            scrollOffset,
            scrollUpdateWasRequested: false
          };
        }, _this._resetIsScrollingDebounced);
      };
      _this._outerRefSetter = function(ref) {
        var outerRef = _this.props.outerRef;
        _this._outerRef = ref;
        if (typeof outerRef === "function") {
          outerRef(ref);
        } else if (outerRef != null && typeof outerRef === "object" && outerRef.hasOwnProperty("current")) {
          outerRef.current = ref;
        }
      };
      _this._resetIsScrollingDebounced = function() {
        if (_this._resetIsScrollingTimeoutId !== null) {
          cancelTimeout(_this._resetIsScrollingTimeoutId);
        }
        _this._resetIsScrollingTimeoutId = requestTimeout(_this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL$1);
      };
      _this._resetIsScrolling = function() {
        _this._resetIsScrollingTimeoutId = null;
        _this.setState({
          isScrolling: false
        }, function() {
          _this._getItemStyleCache(-1, null);
        });
      };
      return _this;
    }
    List.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      validateSharedProps$1(nextProps, prevState);
      validateProps5(nextProps);
      return null;
    };
    var _proto = List.prototype;
    _proto.scrollTo = function scrollTo(scrollOffset) {
      scrollOffset = Math.max(0, scrollOffset);
      this.setState(function(prevState) {
        if (prevState.scrollOffset === scrollOffset) {
          return null;
        }
        return {
          scrollDirection: prevState.scrollOffset < scrollOffset ? "forward" : "backward",
          scrollOffset,
          scrollUpdateWasRequested: true
        };
      }, this._resetIsScrollingDebounced);
    };
    _proto.scrollToItem = function scrollToItem(index, align) {
      if (align === void 0) {
        align = "auto";
      }
      var _this$props2 = this.props, itemCount = _this$props2.itemCount, layout = _this$props2.layout;
      var scrollOffset = this.state.scrollOffset;
      index = Math.max(0, Math.min(index, itemCount - 1));
      var scrollbarSize = 0;
      if (this._outerRef) {
        var outerRef = this._outerRef;
        if (layout === "vertical") {
          scrollbarSize = outerRef.scrollWidth > outerRef.clientWidth ? getScrollbarSize() : 0;
        } else {
          scrollbarSize = outerRef.scrollHeight > outerRef.clientHeight ? getScrollbarSize() : 0;
        }
      }
      this.scrollTo(getOffsetForIndexAndAlignment5(this.props, index, align, scrollOffset, this._instanceProps, scrollbarSize));
    };
    _proto.componentDidMount = function componentDidMount() {
      var _this$props3 = this.props, direction = _this$props3.direction, initialScrollOffset = _this$props3.initialScrollOffset, layout = _this$props3.layout;
      if (typeof initialScrollOffset === "number" && this._outerRef != null) {
        var outerRef = this._outerRef;
        if (direction === "horizontal" || layout === "horizontal") {
          outerRef.scrollLeft = initialScrollOffset;
        } else {
          outerRef.scrollTop = initialScrollOffset;
        }
      }
      this._callPropsCallbacks();
    };
    _proto.componentDidUpdate = function componentDidUpdate() {
      var _this$props4 = this.props, direction = _this$props4.direction, layout = _this$props4.layout;
      var _this$state = this.state, scrollOffset = _this$state.scrollOffset, scrollUpdateWasRequested = _this$state.scrollUpdateWasRequested;
      if (scrollUpdateWasRequested && this._outerRef != null) {
        var outerRef = this._outerRef;
        if (direction === "horizontal" || layout === "horizontal") {
          if (direction === "rtl") {
            switch (getRTLOffsetType()) {
              case "negative":
                outerRef.scrollLeft = -scrollOffset;
                break;
              case "positive-ascending":
                outerRef.scrollLeft = scrollOffset;
                break;
              default:
                var clientWidth = outerRef.clientWidth, scrollWidth = outerRef.scrollWidth;
                outerRef.scrollLeft = scrollWidth - clientWidth - scrollOffset;
                break;
            }
          } else {
            outerRef.scrollLeft = scrollOffset;
          }
        } else {
          outerRef.scrollTop = scrollOffset;
        }
      }
      this._callPropsCallbacks();
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      if (this._resetIsScrollingTimeoutId !== null) {
        cancelTimeout(this._resetIsScrollingTimeoutId);
      }
    };
    _proto.render = function render() {
      var _this$props5 = this.props, children = _this$props5.children, className = _this$props5.className, direction = _this$props5.direction, height = _this$props5.height, innerRef = _this$props5.innerRef, innerElementType = _this$props5.innerElementType, innerTagName = _this$props5.innerTagName, itemCount = _this$props5.itemCount, itemData = _this$props5.itemData, _this$props5$itemKey = _this$props5.itemKey, itemKey = _this$props5$itemKey === void 0 ? defaultItemKey$1 : _this$props5$itemKey, layout = _this$props5.layout, outerElementType = _this$props5.outerElementType, outerTagName = _this$props5.outerTagName, style = _this$props5.style, useIsScrolling = _this$props5.useIsScrolling, width = _this$props5.width;
      var isScrolling = this.state.isScrolling;
      var isHorizontal = direction === "horizontal" || layout === "horizontal";
      var onScroll = isHorizontal ? this._onScrollHorizontal : this._onScrollVertical;
      var _this$_getRangeToRend = this._getRangeToRender(), startIndex = _this$_getRangeToRend[0], stopIndex = _this$_getRangeToRend[1];
      var items2 = [];
      if (itemCount > 0) {
        for (var _index = startIndex; _index <= stopIndex; _index++) {
          items2.push((0, import_react5.createElement)(children, {
            data: itemData,
            key: itemKey(_index, itemData),
            index: _index,
            isScrolling: useIsScrolling ? isScrolling : void 0,
            style: this._getItemStyle(_index)
          }));
        }
      }
      var estimatedTotalSize = getEstimatedTotalSize4(this.props, this._instanceProps);
      return (0, import_react5.createElement)(outerElementType || outerTagName || "div", {
        className,
        onScroll,
        ref: this._outerRefSetter,
        style: _extends({
          position: "relative",
          height,
          width,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          willChange: "transform",
          direction
        }, style)
      }, (0, import_react5.createElement)(innerElementType || innerTagName || "div", {
        children: items2,
        ref: innerRef,
        style: {
          height: isHorizontal ? "100%" : estimatedTotalSize,
          pointerEvents: isScrolling ? "none" : void 0,
          width: isHorizontal ? estimatedTotalSize : "100%"
        }
      }));
    };
    _proto._callPropsCallbacks = function _callPropsCallbacks() {
      if (typeof this.props.onItemsRendered === "function") {
        var itemCount = this.props.itemCount;
        if (itemCount > 0) {
          var _this$_getRangeToRend2 = this._getRangeToRender(), _overscanStartIndex = _this$_getRangeToRend2[0], _overscanStopIndex = _this$_getRangeToRend2[1], _visibleStartIndex = _this$_getRangeToRend2[2], _visibleStopIndex = _this$_getRangeToRend2[3];
          this._callOnItemsRendered(_overscanStartIndex, _overscanStopIndex, _visibleStartIndex, _visibleStopIndex);
        }
      }
      if (typeof this.props.onScroll === "function") {
        var _this$state2 = this.state, _scrollDirection = _this$state2.scrollDirection, _scrollOffset = _this$state2.scrollOffset, _scrollUpdateWasRequested = _this$state2.scrollUpdateWasRequested;
        this._callOnScroll(_scrollDirection, _scrollOffset, _scrollUpdateWasRequested);
      }
    };
    _proto._getRangeToRender = function _getRangeToRender() {
      var _this$props6 = this.props, itemCount = _this$props6.itemCount, overscanCount = _this$props6.overscanCount;
      var _this$state3 = this.state, isScrolling = _this$state3.isScrolling, scrollDirection = _this$state3.scrollDirection, scrollOffset = _this$state3.scrollOffset;
      if (itemCount === 0) {
        return [0, 0, 0, 0];
      }
      var startIndex = getStartIndexForOffset3(this.props, scrollOffset, this._instanceProps);
      var stopIndex = getStopIndexForStartIndex3(this.props, startIndex, scrollOffset, this._instanceProps);
      var overscanBackward = !isScrolling || scrollDirection === "backward" ? Math.max(1, overscanCount) : 1;
      var overscanForward = !isScrolling || scrollDirection === "forward" ? Math.max(1, overscanCount) : 1;
      return [Math.max(0, startIndex - overscanBackward), Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)), startIndex, stopIndex];
    };
    return List;
  }(import_react5.PureComponent), _class.defaultProps = {
    direction: "ltr",
    itemData: void 0,
    layout: "vertical",
    overscanCount: 2,
    useIsScrolling: false
  }, _class;
}
var validateSharedProps$1 = function validateSharedProps3(_ref2, _ref3) {
  var children = _ref2.children, direction = _ref2.direction, height = _ref2.height, layout = _ref2.layout, innerTagName = _ref2.innerTagName, outerTagName = _ref2.outerTagName, width = _ref2.width;
  var instance = _ref3.instance;
  if (true) {
    if (innerTagName != null || outerTagName != null) {
      if (devWarningsTagName$1 && !devWarningsTagName$1.has(instance)) {
        devWarningsTagName$1.add(instance);
        console.warn("The innerTagName and outerTagName props have been deprecated. Please use the innerElementType and outerElementType props instead.");
      }
    }
    var isHorizontal = direction === "horizontal" || layout === "horizontal";
    switch (direction) {
      case "horizontal":
      case "vertical":
        if (devWarningsDirection && !devWarningsDirection.has(instance)) {
          devWarningsDirection.add(instance);
          console.warn('The direction prop should be either "ltr" (default) or "rtl". Please use the layout prop to specify "vertical" (default) or "horizontal" orientation.');
        }
        break;
      case "ltr":
      case "rtl":
        break;
      default:
        throw Error('An invalid "direction" prop has been specified. Value should be either "ltr" or "rtl". ' + ('"' + direction + '" was specified.'));
    }
    switch (layout) {
      case "horizontal":
      case "vertical":
        break;
      default:
        throw Error('An invalid "layout" prop has been specified. Value should be either "horizontal" or "vertical". ' + ('"' + layout + '" was specified.'));
    }
    if (children == null) {
      throw Error('An invalid "children" prop has been specified. Value should be a React component. ' + ('"' + (children === null ? "null" : typeof children) + '" was specified.'));
    }
    if (isHorizontal && typeof width !== "number") {
      throw Error('An invalid "width" prop has been specified. Horizontal lists must specify a number for width. ' + ('"' + (width === null ? "null" : typeof width) + '" was specified.'));
    } else if (!isHorizontal && typeof height !== "number") {
      throw Error('An invalid "height" prop has been specified. Vertical lists must specify a number for height. ' + ('"' + (height === null ? "null" : typeof height) + '" was specified.'));
    }
  }
};
var DEFAULT_ESTIMATED_ITEM_SIZE$1 = 50;
var getItemMetadata$1 = function getItemMetadata3(props, index, instanceProps) {
  var _ref = props, itemSize = _ref.itemSize;
  var itemMetadataMap = instanceProps.itemMetadataMap, lastMeasuredIndex = instanceProps.lastMeasuredIndex;
  if (index > lastMeasuredIndex) {
    var offset = 0;
    if (lastMeasuredIndex >= 0) {
      var itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }
    for (var i = lastMeasuredIndex + 1; i <= index; i++) {
      var size2 = itemSize(i);
      itemMetadataMap[i] = {
        offset,
        size: size2
      };
      offset += size2;
    }
    instanceProps.lastMeasuredIndex = index;
  }
  return itemMetadataMap[index];
};
var findNearestItem$1 = function findNearestItem3(props, instanceProps, offset) {
  var itemMetadataMap = instanceProps.itemMetadataMap, lastMeasuredIndex = instanceProps.lastMeasuredIndex;
  var lastMeasuredItemOffset = lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;
  if (lastMeasuredItemOffset >= offset) {
    return findNearestItemBinarySearch$1(props, instanceProps, lastMeasuredIndex, 0, offset);
  } else {
    return findNearestItemExponentialSearch$1(props, instanceProps, Math.max(0, lastMeasuredIndex), offset);
  }
};
var findNearestItemBinarySearch$1 = function findNearestItemBinarySearch3(props, instanceProps, high, low, offset) {
  while (low <= high) {
    var middle = low + Math.floor((high - low) / 2);
    var currentOffset = getItemMetadata$1(props, middle, instanceProps).offset;
    if (currentOffset === offset) {
      return middle;
    } else if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};
var findNearestItemExponentialSearch$1 = function findNearestItemExponentialSearch3(props, instanceProps, index, offset) {
  var itemCount = props.itemCount;
  var interval = 1;
  while (index < itemCount && getItemMetadata$1(props, index, instanceProps).offset < offset) {
    index += interval;
    interval *= 2;
  }
  return findNearestItemBinarySearch$1(props, instanceProps, Math.min(index, itemCount - 1), Math.floor(index / 2), offset);
};
var getEstimatedTotalSize = function getEstimatedTotalSize2(_ref2, _ref3) {
  var itemCount = _ref2.itemCount;
  var itemMetadataMap = _ref3.itemMetadataMap, estimatedItemSize = _ref3.estimatedItemSize, lastMeasuredIndex = _ref3.lastMeasuredIndex;
  var totalSizeOfMeasuredItems = 0;
  if (lastMeasuredIndex >= itemCount) {
    lastMeasuredIndex = itemCount - 1;
  }
  if (lastMeasuredIndex >= 0) {
    var itemMetadata = itemMetadataMap[lastMeasuredIndex];
    totalSizeOfMeasuredItems = itemMetadata.offset + itemMetadata.size;
  }
  var numUnmeasuredItems = itemCount - lastMeasuredIndex - 1;
  var totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedItemSize;
  return totalSizeOfMeasuredItems + totalSizeOfUnmeasuredItems;
};
var VariableSizeList = createListComponent({
  getItemOffset: function getItemOffset(props, index, instanceProps) {
    return getItemMetadata$1(props, index, instanceProps).offset;
  },
  getItemSize: function getItemSize(props, index, instanceProps) {
    return instanceProps.itemMetadataMap[index].size;
  },
  getEstimatedTotalSize,
  getOffsetForIndexAndAlignment: function getOffsetForIndexAndAlignment3(props, index, align, scrollOffset, instanceProps, scrollbarSize) {
    var direction = props.direction, height = props.height, layout = props.layout, width = props.width;
    var isHorizontal = direction === "horizontal" || layout === "horizontal";
    var size2 = isHorizontal ? width : height;
    var itemMetadata = getItemMetadata$1(props, index, instanceProps);
    var estimatedTotalSize = getEstimatedTotalSize(props, instanceProps);
    var maxOffset = Math.max(0, Math.min(estimatedTotalSize - size2, itemMetadata.offset));
    var minOffset = Math.max(0, itemMetadata.offset - size2 + itemMetadata.size + scrollbarSize);
    if (align === "smart") {
      if (scrollOffset >= minOffset - size2 && scrollOffset <= maxOffset + size2) {
        align = "auto";
      } else {
        align = "center";
      }
    }
    switch (align) {
      case "start":
        return maxOffset;
      case "end":
        return minOffset;
      case "center":
        return Math.round(minOffset + (maxOffset - minOffset) / 2);
      case "auto":
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },
  getStartIndexForOffset: function getStartIndexForOffset(props, offset, instanceProps) {
    return findNearestItem$1(props, instanceProps, offset);
  },
  getStopIndexForStartIndex: function getStopIndexForStartIndex(props, startIndex, scrollOffset, instanceProps) {
    var direction = props.direction, height = props.height, itemCount = props.itemCount, layout = props.layout, width = props.width;
    var isHorizontal = direction === "horizontal" || layout === "horizontal";
    var size2 = isHorizontal ? width : height;
    var itemMetadata = getItemMetadata$1(props, startIndex, instanceProps);
    var maxOffset = scrollOffset + size2;
    var offset = itemMetadata.offset + itemMetadata.size;
    var stopIndex = startIndex;
    while (stopIndex < itemCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata$1(props, stopIndex, instanceProps).size;
    }
    return stopIndex;
  },
  initInstanceProps: function initInstanceProps2(props, instance) {
    var _ref4 = props, estimatedItemSize = _ref4.estimatedItemSize;
    var instanceProps = {
      itemMetadataMap: {},
      estimatedItemSize: estimatedItemSize || DEFAULT_ESTIMATED_ITEM_SIZE$1,
      lastMeasuredIndex: -1
    };
    instance.resetAfterIndex = function(index, shouldForceUpdate) {
      if (shouldForceUpdate === void 0) {
        shouldForceUpdate = true;
      }
      instanceProps.lastMeasuredIndex = Math.min(instanceProps.lastMeasuredIndex, index - 1);
      instance._getItemStyleCache(-1);
      if (shouldForceUpdate) {
        instance.forceUpdate();
      }
    };
    return instanceProps;
  },
  shouldResetStyleCacheOnItemSizeChange: false,
  validateProps: function validateProps2(_ref5) {
    var itemSize = _ref5.itemSize;
    if (true) {
      if (typeof itemSize !== "function") {
        throw Error('An invalid "itemSize" prop has been specified. Value should be a function. ' + ('"' + (itemSize === null ? "null" : typeof itemSize) + '" was specified.'));
      }
    }
  }
});
var FixedSizeGrid = createGridComponent({
  getColumnOffset: function getColumnOffset2(_ref, index) {
    var columnWidth = _ref.columnWidth;
    return index * columnWidth;
  },
  getColumnWidth: function getColumnWidth2(_ref2, index) {
    var columnWidth = _ref2.columnWidth;
    return columnWidth;
  },
  getRowOffset: function getRowOffset2(_ref3, index) {
    var rowHeight = _ref3.rowHeight;
    return index * rowHeight;
  },
  getRowHeight: function getRowHeight2(_ref4, index) {
    var rowHeight = _ref4.rowHeight;
    return rowHeight;
  },
  getEstimatedTotalHeight: function getEstimatedTotalHeight3(_ref5) {
    var rowCount = _ref5.rowCount, rowHeight = _ref5.rowHeight;
    return rowHeight * rowCount;
  },
  getEstimatedTotalWidth: function getEstimatedTotalWidth3(_ref6) {
    var columnCount = _ref6.columnCount, columnWidth = _ref6.columnWidth;
    return columnWidth * columnCount;
  },
  getOffsetForColumnAndAlignment: function getOffsetForColumnAndAlignment2(_ref7, columnIndex, align, scrollLeft, instanceProps, scrollbarSize) {
    var columnCount = _ref7.columnCount, columnWidth = _ref7.columnWidth, width = _ref7.width;
    var lastColumnOffset = Math.max(0, columnCount * columnWidth - width);
    var maxOffset = Math.min(lastColumnOffset, columnIndex * columnWidth);
    var minOffset = Math.max(0, columnIndex * columnWidth - width + scrollbarSize + columnWidth);
    if (align === "smart") {
      if (scrollLeft >= minOffset - width && scrollLeft <= maxOffset + width) {
        align = "auto";
      } else {
        align = "center";
      }
    }
    switch (align) {
      case "start":
        return maxOffset;
      case "end":
        return minOffset;
      case "center":
        var middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (middleOffset < Math.ceil(width / 2)) {
          return 0;
        } else if (middleOffset > lastColumnOffset + Math.floor(width / 2)) {
          return lastColumnOffset;
        } else {
          return middleOffset;
        }
      case "auto":
      default:
        if (scrollLeft >= minOffset && scrollLeft <= maxOffset) {
          return scrollLeft;
        } else if (minOffset > maxOffset) {
          return minOffset;
        } else if (scrollLeft < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },
  getOffsetForRowAndAlignment: function getOffsetForRowAndAlignment2(_ref8, rowIndex, align, scrollTop, instanceProps, scrollbarSize) {
    var rowHeight = _ref8.rowHeight, height = _ref8.height, rowCount = _ref8.rowCount;
    var lastRowOffset = Math.max(0, rowCount * rowHeight - height);
    var maxOffset = Math.min(lastRowOffset, rowIndex * rowHeight);
    var minOffset = Math.max(0, rowIndex * rowHeight - height + scrollbarSize + rowHeight);
    if (align === "smart") {
      if (scrollTop >= minOffset - height && scrollTop <= maxOffset + height) {
        align = "auto";
      } else {
        align = "center";
      }
    }
    switch (align) {
      case "start":
        return maxOffset;
      case "end":
        return minOffset;
      case "center":
        var middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (middleOffset < Math.ceil(height / 2)) {
          return 0;
        } else if (middleOffset > lastRowOffset + Math.floor(height / 2)) {
          return lastRowOffset;
        } else {
          return middleOffset;
        }
      case "auto":
      default:
        if (scrollTop >= minOffset && scrollTop <= maxOffset) {
          return scrollTop;
        } else if (minOffset > maxOffset) {
          return minOffset;
        } else if (scrollTop < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },
  getColumnStartIndexForOffset: function getColumnStartIndexForOffset2(_ref9, scrollLeft) {
    var columnWidth = _ref9.columnWidth, columnCount = _ref9.columnCount;
    return Math.max(0, Math.min(columnCount - 1, Math.floor(scrollLeft / columnWidth)));
  },
  getColumnStopIndexForStartIndex: function getColumnStopIndexForStartIndex2(_ref10, startIndex, scrollLeft) {
    var columnWidth = _ref10.columnWidth, columnCount = _ref10.columnCount, width = _ref10.width;
    var left = startIndex * columnWidth;
    var numVisibleColumns = Math.ceil((width + scrollLeft - left) / columnWidth);
    return Math.max(0, Math.min(
      columnCount - 1,
      startIndex + numVisibleColumns - 1
      // -1 is because stop index is inclusive
    ));
  },
  getRowStartIndexForOffset: function getRowStartIndexForOffset2(_ref11, scrollTop) {
    var rowHeight = _ref11.rowHeight, rowCount = _ref11.rowCount;
    return Math.max(0, Math.min(rowCount - 1, Math.floor(scrollTop / rowHeight)));
  },
  getRowStopIndexForStartIndex: function getRowStopIndexForStartIndex2(_ref12, startIndex, scrollTop) {
    var rowHeight = _ref12.rowHeight, rowCount = _ref12.rowCount, height = _ref12.height;
    var top = startIndex * rowHeight;
    var numVisibleRows = Math.ceil((height + scrollTop - top) / rowHeight);
    return Math.max(0, Math.min(
      rowCount - 1,
      startIndex + numVisibleRows - 1
      // -1 is because stop index is inclusive
    ));
  },
  initInstanceProps: function initInstanceProps3(props) {
  },
  shouldResetStyleCacheOnItemSizeChange: true,
  validateProps: function validateProps3(_ref13) {
    var columnWidth = _ref13.columnWidth, rowHeight = _ref13.rowHeight;
    if (true) {
      if (typeof columnWidth !== "number") {
        throw Error('An invalid "columnWidth" prop has been specified. Value should be a number. ' + ('"' + (columnWidth === null ? "null" : typeof columnWidth) + '" was specified.'));
      }
      if (typeof rowHeight !== "number") {
        throw Error('An invalid "rowHeight" prop has been specified. Value should be a number. ' + ('"' + (rowHeight === null ? "null" : typeof rowHeight) + '" was specified.'));
      }
    }
  }
});
var FixedSizeList = createListComponent({
  getItemOffset: function getItemOffset2(_ref, index) {
    var itemSize = _ref.itemSize;
    return index * itemSize;
  },
  getItemSize: function getItemSize2(_ref2, index) {
    var itemSize = _ref2.itemSize;
    return itemSize;
  },
  getEstimatedTotalSize: function getEstimatedTotalSize3(_ref3) {
    var itemCount = _ref3.itemCount, itemSize = _ref3.itemSize;
    return itemSize * itemCount;
  },
  getOffsetForIndexAndAlignment: function getOffsetForIndexAndAlignment4(_ref4, index, align, scrollOffset, instanceProps, scrollbarSize) {
    var direction = _ref4.direction, height = _ref4.height, itemCount = _ref4.itemCount, itemSize = _ref4.itemSize, layout = _ref4.layout, width = _ref4.width;
    var isHorizontal = direction === "horizontal" || layout === "horizontal";
    var size2 = isHorizontal ? width : height;
    var lastItemOffset = Math.max(0, itemCount * itemSize - size2);
    var maxOffset = Math.min(lastItemOffset, index * itemSize);
    var minOffset = Math.max(0, index * itemSize - size2 + itemSize + scrollbarSize);
    if (align === "smart") {
      if (scrollOffset >= minOffset - size2 && scrollOffset <= maxOffset + size2) {
        align = "auto";
      } else {
        align = "center";
      }
    }
    switch (align) {
      case "start":
        return maxOffset;
      case "end":
        return minOffset;
      case "center": {
        var middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (middleOffset < Math.ceil(size2 / 2)) {
          return 0;
        } else if (middleOffset > lastItemOffset + Math.floor(size2 / 2)) {
          return lastItemOffset;
        } else {
          return middleOffset;
        }
      }
      case "auto":
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },
  getStartIndexForOffset: function getStartIndexForOffset2(_ref5, offset) {
    var itemCount = _ref5.itemCount, itemSize = _ref5.itemSize;
    return Math.max(0, Math.min(itemCount - 1, Math.floor(offset / itemSize)));
  },
  getStopIndexForStartIndex: function getStopIndexForStartIndex2(_ref6, startIndex, scrollOffset) {
    var direction = _ref6.direction, height = _ref6.height, itemCount = _ref6.itemCount, itemSize = _ref6.itemSize, layout = _ref6.layout, width = _ref6.width;
    var isHorizontal = direction === "horizontal" || layout === "horizontal";
    var offset = startIndex * itemSize;
    var size2 = isHorizontal ? width : height;
    var numVisibleItems = Math.ceil((size2 + scrollOffset - offset) / itemSize);
    return Math.max(0, Math.min(
      itemCount - 1,
      startIndex + numVisibleItems - 1
      // -1 is because stop index is inclusive
    ));
  },
  initInstanceProps: function initInstanceProps4(props) {
  },
  shouldResetStyleCacheOnItemSizeChange: true,
  validateProps: function validateProps4(_ref7) {
    var itemSize = _ref7.itemSize;
    if (true) {
      if (typeof itemSize !== "number") {
        throw Error('An invalid "itemSize" prop has been specified. Value should be a number. ' + ('"' + (itemSize === null ? "null" : typeof itemSize) + '" was specified.'));
      }
    }
  }
});

// node_modules/react-arborist/dist/module/components/list-outer-element.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var import_react6 = __toESM(require_react());

// node_modules/react-arborist/dist/module/components/cursor.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
function Cursor() {
  var _a, _b;
  const tree = useTreeApi();
  const state = useDndContext();
  const cursor = state.cursor;
  if (!cursor || cursor.type !== "line")
    return null;
  const indent = tree.indent;
  const top = tree.rowHeight * cursor.index + ((_b = (_a = tree.props.padding) !== null && _a !== void 0 ? _a : tree.props.paddingTop) !== null && _b !== void 0 ? _b : 0);
  const left = indent * cursor.level;
  const Cursor2 = tree.renderCursor;
  return (0, import_jsx_runtime5.jsx)(Cursor2, { top, left, indent });
}

// node_modules/react-arborist/dist/module/components/list-outer-element.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var ListOuterElement = (0, import_react6.forwardRef)(function Outer(props, ref) {
  const { children } = props, rest = __rest(props, ["children"]);
  const tree = useTreeApi();
  return (0, import_jsx_runtime6.jsxs)("div", Object.assign({
    // @ts-ignore
    ref
  }, rest, { onClick: (e) => {
    if (e.currentTarget === e.target)
      tree.deselectAll();
  }, children: [(0, import_jsx_runtime6.jsx)(DropContainer, {}), children] }));
});
var DropContainer = () => {
  const tree = useTreeApi();
  return (0, import_jsx_runtime6.jsx)("div", { style: {
    height: tree.visibleNodes.length * tree.rowHeight,
    width: "100%",
    position: "absolute",
    left: "0",
    right: "0"
  }, children: (0, import_jsx_runtime6.jsx)(Cursor, {}) });
};

// node_modules/react-arborist/dist/module/components/list-inner-element.js
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
var import_react7 = __toESM(require_react());
var __rest2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var ListInnerElement = (0, import_react7.forwardRef)(function InnerElement(_a, ref) {
  var _b, _c, _d, _e;
  var { style } = _a, rest = __rest2(_a, ["style"]);
  const tree = useTreeApi();
  const paddingTop = (_c = (_b = tree.props.padding) !== null && _b !== void 0 ? _b : tree.props.paddingTop) !== null && _c !== void 0 ? _c : 0;
  const paddingBottom = (_e = (_d = tree.props.padding) !== null && _d !== void 0 ? _d : tree.props.paddingBottom) !== null && _e !== void 0 ? _e : 0;
  return (0, import_jsx_runtime7.jsx)("div", Object.assign({ ref, style: Object.assign(Object.assign({}, style), { height: `${parseFloat(style.height) + paddingTop + paddingBottom}px` }) }, rest));
});

// node_modules/react-arborist/dist/module/components/row-container.js
var import_jsx_runtime11 = __toESM(require_jsx_runtime());
var import_react31 = __toESM(require_react());

// node_modules/react-arborist/dist/module/dnd/drag-hook.js
var import_react29 = __toESM(require_react());

// node_modules/react-dnd/dist/esm/core/DndContext.js
var import_react8 = __toESM(require_react());
var DndContext2 = (0, import_react8.createContext)({
  dragDropManager: void 0
});

// node_modules/react-dnd/dist/esm/core/DndProvider.js
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
var import_react9 = __toESM(require_react());

// node_modules/dnd-core/dist/esm/interfaces.js
var HandlerRole;
(function(HandlerRole2) {
  HandlerRole2["SOURCE"] = "SOURCE";
  HandlerRole2["TARGET"] = "TARGET";
})(HandlerRole || (HandlerRole = {}));

// node_modules/@react-dnd/invariant/dist/invariant.esm.js
function invariant(condition, format) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  if (true) {
    if (format === void 0) {
      throw new Error("invariant requires an error message argument");
    }
  }
  if (!condition) {
    var error;
    if (format === void 0) {
      error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    } else {
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function() {
        return args[argIndex++];
      }));
      error.name = "Invariant Violation";
    }
    error.framesToPop = 1;
    throw error;
  }
}

// node_modules/dnd-core/dist/esm/actions/dragDrop/types.js
var INIT_COORDS = "dnd-core/INIT_COORDS";
var BEGIN_DRAG = "dnd-core/BEGIN_DRAG";
var PUBLISH_DRAG_SOURCE = "dnd-core/PUBLISH_DRAG_SOURCE";
var HOVER = "dnd-core/HOVER";
var DROP = "dnd-core/DROP";
var END_DRAG = "dnd-core/END_DRAG";

// node_modules/dnd-core/dist/esm/actions/dragDrop/local/setClientOffset.js
function setClientOffset(clientOffset, sourceClientOffset) {
  return {
    type: INIT_COORDS,
    payload: {
      sourceClientOffset: sourceClientOffset || null,
      clientOffset: clientOffset || null
    }
  };
}

// node_modules/dnd-core/dist/esm/utils/js_utils.js
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof7(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof7(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function get(obj, path, defaultValue) {
  return path.split(".").reduce(function(a, c) {
    return a && a[c] ? a[c] : defaultValue || null;
  }, obj);
}
function without(items2, item) {
  return items2.filter(function(i) {
    return i !== item;
  });
}
function isObject(input) {
  return _typeof(input) === "object";
}
function xor(itemsA, itemsB) {
  var map = /* @__PURE__ */ new Map();
  var insertItem = function insertItem2(item) {
    map.set(item, map.has(item) ? map.get(item) + 1 : 1);
  };
  itemsA.forEach(insertItem);
  itemsB.forEach(insertItem);
  var result = [];
  map.forEach(function(count, key) {
    if (count === 1) {
      result.push(key);
    }
  });
  return result;
}
function intersection(itemsA, itemsB) {
  return itemsA.filter(function(t) {
    return itemsB.indexOf(t) > -1;
  });
}

// node_modules/dnd-core/dist/esm/actions/dragDrop/beginDrag.js
var ResetCoordinatesAction = {
  type: INIT_COORDS,
  payload: {
    clientOffset: null,
    sourceClientOffset: null
  }
};
function createBeginDrag(manager) {
  return function beginDrag() {
    var sourceIds = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      publishSource: true
    };
    var _options$publishSourc = options.publishSource, publishSource = _options$publishSourc === void 0 ? true : _options$publishSourc, clientOffset = options.clientOffset, getSourceClientOffset2 = options.getSourceClientOffset;
    var monitor = manager.getMonitor();
    var registry = manager.getRegistry();
    manager.dispatch(setClientOffset(clientOffset));
    verifyInvariants(sourceIds, monitor, registry);
    var sourceId = getDraggableSource(sourceIds, monitor);
    if (sourceId === null) {
      manager.dispatch(ResetCoordinatesAction);
      return;
    }
    var sourceClientOffset = null;
    if (clientOffset) {
      if (!getSourceClientOffset2) {
        throw new Error("getSourceClientOffset must be defined");
      }
      verifyGetSourceClientOffsetIsFunction(getSourceClientOffset2);
      sourceClientOffset = getSourceClientOffset2(sourceId);
    }
    manager.dispatch(setClientOffset(clientOffset, sourceClientOffset));
    var source = registry.getSource(sourceId);
    var item = source.beginDrag(monitor, sourceId);
    if (item == null) {
      return void 0;
    }
    verifyItemIsObject(item);
    registry.pinSource(sourceId);
    var itemType = registry.getSourceType(sourceId);
    return {
      type: BEGIN_DRAG,
      payload: {
        itemType,
        item,
        sourceId,
        clientOffset: clientOffset || null,
        sourceClientOffset: sourceClientOffset || null,
        isSourcePublic: !!publishSource
      }
    };
  };
}
function verifyInvariants(sourceIds, monitor, registry) {
  invariant(!monitor.isDragging(), "Cannot call beginDrag while dragging.");
  sourceIds.forEach(function(sourceId) {
    invariant(registry.getSource(sourceId), "Expected sourceIds to be registered.");
  });
}
function verifyGetSourceClientOffsetIsFunction(getSourceClientOffset2) {
  invariant(typeof getSourceClientOffset2 === "function", "When clientOffset is provided, getSourceClientOffset must be a function.");
}
function verifyItemIsObject(item) {
  invariant(isObject(item), "Item must be an object.");
}
function getDraggableSource(sourceIds, monitor) {
  var sourceId = null;
  for (var i = sourceIds.length - 1; i >= 0; i--) {
    if (monitor.canDragSource(sourceIds[i])) {
      sourceId = sourceIds[i];
      break;
    }
  }
  return sourceId;
}

// node_modules/dnd-core/dist/esm/actions/dragDrop/publishDragSource.js
function createPublishDragSource(manager) {
  return function publishDragSource() {
    var monitor = manager.getMonitor();
    if (monitor.isDragging()) {
      return {
        type: PUBLISH_DRAG_SOURCE
      };
    }
  };
}

// node_modules/dnd-core/dist/esm/utils/matchesType.js
function matchesType(targetType, draggedItemType) {
  if (draggedItemType === null) {
    return targetType === null;
  }
  return Array.isArray(targetType) ? targetType.some(function(t) {
    return t === draggedItemType;
  }) : targetType === draggedItemType;
}

// node_modules/dnd-core/dist/esm/actions/dragDrop/hover.js
function createHover(manager) {
  return function hover(targetIdsArg) {
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, clientOffset = _ref.clientOffset;
    verifyTargetIdsIsArray(targetIdsArg);
    var targetIds = targetIdsArg.slice(0);
    var monitor = manager.getMonitor();
    var registry = manager.getRegistry();
    checkInvariants(targetIds, monitor, registry);
    var draggedItemType = monitor.getItemType();
    removeNonMatchingTargetIds(targetIds, registry, draggedItemType);
    hoverAllTargets(targetIds, monitor, registry);
    return {
      type: HOVER,
      payload: {
        targetIds,
        clientOffset: clientOffset || null
      }
    };
  };
}
function verifyTargetIdsIsArray(targetIdsArg) {
  invariant(Array.isArray(targetIdsArg), "Expected targetIds to be an array.");
}
function checkInvariants(targetIds, monitor, registry) {
  invariant(monitor.isDragging(), "Cannot call hover while not dragging.");
  invariant(!monitor.didDrop(), "Cannot call hover after drop.");
  for (var i = 0; i < targetIds.length; i++) {
    var targetId = targetIds[i];
    invariant(targetIds.lastIndexOf(targetId) === i, "Expected targetIds to be unique in the passed array.");
    var target = registry.getTarget(targetId);
    invariant(target, "Expected targetIds to be registered.");
  }
}
function removeNonMatchingTargetIds(targetIds, registry, draggedItemType) {
  for (var i = targetIds.length - 1; i >= 0; i--) {
    var targetId = targetIds[i];
    var targetType = registry.getTargetType(targetId);
    if (!matchesType(targetType, draggedItemType)) {
      targetIds.splice(i, 1);
    }
  }
}
function hoverAllTargets(targetIds, monitor, registry) {
  targetIds.forEach(function(targetId) {
    var target = registry.getTarget(targetId);
    target.hover(monitor, targetId);
  });
}

// node_modules/dnd-core/dist/esm/actions/dragDrop/drop.js
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function createDrop(manager) {
  return function drop() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var monitor = manager.getMonitor();
    var registry = manager.getRegistry();
    verifyInvariants2(monitor);
    var targetIds = getDroppableTargets(monitor);
    targetIds.forEach(function(targetId, index) {
      var dropResult = determineDropResult(targetId, index, registry, monitor);
      var action = {
        type: DROP,
        payload: {
          dropResult: _objectSpread(_objectSpread({}, options), dropResult)
        }
      };
      manager.dispatch(action);
    });
  };
}
function verifyInvariants2(monitor) {
  invariant(monitor.isDragging(), "Cannot call drop while not dragging.");
  invariant(!monitor.didDrop(), "Cannot call drop twice during one drag operation.");
}
function determineDropResult(targetId, index, registry, monitor) {
  var target = registry.getTarget(targetId);
  var dropResult = target ? target.drop(monitor, targetId) : void 0;
  verifyDropResultType(dropResult);
  if (typeof dropResult === "undefined") {
    dropResult = index === 0 ? {} : monitor.getDropResult();
  }
  return dropResult;
}
function verifyDropResultType(dropResult) {
  invariant(typeof dropResult === "undefined" || isObject(dropResult), "Drop result must either be an object or undefined.");
}
function getDroppableTargets(monitor) {
  var targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);
  targetIds.reverse();
  return targetIds;
}

// node_modules/dnd-core/dist/esm/actions/dragDrop/endDrag.js
function createEndDrag(manager) {
  return function endDrag() {
    var monitor = manager.getMonitor();
    var registry = manager.getRegistry();
    verifyIsDragging(monitor);
    var sourceId = monitor.getSourceId();
    if (sourceId != null) {
      var source = registry.getSource(sourceId, true);
      source.endDrag(monitor, sourceId);
      registry.unpinSource();
    }
    return {
      type: END_DRAG
    };
  };
}
function verifyIsDragging(monitor) {
  invariant(monitor.isDragging(), "Cannot call endDrag while not dragging.");
}

// node_modules/dnd-core/dist/esm/actions/dragDrop/index.js
function createDragDropActions(manager) {
  return {
    beginDrag: createBeginDrag(manager),
    publishDragSource: createPublishDragSource(manager),
    hover: createHover(manager),
    drop: createDrop(manager),
    endDrag: createEndDrag(manager)
  };
}

// node_modules/dnd-core/dist/esm/classes/DragDropManagerImpl.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _defineProperty2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var DragDropManagerImpl = function() {
  function DragDropManagerImpl2(store, monitor) {
    var _this = this;
    _classCallCheck(this, DragDropManagerImpl2);
    _defineProperty2(this, "store", void 0);
    _defineProperty2(this, "monitor", void 0);
    _defineProperty2(this, "backend", void 0);
    _defineProperty2(this, "isSetUp", false);
    _defineProperty2(this, "handleRefCountChange", function() {
      var shouldSetUp = _this.store.getState().refCount > 0;
      if (_this.backend) {
        if (shouldSetUp && !_this.isSetUp) {
          _this.backend.setup();
          _this.isSetUp = true;
        } else if (!shouldSetUp && _this.isSetUp) {
          _this.backend.teardown();
          _this.isSetUp = false;
        }
      }
    });
    this.store = store;
    this.monitor = monitor;
    store.subscribe(this.handleRefCountChange);
  }
  _createClass(DragDropManagerImpl2, [{
    key: "receiveBackend",
    value: function receiveBackend(backend) {
      this.backend = backend;
    }
  }, {
    key: "getMonitor",
    value: function getMonitor() {
      return this.monitor;
    }
  }, {
    key: "getBackend",
    value: function getBackend() {
      return this.backend;
    }
  }, {
    key: "getRegistry",
    value: function getRegistry() {
      return this.monitor.registry;
    }
  }, {
    key: "getActions",
    value: function getActions() {
      var manager = this;
      var dispatch = this.store.dispatch;
      function bindActionCreator(actionCreator) {
        return function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          var action = actionCreator.apply(manager, args);
          if (typeof action !== "undefined") {
            dispatch(action);
          }
        };
      }
      var actions4 = createDragDropActions(this);
      return Object.keys(actions4).reduce(function(boundActions, key) {
        var action = actions4[key];
        boundActions[key] = bindActionCreator(action);
        return boundActions;
      }, {});
    }
  }, {
    key: "dispatch",
    value: function dispatch(action) {
      this.store.dispatch(action);
    }
  }]);
  return DragDropManagerImpl2;
}();

// node_modules/dnd-core/node_modules/redux/es/redux.js
var $$observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
var randomString = function randomString2() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null) return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
function miniKindOf(val) {
  if (val === void 0) return "undefined";
  if (val === null) return "null";
  var type = typeof val;
  switch (type) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function": {
      return type;
    }
  }
  if (Array.isArray(val)) return "array";
  if (isDate(val)) return "date";
  if (isError(val)) return "error";
  var constructorName = ctorName(val);
  switch (constructorName) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return constructorName;
  }
  return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function ctorName(val) {
  return typeof val.constructor === "function" ? val.constructor.name : null;
}
function isError(val) {
  return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
}
function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
}
function kindOf(val) {
  var typeOfVal = typeof val;
  if (true) {
    typeOfVal = miniKindOf(val);
  }
  return typeOfVal;
}
function createStore(reducer7, preloadedState, enhancer) {
  var _ref2;
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(false ? formatProdErrorMessage(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(false ? formatProdErrorMessage(1) : "Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
    }
    return enhancer(createStore)(reducer7, preloadedState);
  }
  if (typeof reducer7 !== "function") {
    throw new Error(false ? formatProdErrorMessage(2) : "Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer7) + "'");
  }
  var currentReducer = reducer7;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(false ? formatProdErrorMessage(4) : "Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(false ? formatProdErrorMessage(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(false ? formatProdErrorMessage(7) : "Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
    }
    if (typeof action.type === "undefined") {
      throw new Error(false ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(9) : "Reducers may not dispatch actions.");
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(false ? formatProdErrorMessage(10) : "Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
    }
    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  function observable() {
    var _ref;
    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe2(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(false ? formatProdErrorMessage(11) : "Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }
        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      }
    }, _ref[$$observable] = function() {
      return this;
    }, _ref;
  }
  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}

// node_modules/dnd-core/dist/esm/utils/equality.js
var strictEquality = function strictEquality2(a, b) {
  return a === b;
};
function areCoordsEqual(offsetA, offsetB) {
  if (!offsetA && !offsetB) {
    return true;
  } else if (!offsetA || !offsetB) {
    return false;
  } else {
    return offsetA.x === offsetB.x && offsetA.y === offsetB.y;
  }
}
function areArraysEqual(a, b) {
  var isEqual2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : strictEquality;
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; ++i) {
    if (!isEqual2(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

// node_modules/dnd-core/dist/esm/reducers/dragOffset.js
function ownKeys2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread3(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys2(Object(source), true).forEach(function(key) {
        _defineProperty4(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys2(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty4(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var initialState2 = {
  initialSourceClientOffset: null,
  initialClientOffset: null,
  clientOffset: null
};
function reduce() {
  var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : initialState2;
  var action = arguments.length > 1 ? arguments[1] : void 0;
  var payload = action.payload;
  switch (action.type) {
    case INIT_COORDS:
    case BEGIN_DRAG:
      return {
        initialSourceClientOffset: payload.sourceClientOffset,
        initialClientOffset: payload.clientOffset,
        clientOffset: payload.clientOffset
      };
    case HOVER:
      if (areCoordsEqual(state.clientOffset, payload.clientOffset)) {
        return state;
      }
      return _objectSpread3(_objectSpread3({}, state), {}, {
        clientOffset: payload.clientOffset
      });
    case END_DRAG:
    case DROP:
      return initialState2;
    default:
      return state;
  }
}

// node_modules/dnd-core/dist/esm/actions/registry.js
var ADD_SOURCE = "dnd-core/ADD_SOURCE";
var ADD_TARGET = "dnd-core/ADD_TARGET";
var REMOVE_SOURCE = "dnd-core/REMOVE_SOURCE";
var REMOVE_TARGET = "dnd-core/REMOVE_TARGET";
function addSource(sourceId) {
  return {
    type: ADD_SOURCE,
    payload: {
      sourceId
    }
  };
}
function addTarget(targetId) {
  return {
    type: ADD_TARGET,
    payload: {
      targetId
    }
  };
}
function removeSource(sourceId) {
  return {
    type: REMOVE_SOURCE,
    payload: {
      sourceId
    }
  };
}
function removeTarget(targetId) {
  return {
    type: REMOVE_TARGET,
    payload: {
      targetId
    }
  };
}

// node_modules/dnd-core/dist/esm/reducers/dragOperation.js
function ownKeys3(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread4(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys3(Object(source), true).forEach(function(key) {
        _defineProperty5(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys3(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty5(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var initialState3 = {
  itemType: null,
  item: null,
  sourceId: null,
  targetIds: [],
  dropResult: null,
  didDrop: false,
  isSourcePublic: null
};
function reduce2() {
  var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : initialState3;
  var action = arguments.length > 1 ? arguments[1] : void 0;
  var payload = action.payload;
  switch (action.type) {
    case BEGIN_DRAG:
      return _objectSpread4(_objectSpread4({}, state), {}, {
        itemType: payload.itemType,
        item: payload.item,
        sourceId: payload.sourceId,
        isSourcePublic: payload.isSourcePublic,
        dropResult: null,
        didDrop: false
      });
    case PUBLISH_DRAG_SOURCE:
      return _objectSpread4(_objectSpread4({}, state), {}, {
        isSourcePublic: true
      });
    case HOVER:
      return _objectSpread4(_objectSpread4({}, state), {}, {
        targetIds: payload.targetIds
      });
    case REMOVE_TARGET:
      if (state.targetIds.indexOf(payload.targetId) === -1) {
        return state;
      }
      return _objectSpread4(_objectSpread4({}, state), {}, {
        targetIds: without(state.targetIds, payload.targetId)
      });
    case DROP:
      return _objectSpread4(_objectSpread4({}, state), {}, {
        dropResult: payload.dropResult,
        didDrop: true,
        targetIds: []
      });
    case END_DRAG:
      return _objectSpread4(_objectSpread4({}, state), {}, {
        itemType: null,
        item: null,
        sourceId: null,
        dropResult: null,
        didDrop: false,
        isSourcePublic: null,
        targetIds: []
      });
    default:
      return state;
  }
}

// node_modules/dnd-core/dist/esm/reducers/refCount.js
function reduce3() {
  var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
  var action = arguments.length > 1 ? arguments[1] : void 0;
  switch (action.type) {
    case ADD_SOURCE:
    case ADD_TARGET:
      return state + 1;
    case REMOVE_SOURCE:
    case REMOVE_TARGET:
      return state - 1;
    default:
      return state;
  }
}

// node_modules/dnd-core/dist/esm/utils/dirtiness.js
var NONE = [];
var ALL = [];
NONE.__IS_NONE__ = true;
ALL.__IS_ALL__ = true;
function areDirty(dirtyIds, handlerIds) {
  if (dirtyIds === NONE) {
    return false;
  }
  if (dirtyIds === ALL || typeof handlerIds === "undefined") {
    return true;
  }
  var commonIds = intersection(handlerIds, dirtyIds);
  return commonIds.length > 0;
}

// node_modules/dnd-core/dist/esm/reducers/dirtyHandlerIds.js
function reduce4() {
  var _state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : NONE;
  var action = arguments.length > 1 ? arguments[1] : void 0;
  switch (action.type) {
    case HOVER:
      break;
    case ADD_SOURCE:
    case ADD_TARGET:
    case REMOVE_TARGET:
    case REMOVE_SOURCE:
      return NONE;
    case BEGIN_DRAG:
    case PUBLISH_DRAG_SOURCE:
    case END_DRAG:
    case DROP:
    default:
      return ALL;
  }
  var _action$payload = action.payload, _action$payload$targe = _action$payload.targetIds, targetIds = _action$payload$targe === void 0 ? [] : _action$payload$targe, _action$payload$prevT = _action$payload.prevTargetIds, prevTargetIds = _action$payload$prevT === void 0 ? [] : _action$payload$prevT;
  var result = xor(targetIds, prevTargetIds);
  var didChange = result.length > 0 || !areArraysEqual(targetIds, prevTargetIds);
  if (!didChange) {
    return NONE;
  }
  var prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
  var innermostTargetId = targetIds[targetIds.length - 1];
  if (prevInnermostTargetId !== innermostTargetId) {
    if (prevInnermostTargetId) {
      result.push(prevInnermostTargetId);
    }
    if (innermostTargetId) {
      result.push(innermostTargetId);
    }
  }
  return result;
}

// node_modules/dnd-core/dist/esm/reducers/stateId.js
function reduce5() {
  var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
  return state + 1;
}

// node_modules/dnd-core/dist/esm/reducers/index.js
function ownKeys4(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread5(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys4(Object(source), true).forEach(function(key) {
        _defineProperty6(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys4(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty6(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function reduce6() {
  var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : void 0;
  return {
    dirtyHandlerIds: reduce4(state.dirtyHandlerIds, {
      type: action.type,
      payload: _objectSpread5(_objectSpread5({}, action.payload), {}, {
        prevTargetIds: get(state, "dragOperation.targetIds", [])
      })
    }),
    dragOffset: reduce(state.dragOffset, action),
    refCount: reduce3(state.refCount, action),
    dragOperation: reduce2(state.dragOperation, action),
    stateId: reduce5(state.stateId)
  };
}

// node_modules/dnd-core/dist/esm/utils/coords.js
function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}
function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}
function getSourceClientOffset(state) {
  var clientOffset = state.clientOffset, initialClientOffset = state.initialClientOffset, initialSourceClientOffset = state.initialSourceClientOffset;
  if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
    return null;
  }
  return subtract(add(clientOffset, initialSourceClientOffset), initialClientOffset);
}
function getDifferenceFromInitialOffset(state) {
  var clientOffset = state.clientOffset, initialClientOffset = state.initialClientOffset;
  if (!clientOffset || !initialClientOffset) {
    return null;
  }
  return subtract(clientOffset, initialClientOffset);
}

// node_modules/dnd-core/dist/esm/classes/DragDropMonitorImpl.js
function _classCallCheck2(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties2(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass2(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties2(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties2(Constructor, staticProps);
  return Constructor;
}
function _defineProperty7(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var DragDropMonitorImpl = function() {
  function DragDropMonitorImpl2(store, registry) {
    _classCallCheck2(this, DragDropMonitorImpl2);
    _defineProperty7(this, "store", void 0);
    _defineProperty7(this, "registry", void 0);
    this.store = store;
    this.registry = registry;
  }
  _createClass2(DragDropMonitorImpl2, [{
    key: "subscribeToStateChange",
    value: function subscribeToStateChange(listener) {
      var _this = this;
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        handlerIds: void 0
      };
      var handlerIds = options.handlerIds;
      invariant(typeof listener === "function", "listener must be a function.");
      invariant(typeof handlerIds === "undefined" || Array.isArray(handlerIds), "handlerIds, when specified, must be an array of strings.");
      var prevStateId = this.store.getState().stateId;
      var handleChange = function handleChange2() {
        var state = _this.store.getState();
        var currentStateId = state.stateId;
        try {
          var canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !areDirty(state.dirtyHandlerIds, handlerIds);
          if (!canSkipListener) {
            listener();
          }
        } finally {
          prevStateId = currentStateId;
        }
      };
      return this.store.subscribe(handleChange);
    }
  }, {
    key: "subscribeToOffsetChange",
    value: function subscribeToOffsetChange(listener) {
      var _this2 = this;
      invariant(typeof listener === "function", "listener must be a function.");
      var previousState = this.store.getState().dragOffset;
      var handleChange = function handleChange2() {
        var nextState = _this2.store.getState().dragOffset;
        if (nextState === previousState) {
          return;
        }
        previousState = nextState;
        listener();
      };
      return this.store.subscribe(handleChange);
    }
  }, {
    key: "canDragSource",
    value: function canDragSource(sourceId) {
      if (!sourceId) {
        return false;
      }
      var source = this.registry.getSource(sourceId);
      invariant(source, "Expected to find a valid source. sourceId=".concat(sourceId));
      if (this.isDragging()) {
        return false;
      }
      return source.canDrag(this, sourceId);
    }
  }, {
    key: "canDropOnTarget",
    value: function canDropOnTarget(targetId) {
      if (!targetId) {
        return false;
      }
      var target = this.registry.getTarget(targetId);
      invariant(target, "Expected to find a valid target. targetId=".concat(targetId));
      if (!this.isDragging() || this.didDrop()) {
        return false;
      }
      var targetType = this.registry.getTargetType(targetId);
      var draggedItemType = this.getItemType();
      return matchesType(targetType, draggedItemType) && target.canDrop(this, targetId);
    }
  }, {
    key: "isDragging",
    value: function isDragging() {
      return Boolean(this.getItemType());
    }
  }, {
    key: "isDraggingSource",
    value: function isDraggingSource(sourceId) {
      if (!sourceId) {
        return false;
      }
      var source = this.registry.getSource(sourceId, true);
      invariant(source, "Expected to find a valid source. sourceId=".concat(sourceId));
      if (!this.isDragging() || !this.isSourcePublic()) {
        return false;
      }
      var sourceType = this.registry.getSourceType(sourceId);
      var draggedItemType = this.getItemType();
      if (sourceType !== draggedItemType) {
        return false;
      }
      return source.isDragging(this, sourceId);
    }
  }, {
    key: "isOverTarget",
    value: function isOverTarget(targetId) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        shallow: false
      };
      if (!targetId) {
        return false;
      }
      var shallow = options.shallow;
      if (!this.isDragging()) {
        return false;
      }
      var targetType = this.registry.getTargetType(targetId);
      var draggedItemType = this.getItemType();
      if (draggedItemType && !matchesType(targetType, draggedItemType)) {
        return false;
      }
      var targetIds = this.getTargetIds();
      if (!targetIds.length) {
        return false;
      }
      var index = targetIds.indexOf(targetId);
      if (shallow) {
        return index === targetIds.length - 1;
      } else {
        return index > -1;
      }
    }
  }, {
    key: "getItemType",
    value: function getItemType() {
      return this.store.getState().dragOperation.itemType;
    }
  }, {
    key: "getItem",
    value: function getItem() {
      return this.store.getState().dragOperation.item;
    }
  }, {
    key: "getSourceId",
    value: function getSourceId() {
      return this.store.getState().dragOperation.sourceId;
    }
  }, {
    key: "getTargetIds",
    value: function getTargetIds() {
      return this.store.getState().dragOperation.targetIds;
    }
  }, {
    key: "getDropResult",
    value: function getDropResult() {
      return this.store.getState().dragOperation.dropResult;
    }
  }, {
    key: "didDrop",
    value: function didDrop() {
      return this.store.getState().dragOperation.didDrop;
    }
  }, {
    key: "isSourcePublic",
    value: function isSourcePublic() {
      return Boolean(this.store.getState().dragOperation.isSourcePublic);
    }
  }, {
    key: "getInitialClientOffset",
    value: function getInitialClientOffset() {
      return this.store.getState().dragOffset.initialClientOffset;
    }
  }, {
    key: "getInitialSourceClientOffset",
    value: function getInitialSourceClientOffset() {
      return this.store.getState().dragOffset.initialSourceClientOffset;
    }
  }, {
    key: "getClientOffset",
    value: function getClientOffset() {
      return this.store.getState().dragOffset.clientOffset;
    }
  }, {
    key: "getSourceClientOffset",
    value: function getSourceClientOffset2() {
      return getSourceClientOffset(this.store.getState().dragOffset);
    }
  }, {
    key: "getDifferenceFromInitialOffset",
    value: function getDifferenceFromInitialOffset2() {
      return getDifferenceFromInitialOffset(this.store.getState().dragOffset);
    }
  }]);
  return DragDropMonitorImpl2;
}();

// node_modules/dnd-core/dist/esm/utils/getNextUniqueId.js
var nextUniqueId = 0;
function getNextUniqueId() {
  return nextUniqueId++;
}

// node_modules/dnd-core/dist/esm/contracts.js
function _typeof3(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof3 = function _typeof7(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof3 = function _typeof7(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof3(obj);
}
function validateSourceContract(source) {
  invariant(typeof source.canDrag === "function", "Expected canDrag to be a function.");
  invariant(typeof source.beginDrag === "function", "Expected beginDrag to be a function.");
  invariant(typeof source.endDrag === "function", "Expected endDrag to be a function.");
}
function validateTargetContract(target) {
  invariant(typeof target.canDrop === "function", "Expected canDrop to be a function.");
  invariant(typeof target.hover === "function", "Expected hover to be a function.");
  invariant(typeof target.drop === "function", "Expected beginDrag to be a function.");
}
function validateType(type, allowArray) {
  if (allowArray && Array.isArray(type)) {
    type.forEach(function(t) {
      return validateType(t, false);
    });
    return;
  }
  invariant(typeof type === "string" || _typeof3(type) === "symbol", allowArray ? "Type can only be a string, a symbol, or an array of either." : "Type can only be a string or a symbol.");
}

// node_modules/@react-dnd/asap/dist/esm/makeRequestCall.mjs
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;
function makeRequestCallFromTimer(callback) {
  return function requestCall() {
    const timeoutHandle = setTimeout(handleTimer, 0);
    const intervalHandle = setInterval(handleTimer, 50);
    function handleTimer() {
      clearTimeout(timeoutHandle);
      clearInterval(intervalHandle);
      callback();
    }
  };
}
function makeRequestCallFromMutationObserver(callback) {
  let toggle = 1;
  const observer = new BrowserMutationObserver(callback);
  const node = document.createTextNode("");
  observer.observe(node, {
    characterData: true
  });
  return function requestCall() {
    toggle = -toggle;
    node.data = toggle;
  };
}
var makeRequestCall = typeof BrowserMutationObserver === "function" ? (
  // reliably everywhere they are implemented.
  // They are implemented in all modern browsers.
  //
  // - Android 4-4.3
  // - Chrome 26-34
  // - Firefox 14-29
  // - Internet Explorer 11
  // - iPad Safari 6-7.1
  // - iPhone Safari 7-7.1
  // - Safari 6-7
  makeRequestCallFromMutationObserver
) : (
  // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
  // 11-12, and in web workers in many engines.
  // Although message channels yield to any queued rendering and IO tasks, they
  // would be better than imposing the 4ms delay of timers.
  // However, they do not work reliably in Internet Explorer or Safari.
  // Internet Explorer 10 is the only browser that has setImmediate but does
  // not have MutationObservers.
  // Although setImmediate yields to the browser's renderer, it would be
  // preferrable to falling back to setTimeout since it does not have
  // the minimum 4ms penalty.
  // Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
  // Desktop to a lesser extent) that renders both setImmediate and
  // MessageChannel useless for the purposes of ASAP.
  // https://github.com/kriskowal/q/issues/396
  // Timers are implemented universally.
  // We fall back to timers in workers in most engines, and in foreground
  // contexts in the following browsers.
  // However, note that even this simple case requires nuances to operate in a
  // broad spectrum of browsers.
  //
  // - Firefox 3-13
  // - Internet Explorer 6-9
  // - iPad Safari 4.3
  // - Lynx 2.8.7
  makeRequestCallFromTimer
);

// node_modules/@react-dnd/asap/dist/esm/AsapQueue.mjs
var AsapQueue = class {
  // Use the fastest means possible to execute a task in its own turn, with
  // priority over other events including IO, animation, reflow, and redraw
  // events in browsers.
  //
  // An exception thrown by a task will permanently interrupt the processing of
  // subsequent tasks. The higher level `asap` function ensures that if an
  // exception is thrown by a task, that the task queue will continue flushing as
  // soon as possible, but if you use `rawAsap` directly, you are responsible to
  // either ensure that no exceptions are thrown from your task, or to manually
  // call `rawAsap.requestFlush` if an exception is thrown.
  enqueueTask(task) {
    const { queue: q, requestFlush } = this;
    if (!q.length) {
      requestFlush();
      this.flushing = true;
    }
    q[q.length] = task;
  }
  constructor() {
    this.queue = [];
    this.pendingErrors = [];
    this.flushing = false;
    this.index = 0;
    this.capacity = 1024;
    this.flush = () => {
      const { queue: q } = this;
      while (this.index < q.length) {
        const currentIndex = this.index;
        this.index++;
        q[currentIndex].call();
        if (this.index > this.capacity) {
          for (let scan = 0, newLength = q.length - this.index; scan < newLength; scan++) {
            q[scan] = q[scan + this.index];
          }
          q.length -= this.index;
          this.index = 0;
        }
      }
      q.length = 0;
      this.index = 0;
      this.flushing = false;
    };
    this.registerPendingError = (err) => {
      this.pendingErrors.push(err);
      this.requestErrorThrow();
    };
    this.requestFlush = makeRequestCall(this.flush);
    this.requestErrorThrow = makeRequestCallFromTimer(() => {
      if (this.pendingErrors.length) {
        throw this.pendingErrors.shift();
      }
    });
  }
};

// node_modules/@react-dnd/asap/dist/esm/RawTask.mjs
var RawTask = class {
  call() {
    try {
      this.task && this.task();
    } catch (error) {
      this.onError(error);
    } finally {
      this.task = null;
      this.release(this);
    }
  }
  constructor(onError, release) {
    this.onError = onError;
    this.release = release;
    this.task = null;
  }
};

// node_modules/@react-dnd/asap/dist/esm/TaskFactory.mjs
var TaskFactory = class {
  create(task) {
    const tasks = this.freeTasks;
    const t1 = tasks.length ? tasks.pop() : new RawTask(
      this.onError,
      (t) => tasks[tasks.length] = t
    );
    t1.task = task;
    return t1;
  }
  constructor(onError) {
    this.onError = onError;
    this.freeTasks = [];
  }
};

// node_modules/@react-dnd/asap/dist/esm/asap.mjs
var asapQueue = new AsapQueue();
var taskFactory = new TaskFactory(asapQueue.registerPendingError);
function asap(task) {
  asapQueue.enqueueTask(taskFactory.create(task));
}

// node_modules/dnd-core/dist/esm/classes/HandlerRegistryImpl.js
function _classCallCheck3(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties3(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass3(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties3(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties3(Constructor, staticProps);
  return Constructor;
}
function _defineProperty8(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function getNextHandlerId(role) {
  var id = getNextUniqueId().toString();
  switch (role) {
    case HandlerRole.SOURCE:
      return "S".concat(id);
    case HandlerRole.TARGET:
      return "T".concat(id);
    default:
      throw new Error("Unknown Handler Role: ".concat(role));
  }
}
function parseRoleFromHandlerId(handlerId) {
  switch (handlerId[0]) {
    case "S":
      return HandlerRole.SOURCE;
    case "T":
      return HandlerRole.TARGET;
    default:
      invariant(false, "Cannot parse handler ID: ".concat(handlerId));
  }
}
function mapContainsValue(map, searchValue) {
  var entries = map.entries();
  var isDone = false;
  do {
    var _entries$next = entries.next(), done = _entries$next.done, _entries$next$value = _slicedToArray(_entries$next.value, 2), value = _entries$next$value[1];
    if (value === searchValue) {
      return true;
    }
    isDone = !!done;
  } while (!isDone);
  return false;
}
var HandlerRegistryImpl = function() {
  function HandlerRegistryImpl2(store) {
    _classCallCheck3(this, HandlerRegistryImpl2);
    _defineProperty8(this, "types", /* @__PURE__ */ new Map());
    _defineProperty8(this, "dragSources", /* @__PURE__ */ new Map());
    _defineProperty8(this, "dropTargets", /* @__PURE__ */ new Map());
    _defineProperty8(this, "pinnedSourceId", null);
    _defineProperty8(this, "pinnedSource", null);
    _defineProperty8(this, "store", void 0);
    this.store = store;
  }
  _createClass3(HandlerRegistryImpl2, [{
    key: "addSource",
    value: function addSource2(type, source) {
      validateType(type);
      validateSourceContract(source);
      var sourceId = this.addHandler(HandlerRole.SOURCE, type, source);
      this.store.dispatch(addSource(sourceId));
      return sourceId;
    }
  }, {
    key: "addTarget",
    value: function addTarget2(type, target) {
      validateType(type, true);
      validateTargetContract(target);
      var targetId = this.addHandler(HandlerRole.TARGET, type, target);
      this.store.dispatch(addTarget(targetId));
      return targetId;
    }
  }, {
    key: "containsHandler",
    value: function containsHandler(handler) {
      return mapContainsValue(this.dragSources, handler) || mapContainsValue(this.dropTargets, handler);
    }
  }, {
    key: "getSource",
    value: function getSource(sourceId) {
      var includePinned = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      invariant(this.isSourceId(sourceId), "Expected a valid source ID.");
      var isPinned = includePinned && sourceId === this.pinnedSourceId;
      var source = isPinned ? this.pinnedSource : this.dragSources.get(sourceId);
      return source;
    }
  }, {
    key: "getTarget",
    value: function getTarget(targetId) {
      invariant(this.isTargetId(targetId), "Expected a valid target ID.");
      return this.dropTargets.get(targetId);
    }
  }, {
    key: "getSourceType",
    value: function getSourceType(sourceId) {
      invariant(this.isSourceId(sourceId), "Expected a valid source ID.");
      return this.types.get(sourceId);
    }
  }, {
    key: "getTargetType",
    value: function getTargetType(targetId) {
      invariant(this.isTargetId(targetId), "Expected a valid target ID.");
      return this.types.get(targetId);
    }
  }, {
    key: "isSourceId",
    value: function isSourceId(handlerId) {
      var role = parseRoleFromHandlerId(handlerId);
      return role === HandlerRole.SOURCE;
    }
  }, {
    key: "isTargetId",
    value: function isTargetId(handlerId) {
      var role = parseRoleFromHandlerId(handlerId);
      return role === HandlerRole.TARGET;
    }
  }, {
    key: "removeSource",
    value: function removeSource2(sourceId) {
      var _this = this;
      invariant(this.getSource(sourceId), "Expected an existing source.");
      this.store.dispatch(removeSource(sourceId));
      asap(function() {
        _this.dragSources.delete(sourceId);
        _this.types.delete(sourceId);
      });
    }
  }, {
    key: "removeTarget",
    value: function removeTarget2(targetId) {
      invariant(this.getTarget(targetId), "Expected an existing target.");
      this.store.dispatch(removeTarget(targetId));
      this.dropTargets.delete(targetId);
      this.types.delete(targetId);
    }
  }, {
    key: "pinSource",
    value: function pinSource(sourceId) {
      var source = this.getSource(sourceId);
      invariant(source, "Expected an existing source.");
      this.pinnedSourceId = sourceId;
      this.pinnedSource = source;
    }
  }, {
    key: "unpinSource",
    value: function unpinSource() {
      invariant(this.pinnedSource, "No source is pinned at the time.");
      this.pinnedSourceId = null;
      this.pinnedSource = null;
    }
  }, {
    key: "addHandler",
    value: function addHandler(role, type, handler) {
      var id = getNextHandlerId(role);
      this.types.set(id, type);
      if (role === HandlerRole.SOURCE) {
        this.dragSources.set(id, handler);
      } else if (role === HandlerRole.TARGET) {
        this.dropTargets.set(id, handler);
      }
      return id;
    }
  }]);
  return HandlerRegistryImpl2;
}();

// node_modules/dnd-core/dist/esm/createDragDropManager.js
function createDragDropManager(backendFactory) {
  var globalContext = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
  var backendOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var debugMode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  var store = makeStoreInstance(debugMode);
  var monitor = new DragDropMonitorImpl(store, new HandlerRegistryImpl(store));
  var manager = new DragDropManagerImpl(store, monitor);
  var backend = backendFactory(manager, globalContext, backendOptions);
  manager.receiveBackend(backend);
  return manager;
}
function makeStoreInstance(debugMode) {
  var reduxDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__;
  return createStore(reduce6, debugMode && reduxDevTools && reduxDevTools({
    name: "dnd-core",
    instanceId: "dnd-core"
  }));
}

// node_modules/react-dnd/dist/esm/core/DndProvider.js
var _excluded = ["children"];
function _slicedToArray2(arr, i) {
  return _arrayWithHoles2(arr) || _iterableToArrayLimit2(arr, i) || _unsupportedIterableToArray2(arr, i) || _nonIterableRest2();
}
function _nonIterableRest2() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray2(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray2(o, minLen);
}
function _arrayLikeToArray2(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit2(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles2(arr) {
  if (Array.isArray(arr)) return arr;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose2(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose2(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
var refCount = 0;
var INSTANCE_SYM = Symbol.for("__REACT_DND_CONTEXT_INSTANCE__");
var DndProvider = (0, import_react9.memo)(function DndProvider2(_ref) {
  var children = _ref.children, props = _objectWithoutProperties(_ref, _excluded);
  var _getDndContextValue = getDndContextValue(props), _getDndContextValue2 = _slicedToArray2(_getDndContextValue, 2), manager = _getDndContextValue2[0], isGlobalInstance = _getDndContextValue2[1];
  (0, import_react9.useEffect)(function() {
    if (isGlobalInstance) {
      var context = getGlobalContext();
      ++refCount;
      return function() {
        if (--refCount === 0) {
          context[INSTANCE_SYM] = null;
        }
      };
    }
  }, []);
  return (0, import_jsx_runtime8.jsx)(DndContext2.Provider, Object.assign({
    value: manager
  }, {
    children
  }), void 0);
});
function getDndContextValue(props) {
  if ("manager" in props) {
    var _manager = {
      dragDropManager: props.manager
    };
    return [_manager, false];
  }
  var manager = createSingletonDndContext(props.backend, props.context, props.options, props.debugMode);
  var isGlobalInstance = !props.context;
  return [manager, isGlobalInstance];
}
function createSingletonDndContext(backend) {
  var context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getGlobalContext();
  var options = arguments.length > 2 ? arguments[2] : void 0;
  var debugMode = arguments.length > 3 ? arguments[3] : void 0;
  var ctx = context;
  if (!ctx[INSTANCE_SYM]) {
    ctx[INSTANCE_SYM] = {
      dragDropManager: createDragDropManager(backend, context, options, debugMode)
    };
  }
  return ctx[INSTANCE_SYM];
}
function getGlobalContext() {
  return typeof global !== "undefined" ? global : window;
}

// node_modules/react-dnd/dist/esm/core/DragPreviewImage.js
var import_react10 = __toESM(require_react());
var DragPreviewImage = (0, import_react10.memo)(function DragPreviewImage2(_ref) {
  var connect = _ref.connect, src = _ref.src;
  (0, import_react10.useEffect)(function() {
    if (typeof Image === "undefined") return;
    var connected = false;
    var img = new Image();
    img.src = src;
    img.onload = function() {
      connect(img);
      connected = true;
    };
    return function() {
      if (connected) {
        connect(null);
      }
    };
  });
  return null;
});

// node_modules/react-dnd/dist/esm/internals/DragSourceMonitorImpl.js
function _classCallCheck4(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties4(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass4(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties4(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties4(Constructor, staticProps);
  return Constructor;
}
function _defineProperty9(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var isCallingCanDrag = false;
var isCallingIsDragging = false;
var DragSourceMonitorImpl = function() {
  function DragSourceMonitorImpl2(manager) {
    _classCallCheck4(this, DragSourceMonitorImpl2);
    _defineProperty9(this, "internalMonitor", void 0);
    _defineProperty9(this, "sourceId", null);
    this.internalMonitor = manager.getMonitor();
  }
  _createClass4(DragSourceMonitorImpl2, [{
    key: "receiveHandlerId",
    value: function receiveHandlerId(sourceId) {
      this.sourceId = sourceId;
    }
  }, {
    key: "getHandlerId",
    value: function getHandlerId() {
      return this.sourceId;
    }
  }, {
    key: "canDrag",
    value: function canDrag() {
      invariant(!isCallingCanDrag, "You may not call monitor.canDrag() inside your canDrag() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");
      try {
        isCallingCanDrag = true;
        return this.internalMonitor.canDragSource(this.sourceId);
      } finally {
        isCallingCanDrag = false;
      }
    }
  }, {
    key: "isDragging",
    value: function isDragging() {
      if (!this.sourceId) {
        return false;
      }
      invariant(!isCallingIsDragging, "You may not call monitor.isDragging() inside your isDragging() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");
      try {
        isCallingIsDragging = true;
        return this.internalMonitor.isDraggingSource(this.sourceId);
      } finally {
        isCallingIsDragging = false;
      }
    }
  }, {
    key: "subscribeToStateChange",
    value: function subscribeToStateChange(listener, options) {
      return this.internalMonitor.subscribeToStateChange(listener, options);
    }
  }, {
    key: "isDraggingSource",
    value: function isDraggingSource(sourceId) {
      return this.internalMonitor.isDraggingSource(sourceId);
    }
  }, {
    key: "isOverTarget",
    value: function isOverTarget(targetId, options) {
      return this.internalMonitor.isOverTarget(targetId, options);
    }
  }, {
    key: "getTargetIds",
    value: function getTargetIds() {
      return this.internalMonitor.getTargetIds();
    }
  }, {
    key: "isSourcePublic",
    value: function isSourcePublic() {
      return this.internalMonitor.isSourcePublic();
    }
  }, {
    key: "getSourceId",
    value: function getSourceId() {
      return this.internalMonitor.getSourceId();
    }
  }, {
    key: "subscribeToOffsetChange",
    value: function subscribeToOffsetChange(listener) {
      return this.internalMonitor.subscribeToOffsetChange(listener);
    }
  }, {
    key: "canDragSource",
    value: function canDragSource(sourceId) {
      return this.internalMonitor.canDragSource(sourceId);
    }
  }, {
    key: "canDropOnTarget",
    value: function canDropOnTarget(targetId) {
      return this.internalMonitor.canDropOnTarget(targetId);
    }
  }, {
    key: "getItemType",
    value: function getItemType() {
      return this.internalMonitor.getItemType();
    }
  }, {
    key: "getItem",
    value: function getItem() {
      return this.internalMonitor.getItem();
    }
  }, {
    key: "getDropResult",
    value: function getDropResult() {
      return this.internalMonitor.getDropResult();
    }
  }, {
    key: "didDrop",
    value: function didDrop() {
      return this.internalMonitor.didDrop();
    }
  }, {
    key: "getInitialClientOffset",
    value: function getInitialClientOffset() {
      return this.internalMonitor.getInitialClientOffset();
    }
  }, {
    key: "getInitialSourceClientOffset",
    value: function getInitialSourceClientOffset() {
      return this.internalMonitor.getInitialSourceClientOffset();
    }
  }, {
    key: "getSourceClientOffset",
    value: function getSourceClientOffset2() {
      return this.internalMonitor.getSourceClientOffset();
    }
  }, {
    key: "getClientOffset",
    value: function getClientOffset() {
      return this.internalMonitor.getClientOffset();
    }
  }, {
    key: "getDifferenceFromInitialOffset",
    value: function getDifferenceFromInitialOffset2() {
      return this.internalMonitor.getDifferenceFromInitialOffset();
    }
  }]);
  return DragSourceMonitorImpl2;
}();

// node_modules/react-dnd/dist/esm/internals/DropTargetMonitorImpl.js
function _classCallCheck5(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties5(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass5(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties5(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties5(Constructor, staticProps);
  return Constructor;
}
function _defineProperty10(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var isCallingCanDrop = false;
var DropTargetMonitorImpl = function() {
  function DropTargetMonitorImpl2(manager) {
    _classCallCheck5(this, DropTargetMonitorImpl2);
    _defineProperty10(this, "internalMonitor", void 0);
    _defineProperty10(this, "targetId", null);
    this.internalMonitor = manager.getMonitor();
  }
  _createClass5(DropTargetMonitorImpl2, [{
    key: "receiveHandlerId",
    value: function receiveHandlerId(targetId) {
      this.targetId = targetId;
    }
  }, {
    key: "getHandlerId",
    value: function getHandlerId() {
      return this.targetId;
    }
  }, {
    key: "subscribeToStateChange",
    value: function subscribeToStateChange(listener, options) {
      return this.internalMonitor.subscribeToStateChange(listener, options);
    }
  }, {
    key: "canDrop",
    value: function canDrop() {
      if (!this.targetId) {
        return false;
      }
      invariant(!isCallingCanDrop, "You may not call monitor.canDrop() inside your canDrop() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor");
      try {
        isCallingCanDrop = true;
        return this.internalMonitor.canDropOnTarget(this.targetId);
      } finally {
        isCallingCanDrop = false;
      }
    }
  }, {
    key: "isOver",
    value: function isOver(options) {
      if (!this.targetId) {
        return false;
      }
      return this.internalMonitor.isOverTarget(this.targetId, options);
    }
  }, {
    key: "getItemType",
    value: function getItemType() {
      return this.internalMonitor.getItemType();
    }
  }, {
    key: "getItem",
    value: function getItem() {
      return this.internalMonitor.getItem();
    }
  }, {
    key: "getDropResult",
    value: function getDropResult() {
      return this.internalMonitor.getDropResult();
    }
  }, {
    key: "didDrop",
    value: function didDrop() {
      return this.internalMonitor.didDrop();
    }
  }, {
    key: "getInitialClientOffset",
    value: function getInitialClientOffset() {
      return this.internalMonitor.getInitialClientOffset();
    }
  }, {
    key: "getInitialSourceClientOffset",
    value: function getInitialSourceClientOffset() {
      return this.internalMonitor.getInitialSourceClientOffset();
    }
  }, {
    key: "getSourceClientOffset",
    value: function getSourceClientOffset2() {
      return this.internalMonitor.getSourceClientOffset();
    }
  }, {
    key: "getClientOffset",
    value: function getClientOffset() {
      return this.internalMonitor.getClientOffset();
    }
  }, {
    key: "getDifferenceFromInitialOffset",
    value: function getDifferenceFromInitialOffset2() {
      return this.internalMonitor.getDifferenceFromInitialOffset();
    }
  }]);
  return DropTargetMonitorImpl2;
}();

// node_modules/react-dnd/dist/esm/internals/wrapConnectorHooks.js
var import_react11 = __toESM(require_react());
function throwIfCompositeComponentElement(element) {
  if (typeof element.type === "string") {
    return;
  }
  var displayName = element.type.displayName || element.type.name || "the component";
  throw new Error("Only native element nodes can now be passed to React DnD connectors." + "You can either wrap ".concat(displayName, " into a <div>, or turn it into a ") + "drag source or a drop target itself.");
}
function wrapHookToRecognizeElement(hook) {
  return function() {
    var elementOrNode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (!(0, import_react11.isValidElement)(elementOrNode)) {
      var node = elementOrNode;
      hook(node, options);
      return node;
    }
    var element = elementOrNode;
    throwIfCompositeComponentElement(element);
    var ref = options ? function(node2) {
      return hook(node2, options);
    } : hook;
    return cloneWithRef(element, ref);
  };
}
function wrapConnectorHooks(hooks) {
  var wrappedHooks = {};
  Object.keys(hooks).forEach(function(key) {
    var hook = hooks[key];
    if (key.endsWith("Ref")) {
      wrappedHooks[key] = hooks[key];
    } else {
      var wrappedHook = wrapHookToRecognizeElement(hook);
      wrappedHooks[key] = function() {
        return wrappedHook;
      };
    }
  });
  return wrappedHooks;
}
function setRef(ref, node) {
  if (typeof ref === "function") {
    ref(node);
  } else {
    ref.current = node;
  }
}
function cloneWithRef(element, newRef) {
  var previousRef = element.ref;
  invariant(typeof previousRef !== "string", "Cannot connect React DnD to an element with an existing string ref. Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. Read more: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs");
  if (!previousRef) {
    return (0, import_react11.cloneElement)(element, {
      ref: newRef
    });
  } else {
    return (0, import_react11.cloneElement)(element, {
      ref: function ref(node) {
        setRef(previousRef, node);
        setRef(newRef, node);
      }
    });
  }
}

// node_modules/react-dnd/dist/esm/internals/isRef.js
function _typeof4(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof4 = function _typeof7(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof4 = function _typeof7(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof4(obj);
}
function isRef(obj) {
  return (
    // eslint-disable-next-line no-prototype-builtins
    obj !== null && _typeof4(obj) === "object" && Object.prototype.hasOwnProperty.call(obj, "current")
  );
}

// node_modules/@react-dnd/shallowequal/dist/shallowequal.esm.js
function shallowEqual(objA, objB, compare, compareContext) {
  var compareResult = compare ? compare.call(compareContext, objA, objB) : void 0;
  if (compareResult !== void 0) {
    return !!compareResult;
  }
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];
    if (!bHasOwnProperty(key)) {
      return false;
    }
    var valueA = objA[key];
    var valueB = objB[key];
    compareResult = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
    if (compareResult === false || compareResult === void 0 && valueA !== valueB) {
      return false;
    }
  }
  return true;
}

// node_modules/react-dnd/dist/esm/internals/SourceConnector.js
function _classCallCheck6(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties6(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass6(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties6(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties6(Constructor, staticProps);
  return Constructor;
}
function _defineProperty11(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var SourceConnector = function() {
  function SourceConnector2(backend) {
    var _this = this;
    _classCallCheck6(this, SourceConnector2);
    _defineProperty11(this, "hooks", wrapConnectorHooks({
      dragSource: function dragSource(node, options) {
        _this.clearDragSource();
        _this.dragSourceOptions = options || null;
        if (isRef(node)) {
          _this.dragSourceRef = node;
        } else {
          _this.dragSourceNode = node;
        }
        _this.reconnectDragSource();
      },
      dragPreview: function dragPreview(node, options) {
        _this.clearDragPreview();
        _this.dragPreviewOptions = options || null;
        if (isRef(node)) {
          _this.dragPreviewRef = node;
        } else {
          _this.dragPreviewNode = node;
        }
        _this.reconnectDragPreview();
      }
    }));
    _defineProperty11(this, "handlerId", null);
    _defineProperty11(this, "dragSourceRef", null);
    _defineProperty11(this, "dragSourceNode", void 0);
    _defineProperty11(this, "dragSourceOptionsInternal", null);
    _defineProperty11(this, "dragSourceUnsubscribe", void 0);
    _defineProperty11(this, "dragPreviewRef", null);
    _defineProperty11(this, "dragPreviewNode", void 0);
    _defineProperty11(this, "dragPreviewOptionsInternal", null);
    _defineProperty11(this, "dragPreviewUnsubscribe", void 0);
    _defineProperty11(this, "lastConnectedHandlerId", null);
    _defineProperty11(this, "lastConnectedDragSource", null);
    _defineProperty11(this, "lastConnectedDragSourceOptions", null);
    _defineProperty11(this, "lastConnectedDragPreview", null);
    _defineProperty11(this, "lastConnectedDragPreviewOptions", null);
    _defineProperty11(this, "backend", void 0);
    this.backend = backend;
  }
  _createClass6(SourceConnector2, [{
    key: "receiveHandlerId",
    value: function receiveHandlerId(newHandlerId) {
      if (this.handlerId === newHandlerId) {
        return;
      }
      this.handlerId = newHandlerId;
      this.reconnect();
    }
  }, {
    key: "connectTarget",
    get: function get2() {
      return this.dragSource;
    }
  }, {
    key: "dragSourceOptions",
    get: function get2() {
      return this.dragSourceOptionsInternal;
    },
    set: function set(options) {
      this.dragSourceOptionsInternal = options;
    }
  }, {
    key: "dragPreviewOptions",
    get: function get2() {
      return this.dragPreviewOptionsInternal;
    },
    set: function set(options) {
      this.dragPreviewOptionsInternal = options;
    }
  }, {
    key: "reconnect",
    value: function reconnect() {
      this.reconnectDragSource();
      this.reconnectDragPreview();
    }
  }, {
    key: "reconnectDragSource",
    value: function reconnectDragSource() {
      var dragSource = this.dragSource;
      var didChange = this.didHandlerIdChange() || this.didConnectedDragSourceChange() || this.didDragSourceOptionsChange();
      if (didChange) {
        this.disconnectDragSource();
      }
      if (!this.handlerId) {
        return;
      }
      if (!dragSource) {
        this.lastConnectedDragSource = dragSource;
        return;
      }
      if (didChange) {
        this.lastConnectedHandlerId = this.handlerId;
        this.lastConnectedDragSource = dragSource;
        this.lastConnectedDragSourceOptions = this.dragSourceOptions;
        this.dragSourceUnsubscribe = this.backend.connectDragSource(this.handlerId, dragSource, this.dragSourceOptions);
      }
    }
  }, {
    key: "reconnectDragPreview",
    value: function reconnectDragPreview() {
      var dragPreview = this.dragPreview;
      var didChange = this.didHandlerIdChange() || this.didConnectedDragPreviewChange() || this.didDragPreviewOptionsChange();
      if (didChange) {
        this.disconnectDragPreview();
      }
      if (!this.handlerId) {
        return;
      }
      if (!dragPreview) {
        this.lastConnectedDragPreview = dragPreview;
        return;
      }
      if (didChange) {
        this.lastConnectedHandlerId = this.handlerId;
        this.lastConnectedDragPreview = dragPreview;
        this.lastConnectedDragPreviewOptions = this.dragPreviewOptions;
        this.dragPreviewUnsubscribe = this.backend.connectDragPreview(this.handlerId, dragPreview, this.dragPreviewOptions);
      }
    }
  }, {
    key: "didHandlerIdChange",
    value: function didHandlerIdChange() {
      return this.lastConnectedHandlerId !== this.handlerId;
    }
  }, {
    key: "didConnectedDragSourceChange",
    value: function didConnectedDragSourceChange() {
      return this.lastConnectedDragSource !== this.dragSource;
    }
  }, {
    key: "didConnectedDragPreviewChange",
    value: function didConnectedDragPreviewChange() {
      return this.lastConnectedDragPreview !== this.dragPreview;
    }
  }, {
    key: "didDragSourceOptionsChange",
    value: function didDragSourceOptionsChange() {
      return !shallowEqual(this.lastConnectedDragSourceOptions, this.dragSourceOptions);
    }
  }, {
    key: "didDragPreviewOptionsChange",
    value: function didDragPreviewOptionsChange() {
      return !shallowEqual(this.lastConnectedDragPreviewOptions, this.dragPreviewOptions);
    }
  }, {
    key: "disconnectDragSource",
    value: function disconnectDragSource() {
      if (this.dragSourceUnsubscribe) {
        this.dragSourceUnsubscribe();
        this.dragSourceUnsubscribe = void 0;
      }
    }
  }, {
    key: "disconnectDragPreview",
    value: function disconnectDragPreview() {
      if (this.dragPreviewUnsubscribe) {
        this.dragPreviewUnsubscribe();
        this.dragPreviewUnsubscribe = void 0;
        this.dragPreviewNode = null;
        this.dragPreviewRef = null;
      }
    }
  }, {
    key: "dragSource",
    get: function get2() {
      return this.dragSourceNode || this.dragSourceRef && this.dragSourceRef.current;
    }
  }, {
    key: "dragPreview",
    get: function get2() {
      return this.dragPreviewNode || this.dragPreviewRef && this.dragPreviewRef.current;
    }
  }, {
    key: "clearDragSource",
    value: function clearDragSource() {
      this.dragSourceNode = null;
      this.dragSourceRef = null;
    }
  }, {
    key: "clearDragPreview",
    value: function clearDragPreview() {
      this.dragPreviewNode = null;
      this.dragPreviewRef = null;
    }
  }]);
  return SourceConnector2;
}();

// node_modules/react-dnd/dist/esm/internals/TargetConnector.js
function _classCallCheck7(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties7(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass7(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties7(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties7(Constructor, staticProps);
  return Constructor;
}
function _defineProperty12(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var TargetConnector = function() {
  function TargetConnector2(backend) {
    var _this = this;
    _classCallCheck7(this, TargetConnector2);
    _defineProperty12(this, "hooks", wrapConnectorHooks({
      dropTarget: function dropTarget(node, options) {
        _this.clearDropTarget();
        _this.dropTargetOptions = options;
        if (isRef(node)) {
          _this.dropTargetRef = node;
        } else {
          _this.dropTargetNode = node;
        }
        _this.reconnect();
      }
    }));
    _defineProperty12(this, "handlerId", null);
    _defineProperty12(this, "dropTargetRef", null);
    _defineProperty12(this, "dropTargetNode", void 0);
    _defineProperty12(this, "dropTargetOptionsInternal", null);
    _defineProperty12(this, "unsubscribeDropTarget", void 0);
    _defineProperty12(this, "lastConnectedHandlerId", null);
    _defineProperty12(this, "lastConnectedDropTarget", null);
    _defineProperty12(this, "lastConnectedDropTargetOptions", null);
    _defineProperty12(this, "backend", void 0);
    this.backend = backend;
  }
  _createClass7(TargetConnector2, [{
    key: "connectTarget",
    get: function get2() {
      return this.dropTarget;
    }
  }, {
    key: "reconnect",
    value: function reconnect() {
      var didChange = this.didHandlerIdChange() || this.didDropTargetChange() || this.didOptionsChange();
      if (didChange) {
        this.disconnectDropTarget();
      }
      var dropTarget = this.dropTarget;
      if (!this.handlerId) {
        return;
      }
      if (!dropTarget) {
        this.lastConnectedDropTarget = dropTarget;
        return;
      }
      if (didChange) {
        this.lastConnectedHandlerId = this.handlerId;
        this.lastConnectedDropTarget = dropTarget;
        this.lastConnectedDropTargetOptions = this.dropTargetOptions;
        this.unsubscribeDropTarget = this.backend.connectDropTarget(this.handlerId, dropTarget, this.dropTargetOptions);
      }
    }
  }, {
    key: "receiveHandlerId",
    value: function receiveHandlerId(newHandlerId) {
      if (newHandlerId === this.handlerId) {
        return;
      }
      this.handlerId = newHandlerId;
      this.reconnect();
    }
  }, {
    key: "dropTargetOptions",
    get: function get2() {
      return this.dropTargetOptionsInternal;
    },
    set: function set(options) {
      this.dropTargetOptionsInternal = options;
    }
  }, {
    key: "didHandlerIdChange",
    value: function didHandlerIdChange() {
      return this.lastConnectedHandlerId !== this.handlerId;
    }
  }, {
    key: "didDropTargetChange",
    value: function didDropTargetChange() {
      return this.lastConnectedDropTarget !== this.dropTarget;
    }
  }, {
    key: "didOptionsChange",
    value: function didOptionsChange() {
      return !shallowEqual(this.lastConnectedDropTargetOptions, this.dropTargetOptions);
    }
  }, {
    key: "disconnectDropTarget",
    value: function disconnectDropTarget() {
      if (this.unsubscribeDropTarget) {
        this.unsubscribeDropTarget();
        this.unsubscribeDropTarget = void 0;
      }
    }
  }, {
    key: "dropTarget",
    get: function get2() {
      return this.dropTargetNode || this.dropTargetRef && this.dropTargetRef.current;
    }
  }, {
    key: "clearDropTarget",
    value: function clearDropTarget() {
      this.dropTargetRef = null;
      this.dropTargetNode = null;
    }
  }]);
  return TargetConnector2;
}();

// node_modules/react-dnd/dist/esm/internals/registration.js
function registerTarget(type, target, manager) {
  var registry = manager.getRegistry();
  var targetId = registry.addTarget(type, target);
  return [targetId, function() {
    return registry.removeTarget(targetId);
  }];
}
function registerSource(type, source, manager) {
  var registry = manager.getRegistry();
  var sourceId = registry.addSource(type, source);
  return [sourceId, function() {
    return registry.removeSource(sourceId);
  }];
}

// node_modules/react-dnd/dist/esm/decorators/utils.js
function _typeof5(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof5 = function _typeof7(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof5 = function _typeof7(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof5(obj);
}
function getDecoratedComponent(instanceRef) {
  var currentRef = instanceRef.current;
  if (currentRef == null) {
    return null;
  } else if (currentRef.decoratedRef) {
    return currentRef.decoratedRef.current;
  } else {
    return currentRef;
  }
}
function isFunction(input) {
  return typeof input === "function";
}
function noop2() {
}
function isObjectLike(input) {
  return _typeof5(input) === "object" && input !== null;
}
function isPlainObject2(input) {
  if (!isObjectLike(input)) {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  var proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
}

// node_modules/react-dnd/dist/esm/decorators/decorateHandler.js
var import_jsx_runtime9 = __toESM(require_jsx_runtime());
var import_react12 = __toESM(require_react());

// node_modules/react-dnd/dist/esm/decorators/disposables.js
function _classCallCheck8(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties8(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass8(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties8(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties8(Constructor, staticProps);
  return Constructor;
}
function _defineProperty13(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var Disposable = function() {
  function Disposable2(action) {
    _classCallCheck8(this, Disposable2);
    _defineProperty13(this, "isDisposed", false);
    _defineProperty13(this, "action", void 0);
    this.action = isFunction(action) ? action : noop2;
  }
  _createClass8(Disposable2, [{
    key: "dispose",
    value: function dispose() {
      if (!this.isDisposed) {
        this.action();
        this.isDisposed = true;
      }
    }
  }], [{
    key: "isDisposable",
    value: (
      /**
       * Gets the disposable that does nothing when disposed.
       */
      /**
       * Validates whether the given object is a disposable
       * @param {Object} Object to test whether it has a dispose method
       * @returns {Boolean} true if a disposable object, else false.
       */
      function isDisposable(d) {
        return Boolean(d && isFunction(d.dispose));
      }
    )
  }, {
    key: "_fixup",
    value: function _fixup(result) {
      return Disposable2.isDisposable(result) ? result : Disposable2.empty;
    }
    /**
     * Creates a disposable object that invokes the specified action when disposed.
     * @param {Function} dispose Action to run during the first call to dispose.
     * The action is guaranteed to be run at most once.
     * @return {Disposable} The disposable object that runs the given action upon disposal.
     */
  }, {
    key: "create",
    value: function create(action) {
      return new Disposable2(action);
    }
  }]);
  return Disposable2;
}();
_defineProperty13(Disposable, "empty", {
  dispose: noop2
});
var CompositeDisposable = function() {
  function CompositeDisposable2() {
    _classCallCheck8(this, CompositeDisposable2);
    _defineProperty13(this, "isDisposed", false);
    _defineProperty13(this, "disposables", void 0);
    for (var _len = arguments.length, disposables = new Array(_len), _key = 0; _key < _len; _key++) {
      disposables[_key] = arguments[_key];
    }
    this.disposables = disposables;
  }
  _createClass8(CompositeDisposable2, [{
    key: "add",
    value: function add2(item) {
      if (this.isDisposed) {
        item.dispose();
      } else {
        this.disposables.push(item);
      }
    }
    /**
     * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
     * @param {Any} item Disposable to remove.
     * @returns {Boolean} true if found; false otherwise.
     */
  }, {
    key: "remove",
    value: function remove(item) {
      var shouldDispose = false;
      if (!this.isDisposed) {
        var idx = this.disposables.indexOf(item);
        if (idx !== -1) {
          shouldDispose = true;
          this.disposables.splice(idx, 1);
          item.dispose();
        }
      }
      return shouldDispose;
    }
    /**
     *  Disposes all disposables in the group and removes them from the group but
     *  does not dispose the CompositeDisposable.
     */
  }, {
    key: "clear",
    value: function clear() {
      if (!this.isDisposed) {
        var len = this.disposables.length;
        var currentDisposables = new Array(len);
        for (var i = 0; i < len; i++) {
          currentDisposables[i] = this.disposables[i];
        }
        this.disposables = [];
        for (var _i = 0; _i < len; _i++) {
          currentDisposables[_i].dispose();
        }
      }
    }
    /**
     *  Disposes all disposables in the group and removes them from the group.
     */
  }, {
    key: "dispose",
    value: function dispose() {
      if (!this.isDisposed) {
        this.isDisposed = true;
        var len = this.disposables.length;
        var currentDisposables = new Array(len);
        for (var i = 0; i < len; i++) {
          currentDisposables[i] = this.disposables[i];
        }
        this.disposables = [];
        for (var _i2 = 0; _i2 < len; _i2++) {
          currentDisposables[_i2].dispose();
        }
      }
    }
  }]);
  return CompositeDisposable2;
}();
var SerialDisposable = function() {
  function SerialDisposable2() {
    _classCallCheck8(this, SerialDisposable2);
    _defineProperty13(this, "isDisposed", false);
    _defineProperty13(this, "current", void 0);
  }
  _createClass8(SerialDisposable2, [{
    key: "getDisposable",
    value: (
      /**
       * Gets the underlying disposable.
       * @returns {Any} the underlying disposable.
       */
      function getDisposable() {
        return this.current;
      }
    )
  }, {
    key: "setDisposable",
    value: function setDisposable(value) {
      var shouldDispose = this.isDisposed;
      if (!shouldDispose) {
        var old = this.current;
        this.current = value;
        if (old) {
          old.dispose();
        }
      }
      if (shouldDispose && value) {
        value.dispose();
      }
    }
    /** Performs the task of cleaning up resources. */
  }, {
    key: "dispose",
    value: function dispose() {
      if (!this.isDisposed) {
        this.isDisposed = true;
        var old = this.current;
        this.current = void 0;
        if (old) {
          old.dispose();
        }
      }
    }
  }]);
  return SerialDisposable2;
}();

// node_modules/react-dnd/dist/esm/decorators/decorateHandler.js
var import_hoist_non_react_statics = __toESM(require_hoist_non_react_statics_cjs());

// node_modules/react-dnd/dist/esm/decorators/createSourceFactory.js
function _classCallCheck9(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties9(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass9(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties9(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties9(Constructor, staticProps);
  return Constructor;
}
function _defineProperty14(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var SourceImpl = function() {
  function SourceImpl2(spec, monitor, ref) {
    var _this = this;
    _classCallCheck9(this, SourceImpl2);
    _defineProperty14(this, "props", null);
    _defineProperty14(this, "spec", void 0);
    _defineProperty14(this, "monitor", void 0);
    _defineProperty14(this, "ref", void 0);
    _defineProperty14(this, "beginDrag", function() {
      if (!_this.props) {
        return;
      }
      var item = _this.spec.beginDrag(_this.props, _this.monitor, _this.ref.current);
      if (true) {
        invariant(isPlainObject2(item), "beginDrag() must return a plain object that represents the dragged item. Instead received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source", item);
      }
      return item;
    });
    this.spec = spec;
    this.monitor = monitor;
    this.ref = ref;
  }
  _createClass9(SourceImpl2, [{
    key: "receiveProps",
    value: function receiveProps(props) {
      this.props = props;
    }
  }, {
    key: "canDrag",
    value: function canDrag() {
      if (!this.props) {
        return false;
      }
      if (!this.spec.canDrag) {
        return true;
      }
      return this.spec.canDrag(this.props, this.monitor);
    }
  }, {
    key: "isDragging",
    value: function isDragging(globalMonitor, sourceId) {
      if (!this.props) {
        return false;
      }
      if (!this.spec.isDragging) {
        return sourceId === globalMonitor.getSourceId();
      }
      return this.spec.isDragging(this.props, this.monitor);
    }
  }, {
    key: "endDrag",
    value: function endDrag() {
      if (!this.props) {
        return;
      }
      if (!this.spec.endDrag) {
        return;
      }
      this.spec.endDrag(this.props, this.monitor, getDecoratedComponent(this.ref));
    }
  }]);
  return SourceImpl2;
}();

// node_modules/react-dnd/dist/esm/decorators/createTargetFactory.js
function _classCallCheck10(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties10(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass10(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties10(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties10(Constructor, staticProps);
  return Constructor;
}
function _defineProperty15(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var TargetImpl = function() {
  function TargetImpl2(spec, monitor, ref) {
    _classCallCheck10(this, TargetImpl2);
    _defineProperty15(this, "props", null);
    _defineProperty15(this, "spec", void 0);
    _defineProperty15(this, "monitor", void 0);
    _defineProperty15(this, "ref", void 0);
    this.spec = spec;
    this.monitor = monitor;
    this.ref = ref;
  }
  _createClass10(TargetImpl2, [{
    key: "receiveProps",
    value: function receiveProps(props) {
      this.props = props;
    }
  }, {
    key: "receiveMonitor",
    value: function receiveMonitor(monitor) {
      this.monitor = monitor;
    }
  }, {
    key: "canDrop",
    value: function canDrop() {
      if (!this.spec.canDrop) {
        return true;
      }
      return this.spec.canDrop(this.props, this.monitor);
    }
  }, {
    key: "hover",
    value: function hover() {
      if (!this.spec.hover || !this.props) {
        return;
      }
      this.spec.hover(this.props, this.monitor, getDecoratedComponent(this.ref));
    }
  }, {
    key: "drop",
    value: function drop() {
      if (!this.spec.drop) {
        return void 0;
      }
      var dropResult = this.spec.drop(this.props, this.monitor, this.ref.current);
      if (true) {
        invariant(typeof dropResult === "undefined" || isPlainObject2(dropResult), "drop() must either return undefined, or an object that represents the drop result. Instead received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target", dropResult);
      }
      return dropResult;
    }
  }]);
  return TargetImpl2;
}();

// node_modules/react-dnd/dist/esm/decorators/DragLayer.js
var import_jsx_runtime10 = __toESM(require_jsx_runtime());
var import_react13 = __toESM(require_react());
var import_hoist_non_react_statics2 = __toESM(require_hoist_non_react_statics_cjs());

// node_modules/react-dnd/dist/esm/hooks/useIsomorphicLayoutEffect.js
var import_react14 = __toESM(require_react());
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react14.useLayoutEffect : import_react14.useEffect;

// node_modules/react-dnd/dist/esm/hooks/useDrag/useDragSource.js
var import_react15 = __toESM(require_react());

// node_modules/react-dnd/dist/esm/hooks/useDrag/DragSourceImpl.js
function _typeof6(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof6 = function _typeof7(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof6 = function _typeof7(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof6(obj);
}
function _classCallCheck11(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties11(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass11(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties11(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties11(Constructor, staticProps);
  return Constructor;
}
function _defineProperty16(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var DragSourceImpl = function() {
  function DragSourceImpl2(spec, monitor, connector) {
    _classCallCheck11(this, DragSourceImpl2);
    _defineProperty16(this, "spec", void 0);
    _defineProperty16(this, "monitor", void 0);
    _defineProperty16(this, "connector", void 0);
    this.spec = spec;
    this.monitor = monitor;
    this.connector = connector;
  }
  _createClass11(DragSourceImpl2, [{
    key: "beginDrag",
    value: function beginDrag() {
      var _result;
      var spec = this.spec;
      var monitor = this.monitor;
      var result = null;
      if (_typeof6(spec.item) === "object") {
        result = spec.item;
      } else if (typeof spec.item === "function") {
        result = spec.item(monitor);
      } else {
        result = {};
      }
      return (_result = result) !== null && _result !== void 0 ? _result : null;
    }
  }, {
    key: "canDrag",
    value: function canDrag() {
      var spec = this.spec;
      var monitor = this.monitor;
      if (typeof spec.canDrag === "boolean") {
        return spec.canDrag;
      } else if (typeof spec.canDrag === "function") {
        return spec.canDrag(monitor);
      } else {
        return true;
      }
    }
  }, {
    key: "isDragging",
    value: function isDragging(globalMonitor, target) {
      var spec = this.spec;
      var monitor = this.monitor;
      var isDragging2 = spec.isDragging;
      return isDragging2 ? isDragging2(monitor) : target === globalMonitor.getSourceId();
    }
  }, {
    key: "endDrag",
    value: function endDrag() {
      var spec = this.spec;
      var monitor = this.monitor;
      var connector = this.connector;
      var end = spec.end;
      if (end) {
        end(monitor.getItem(), monitor);
      }
      connector.reconnect();
    }
  }]);
  return DragSourceImpl2;
}();

// node_modules/react-dnd/dist/esm/hooks/useDrag/useDragSource.js
function useDragSource(spec, monitor, connector) {
  var handler = (0, import_react15.useMemo)(function() {
    return new DragSourceImpl(spec, monitor, connector);
  }, [monitor, connector]);
  (0, import_react15.useEffect)(function() {
    handler.spec = spec;
  }, [spec]);
  return handler;
}

// node_modules/react-dnd/dist/esm/hooks/useDragDropManager.js
var import_react16 = __toESM(require_react());
function useDragDropManager() {
  var _useContext = (0, import_react16.useContext)(DndContext2), dragDropManager = _useContext.dragDropManager;
  invariant(dragDropManager != null, "Expected drag drop context");
  return dragDropManager;
}

// node_modules/react-dnd/dist/esm/hooks/useDrag/useDragType.js
var import_react17 = __toESM(require_react());
function useDragType(spec) {
  return (0, import_react17.useMemo)(function() {
    var result = spec.type;
    invariant(result != null, "spec.type must be defined");
    return result;
  }, [spec]);
}

// node_modules/react-dnd/dist/esm/hooks/useDrag/useRegisteredDragSource.js
function _slicedToArray3(arr, i) {
  return _arrayWithHoles3(arr) || _iterableToArrayLimit3(arr, i) || _unsupportedIterableToArray3(arr, i) || _nonIterableRest3();
}
function _nonIterableRest3() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray3(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray3(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray3(o, minLen);
}
function _arrayLikeToArray3(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit3(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles3(arr) {
  if (Array.isArray(arr)) return arr;
}
function useRegisteredDragSource(spec, monitor, connector) {
  var manager = useDragDropManager();
  var handler = useDragSource(spec, monitor, connector);
  var itemType = useDragType(spec);
  useIsomorphicLayoutEffect(function registerDragSource() {
    if (itemType != null) {
      var _registerSource = registerSource(itemType, handler, manager), _registerSource2 = _slicedToArray3(_registerSource, 2), handlerId = _registerSource2[0], unregister = _registerSource2[1];
      monitor.receiveHandlerId(handlerId);
      connector.receiveHandlerId(handlerId);
      return unregister;
    }
  }, [manager, monitor, connector, handler, itemType]);
}

// node_modules/react-dnd/dist/esm/hooks/useOptionalFactory.js
var import_react18 = __toESM(require_react());
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray4(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray4(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray4(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray4(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray4(arr);
}
function _arrayLikeToArray4(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function useOptionalFactory(arg, deps) {
  var memoDeps = _toConsumableArray(deps || []);
  if (deps == null && typeof arg !== "function") {
    memoDeps.push(arg);
  }
  return (0, import_react18.useMemo)(function() {
    return typeof arg === "function" ? arg() : arg;
  }, memoDeps);
}

// node_modules/react-dnd/dist/esm/hooks/useDrag/useDragSourceMonitor.js
var import_react19 = __toESM(require_react());
function useDragSourceMonitor() {
  var manager = useDragDropManager();
  return (0, import_react19.useMemo)(function() {
    return new DragSourceMonitorImpl(manager);
  }, [manager]);
}

// node_modules/react-dnd/dist/esm/hooks/useDrag/useDragSourceConnector.js
var import_react20 = __toESM(require_react());
function useDragSourceConnector(dragSourceOptions, dragPreviewOptions) {
  var manager = useDragDropManager();
  var connector = (0, import_react20.useMemo)(function() {
    return new SourceConnector(manager.getBackend());
  }, [manager]);
  useIsomorphicLayoutEffect(function() {
    connector.dragSourceOptions = dragSourceOptions || null;
    connector.reconnect();
    return function() {
      return connector.disconnectDragSource();
    };
  }, [connector, dragSourceOptions]);
  useIsomorphicLayoutEffect(function() {
    connector.dragPreviewOptions = dragPreviewOptions || null;
    connector.reconnect();
    return function() {
      return connector.disconnectDragPreview();
    };
  }, [connector, dragPreviewOptions]);
  return connector;
}

// node_modules/react-dnd/dist/esm/hooks/useCollector.js
var import_fast_deep_equal = __toESM(require_fast_deep_equal());
var import_react21 = __toESM(require_react());
function _slicedToArray4(arr, i) {
  return _arrayWithHoles4(arr) || _iterableToArrayLimit4(arr, i) || _unsupportedIterableToArray5(arr, i) || _nonIterableRest4();
}
function _nonIterableRest4() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray5(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray5(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray5(o, minLen);
}
function _arrayLikeToArray5(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit4(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles4(arr) {
  if (Array.isArray(arr)) return arr;
}
function useCollector(monitor, collect, onUpdate) {
  var _useState = (0, import_react21.useState)(function() {
    return collect(monitor);
  }), _useState2 = _slicedToArray4(_useState, 2), collected = _useState2[0], setCollected = _useState2[1];
  var updateCollected = (0, import_react21.useCallback)(function() {
    var nextValue = collect(monitor);
    if (!(0, import_fast_deep_equal.default)(collected, nextValue)) {
      setCollected(nextValue);
      if (onUpdate) {
        onUpdate();
      }
    }
  }, [collected, monitor, onUpdate]);
  useIsomorphicLayoutEffect(updateCollected);
  return [collected, updateCollected];
}

// node_modules/react-dnd/dist/esm/hooks/useMonitorOutput.js
function _slicedToArray5(arr, i) {
  return _arrayWithHoles5(arr) || _iterableToArrayLimit5(arr, i) || _unsupportedIterableToArray6(arr, i) || _nonIterableRest5();
}
function _nonIterableRest5() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray6(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray6(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray6(o, minLen);
}
function _arrayLikeToArray6(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit5(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles5(arr) {
  if (Array.isArray(arr)) return arr;
}
function useMonitorOutput(monitor, collect, onCollect) {
  var _useCollector = useCollector(monitor, collect, onCollect), _useCollector2 = _slicedToArray5(_useCollector, 2), collected = _useCollector2[0], updateCollected = _useCollector2[1];
  useIsomorphicLayoutEffect(function subscribeToMonitorStateChange() {
    var handlerId = monitor.getHandlerId();
    if (handlerId == null) {
      return;
    }
    return monitor.subscribeToStateChange(updateCollected, {
      handlerIds: [handlerId]
    });
  }, [monitor, updateCollected]);
  return collected;
}

// node_modules/react-dnd/dist/esm/hooks/useCollectedProps.js
function useCollectedProps(collector, monitor, connector) {
  return useMonitorOutput(monitor, collector || function() {
    return {};
  }, function() {
    return connector.reconnect();
  });
}

// node_modules/react-dnd/dist/esm/hooks/useDrag/connectors.js
var import_react22 = __toESM(require_react());
function useConnectDragSource(connector) {
  return (0, import_react22.useMemo)(function() {
    return connector.hooks.dragSource();
  }, [connector]);
}
function useConnectDragPreview(connector) {
  return (0, import_react22.useMemo)(function() {
    return connector.hooks.dragPreview();
  }, [connector]);
}

// node_modules/react-dnd/dist/esm/hooks/useDrag/useDrag.js
function useDrag(specArg, deps) {
  var spec = useOptionalFactory(specArg, deps);
  invariant(!spec.begin, "useDrag::spec.begin was deprecated in v14. Replace spec.begin() with spec.item(). (see more here - https://react-dnd.github.io/react-dnd/docs/api/use-drag)");
  var monitor = useDragSourceMonitor();
  var connector = useDragSourceConnector(spec.options, spec.previewOptions);
  useRegisteredDragSource(spec, monitor, connector);
  return [useCollectedProps(spec.collect, monitor, connector), useConnectDragSource(connector), useConnectDragPreview(connector)];
}

// node_modules/react-dnd/dist/esm/hooks/useDrop/useAccept.js
var import_react23 = __toESM(require_react());
function useAccept(spec) {
  var accept = spec.accept;
  return (0, import_react23.useMemo)(function() {
    invariant(spec.accept != null, "accept must be defined");
    return Array.isArray(accept) ? accept : [accept];
  }, [accept]);
}

// node_modules/react-dnd/dist/esm/hooks/useDrop/useDropTarget.js
var import_react24 = __toESM(require_react());

// node_modules/react-dnd/dist/esm/hooks/useDrop/DropTargetImpl.js
function _classCallCheck12(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties12(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass12(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties12(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties12(Constructor, staticProps);
  return Constructor;
}
function _defineProperty17(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var DropTargetImpl = function() {
  function DropTargetImpl2(spec, monitor) {
    _classCallCheck12(this, DropTargetImpl2);
    _defineProperty17(this, "spec", void 0);
    _defineProperty17(this, "monitor", void 0);
    this.spec = spec;
    this.monitor = monitor;
  }
  _createClass12(DropTargetImpl2, [{
    key: "canDrop",
    value: function canDrop() {
      var spec = this.spec;
      var monitor = this.monitor;
      return spec.canDrop ? spec.canDrop(monitor.getItem(), monitor) : true;
    }
  }, {
    key: "hover",
    value: function hover() {
      var spec = this.spec;
      var monitor = this.monitor;
      if (spec.hover) {
        spec.hover(monitor.getItem(), monitor);
      }
    }
  }, {
    key: "drop",
    value: function drop() {
      var spec = this.spec;
      var monitor = this.monitor;
      if (spec.drop) {
        return spec.drop(monitor.getItem(), monitor);
      }
    }
  }]);
  return DropTargetImpl2;
}();

// node_modules/react-dnd/dist/esm/hooks/useDrop/useDropTarget.js
function useDropTarget(spec, monitor) {
  var dropTarget = (0, import_react24.useMemo)(function() {
    return new DropTargetImpl(spec, monitor);
  }, [monitor]);
  (0, import_react24.useEffect)(function() {
    dropTarget.spec = spec;
  }, [spec]);
  return dropTarget;
}

// node_modules/react-dnd/dist/esm/hooks/useDrop/useRegisteredDropTarget.js
function _slicedToArray6(arr, i) {
  return _arrayWithHoles6(arr) || _iterableToArrayLimit6(arr, i) || _unsupportedIterableToArray7(arr, i) || _nonIterableRest6();
}
function _nonIterableRest6() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray7(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray7(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray7(o, minLen);
}
function _arrayLikeToArray7(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit6(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles6(arr) {
  if (Array.isArray(arr)) return arr;
}
function useRegisteredDropTarget(spec, monitor, connector) {
  var manager = useDragDropManager();
  var dropTarget = useDropTarget(spec, monitor);
  var accept = useAccept(spec);
  useIsomorphicLayoutEffect(function registerDropTarget() {
    var _registerTarget = registerTarget(accept, dropTarget, manager), _registerTarget2 = _slicedToArray6(_registerTarget, 2), handlerId = _registerTarget2[0], unregister = _registerTarget2[1];
    monitor.receiveHandlerId(handlerId);
    connector.receiveHandlerId(handlerId);
    return unregister;
  }, [manager, monitor, dropTarget, connector, accept.map(function(a) {
    return a.toString();
  }).join("|")]);
}

// node_modules/react-dnd/dist/esm/hooks/useDrop/useDropTargetMonitor.js
var import_react25 = __toESM(require_react());
function useDropTargetMonitor() {
  var manager = useDragDropManager();
  return (0, import_react25.useMemo)(function() {
    return new DropTargetMonitorImpl(manager);
  }, [manager]);
}

// node_modules/react-dnd/dist/esm/hooks/useDrop/useDropTargetConnector.js
var import_react26 = __toESM(require_react());
function useDropTargetConnector(options) {
  var manager = useDragDropManager();
  var connector = (0, import_react26.useMemo)(function() {
    return new TargetConnector(manager.getBackend());
  }, [manager]);
  useIsomorphicLayoutEffect(function() {
    connector.dropTargetOptions = options || null;
    connector.reconnect();
    return function() {
      return connector.disconnectDropTarget();
    };
  }, [options]);
  return connector;
}

// node_modules/react-dnd/dist/esm/hooks/useDrop/connectors.js
var import_react27 = __toESM(require_react());
function useConnectDropTarget(connector) {
  return (0, import_react27.useMemo)(function() {
    return connector.hooks.dropTarget();
  }, [connector]);
}

// node_modules/react-dnd/dist/esm/hooks/useDrop/useDrop.js
function useDrop(specArg, deps) {
  var spec = useOptionalFactory(specArg, deps);
  var monitor = useDropTargetMonitor();
  var connector = useDropTargetConnector(spec.options);
  useRegisteredDropTarget(spec, monitor, connector);
  return [useCollectedProps(spec.collect, monitor, connector), useConnectDropTarget(connector)];
}

// node_modules/react-dnd/dist/esm/hooks/useDragLayer.js
var import_react28 = __toESM(require_react());
function _slicedToArray7(arr, i) {
  return _arrayWithHoles7(arr) || _iterableToArrayLimit7(arr, i) || _unsupportedIterableToArray8(arr, i) || _nonIterableRest7();
}
function _nonIterableRest7() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray8(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray8(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray8(o, minLen);
}
function _arrayLikeToArray8(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit7(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles7(arr) {
  if (Array.isArray(arr)) return arr;
}
function useDragLayer(collect) {
  var dragDropManager = useDragDropManager();
  var monitor = dragDropManager.getMonitor();
  var _useCollector = useCollector(monitor, collect), _useCollector2 = _slicedToArray7(_useCollector, 2), collected = _useCollector2[0], updateCollected = _useCollector2[1];
  (0, import_react28.useEffect)(function() {
    return monitor.subscribeToOffsetChange(updateCollected);
  });
  (0, import_react28.useEffect)(function() {
    return monitor.subscribeToStateChange(updateCollected);
  });
  return collected;
}

// node_modules/react-dnd-html5-backend/dist/esm/utils/js_utils.js
function memoize(fn) {
  var result = null;
  var memoized = function memoized2() {
    if (result == null) {
      result = fn();
    }
    return result;
  };
  return memoized;
}
function without2(items2, item) {
  return items2.filter(function(i) {
    return i !== item;
  });
}
function union(itemsA, itemsB) {
  var set = /* @__PURE__ */ new Set();
  var insertItem = function insertItem2(item) {
    return set.add(item);
  };
  itemsA.forEach(insertItem);
  itemsB.forEach(insertItem);
  var result = [];
  set.forEach(function(key) {
    return result.push(key);
  });
  return result;
}

// node_modules/react-dnd-html5-backend/dist/esm/EnterLeaveCounter.js
function _classCallCheck13(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties13(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass13(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties13(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties13(Constructor, staticProps);
  return Constructor;
}
function _defineProperty18(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var EnterLeaveCounter = function() {
  function EnterLeaveCounter2(isNodeInDocument) {
    _classCallCheck13(this, EnterLeaveCounter2);
    _defineProperty18(this, "entered", []);
    _defineProperty18(this, "isNodeInDocument", void 0);
    this.isNodeInDocument = isNodeInDocument;
  }
  _createClass13(EnterLeaveCounter2, [{
    key: "enter",
    value: function enter(enteringNode) {
      var _this = this;
      var previousLength = this.entered.length;
      var isNodeEntered = function isNodeEntered2(node) {
        return _this.isNodeInDocument(node) && (!node.contains || node.contains(enteringNode));
      };
      this.entered = union(this.entered.filter(isNodeEntered), [enteringNode]);
      return previousLength === 0 && this.entered.length > 0;
    }
  }, {
    key: "leave",
    value: function leave(leavingNode) {
      var previousLength = this.entered.length;
      this.entered = without2(this.entered.filter(this.isNodeInDocument), leavingNode);
      return previousLength > 0 && this.entered.length === 0;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.entered = [];
    }
  }]);
  return EnterLeaveCounter2;
}();

// node_modules/react-dnd-html5-backend/dist/esm/BrowserDetector.js
var isFirefox = memoize(function() {
  return /firefox/i.test(navigator.userAgent);
});
var isSafari = memoize(function() {
  return Boolean(window.safari);
});

// node_modules/react-dnd-html5-backend/dist/esm/MonotonicInterpolant.js
function _classCallCheck14(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties14(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass14(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties14(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties14(Constructor, staticProps);
  return Constructor;
}
function _defineProperty19(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var MonotonicInterpolant = function() {
  function MonotonicInterpolant2(xs, ys) {
    _classCallCheck14(this, MonotonicInterpolant2);
    _defineProperty19(this, "xs", void 0);
    _defineProperty19(this, "ys", void 0);
    _defineProperty19(this, "c1s", void 0);
    _defineProperty19(this, "c2s", void 0);
    _defineProperty19(this, "c3s", void 0);
    var length = xs.length;
    var indexes = [];
    for (var i = 0; i < length; i++) {
      indexes.push(i);
    }
    indexes.sort(function(a, b) {
      return xs[a] < xs[b] ? -1 : 1;
    });
    var dys = [];
    var dxs = [];
    var ms = [];
    var dx;
    var dy;
    for (var _i = 0; _i < length - 1; _i++) {
      dx = xs[_i + 1] - xs[_i];
      dy = ys[_i + 1] - ys[_i];
      dxs.push(dx);
      dys.push(dy);
      ms.push(dy / dx);
    }
    var c1s = [ms[0]];
    for (var _i2 = 0; _i2 < dxs.length - 1; _i2++) {
      var m2 = ms[_i2];
      var mNext = ms[_i2 + 1];
      if (m2 * mNext <= 0) {
        c1s.push(0);
      } else {
        dx = dxs[_i2];
        var dxNext = dxs[_i2 + 1];
        var common = dx + dxNext;
        c1s.push(3 * common / ((common + dxNext) / m2 + (common + dx) / mNext));
      }
    }
    c1s.push(ms[ms.length - 1]);
    var c2s = [];
    var c3s = [];
    var m;
    for (var _i3 = 0; _i3 < c1s.length - 1; _i3++) {
      m = ms[_i3];
      var c1 = c1s[_i3];
      var invDx = 1 / dxs[_i3];
      var _common = c1 + c1s[_i3 + 1] - m - m;
      c2s.push((m - c1 - _common) * invDx);
      c3s.push(_common * invDx * invDx);
    }
    this.xs = xs;
    this.ys = ys;
    this.c1s = c1s;
    this.c2s = c2s;
    this.c3s = c3s;
  }
  _createClass14(MonotonicInterpolant2, [{
    key: "interpolate",
    value: function interpolate(x) {
      var xs = this.xs, ys = this.ys, c1s = this.c1s, c2s = this.c2s, c3s = this.c3s;
      var i = xs.length - 1;
      if (x === xs[i]) {
        return ys[i];
      }
      var low = 0;
      var high = c3s.length - 1;
      var mid;
      while (low <= high) {
        mid = Math.floor(0.5 * (low + high));
        var xHere = xs[mid];
        if (xHere < x) {
          low = mid + 1;
        } else if (xHere > x) {
          high = mid - 1;
        } else {
          return ys[mid];
        }
      }
      i = Math.max(0, high);
      var diff = x - xs[i];
      var diffSq = diff * diff;
      return ys[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
    }
  }]);
  return MonotonicInterpolant2;
}();

// node_modules/react-dnd-html5-backend/dist/esm/OffsetUtils.js
var ELEMENT_NODE = 1;
function getNodeClientOffset(node) {
  var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;
  if (!el) {
    return null;
  }
  var _el$getBoundingClient = el.getBoundingClientRect(), top = _el$getBoundingClient.top, left = _el$getBoundingClient.left;
  return {
    x: left,
    y: top
  };
}
function getEventClientOffset(e) {
  return {
    x: e.clientX,
    y: e.clientY
  };
}
function isImageNode(node) {
  var _document$documentEle;
  return node.nodeName === "IMG" && (isFirefox() || !((_document$documentEle = document.documentElement) !== null && _document$documentEle !== void 0 && _document$documentEle.contains(node)));
}
function getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight) {
  var dragPreviewWidth = isImage ? dragPreview.width : sourceWidth;
  var dragPreviewHeight = isImage ? dragPreview.height : sourceHeight;
  if (isSafari() && isImage) {
    dragPreviewHeight /= window.devicePixelRatio;
    dragPreviewWidth /= window.devicePixelRatio;
  }
  return {
    dragPreviewWidth,
    dragPreviewHeight
  };
}
function getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint) {
  var isImage = isImageNode(dragPreview);
  var dragPreviewNode = isImage ? sourceNode : dragPreview;
  var dragPreviewNodeOffsetFromClient = getNodeClientOffset(dragPreviewNode);
  var offsetFromDragPreview = {
    x: clientOffset.x - dragPreviewNodeOffsetFromClient.x,
    y: clientOffset.y - dragPreviewNodeOffsetFromClient.y
  };
  var sourceWidth = sourceNode.offsetWidth, sourceHeight = sourceNode.offsetHeight;
  var anchorX = anchorPoint.anchorX, anchorY = anchorPoint.anchorY;
  var _getDragPreviewSize = getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight), dragPreviewWidth = _getDragPreviewSize.dragPreviewWidth, dragPreviewHeight = _getDragPreviewSize.dragPreviewHeight;
  var calculateYOffset = function calculateYOffset2() {
    var interpolantY = new MonotonicInterpolant([0, 0.5, 1], [
      // Dock to the top
      offsetFromDragPreview.y,
      // Align at the center
      offsetFromDragPreview.y / sourceHeight * dragPreviewHeight,
      // Dock to the bottom
      offsetFromDragPreview.y + dragPreviewHeight - sourceHeight
    ]);
    var y = interpolantY.interpolate(anchorY);
    if (isSafari() && isImage) {
      y += (window.devicePixelRatio - 1) * dragPreviewHeight;
    }
    return y;
  };
  var calculateXOffset = function calculateXOffset2() {
    var interpolantX = new MonotonicInterpolant([0, 0.5, 1], [
      // Dock to the left
      offsetFromDragPreview.x,
      // Align at the center
      offsetFromDragPreview.x / sourceWidth * dragPreviewWidth,
      // Dock to the right
      offsetFromDragPreview.x + dragPreviewWidth - sourceWidth
    ]);
    return interpolantX.interpolate(anchorX);
  };
  var offsetX = offsetPoint.offsetX, offsetY = offsetPoint.offsetY;
  var isManualOffsetX = offsetX === 0 || offsetX;
  var isManualOffsetY = offsetY === 0 || offsetY;
  return {
    x: isManualOffsetX ? offsetX : calculateXOffset(),
    y: isManualOffsetY ? offsetY : calculateYOffset()
  };
}

// node_modules/react-dnd-html5-backend/dist/esm/NativeTypes.js
var NativeTypes_exports = {};
__export(NativeTypes_exports, {
  FILE: () => FILE,
  HTML: () => HTML,
  TEXT: () => TEXT,
  URL: () => URL
});
var FILE = "__NATIVE_FILE__";
var URL = "__NATIVE_URL__";
var TEXT = "__NATIVE_TEXT__";
var HTML = "__NATIVE_HTML__";

// node_modules/react-dnd-html5-backend/dist/esm/NativeDragSources/getDataFromDataTransfer.js
function getDataFromDataTransfer(dataTransfer5, typesToTry, defaultValue) {
  var result = typesToTry.reduce(function(resultSoFar, typeToTry) {
    return resultSoFar || dataTransfer5.getData(typeToTry);
  }, "");
  return result != null ? result : defaultValue;
}

// node_modules/react-dnd-html5-backend/dist/esm/NativeDragSources/nativeTypesConfig.js
var _nativeTypesConfig;
function _defineProperty20(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var nativeTypesConfig = (_nativeTypesConfig = {}, _defineProperty20(_nativeTypesConfig, FILE, {
  exposeProperties: {
    files: function files(dataTransfer5) {
      return Array.prototype.slice.call(dataTransfer5.files);
    },
    items: function items(dataTransfer5) {
      return dataTransfer5.items;
    },
    dataTransfer: function dataTransfer(_dataTransfer) {
      return _dataTransfer;
    }
  },
  matchesTypes: ["Files"]
}), _defineProperty20(_nativeTypesConfig, HTML, {
  exposeProperties: {
    html: function html(dataTransfer5, matchesTypes) {
      return getDataFromDataTransfer(dataTransfer5, matchesTypes, "");
    },
    dataTransfer: function dataTransfer2(_dataTransfer2) {
      return _dataTransfer2;
    }
  },
  matchesTypes: ["Html", "text/html"]
}), _defineProperty20(_nativeTypesConfig, URL, {
  exposeProperties: {
    urls: function urls(dataTransfer5, matchesTypes) {
      return getDataFromDataTransfer(dataTransfer5, matchesTypes, "").split("\n");
    },
    dataTransfer: function dataTransfer3(_dataTransfer3) {
      return _dataTransfer3;
    }
  },
  matchesTypes: ["Url", "text/uri-list"]
}), _defineProperty20(_nativeTypesConfig, TEXT, {
  exposeProperties: {
    text: function text(dataTransfer5, matchesTypes) {
      return getDataFromDataTransfer(dataTransfer5, matchesTypes, "");
    },
    dataTransfer: function dataTransfer4(_dataTransfer4) {
      return _dataTransfer4;
    }
  },
  matchesTypes: ["Text", "text/plain"]
}), _nativeTypesConfig);

// node_modules/react-dnd-html5-backend/dist/esm/NativeDragSources/NativeDragSource.js
function _classCallCheck15(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties15(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass15(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties15(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties15(Constructor, staticProps);
  return Constructor;
}
function _defineProperty21(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var NativeDragSource = function() {
  function NativeDragSource2(config) {
    _classCallCheck15(this, NativeDragSource2);
    _defineProperty21(this, "item", void 0);
    _defineProperty21(this, "config", void 0);
    this.config = config;
    this.item = {};
    this.initializeExposedProperties();
  }
  _createClass15(NativeDragSource2, [{
    key: "initializeExposedProperties",
    value: function initializeExposedProperties() {
      var _this = this;
      Object.keys(this.config.exposeProperties).forEach(function(property) {
        Object.defineProperty(_this.item, property, {
          configurable: true,
          enumerable: true,
          get: function get2() {
            console.warn(`Browser doesn't allow reading "`.concat(property, '" until the drop event.'));
            return null;
          }
        });
      });
    }
  }, {
    key: "loadDataTransfer",
    value: function loadDataTransfer(dataTransfer5) {
      var _this2 = this;
      if (dataTransfer5) {
        var newProperties = {};
        Object.keys(this.config.exposeProperties).forEach(function(property) {
          newProperties[property] = {
            value: _this2.config.exposeProperties[property](dataTransfer5, _this2.config.matchesTypes),
            configurable: true,
            enumerable: true
          };
        });
        Object.defineProperties(this.item, newProperties);
      }
    }
  }, {
    key: "canDrag",
    value: function canDrag() {
      return true;
    }
  }, {
    key: "beginDrag",
    value: function beginDrag() {
      return this.item;
    }
  }, {
    key: "isDragging",
    value: function isDragging(monitor, handle) {
      return handle === monitor.getSourceId();
    }
  }, {
    key: "endDrag",
    value: function endDrag() {
    }
  }]);
  return NativeDragSource2;
}();

// node_modules/react-dnd-html5-backend/dist/esm/NativeDragSources/index.js
function createNativeDragSource(type, dataTransfer5) {
  var result = new NativeDragSource(nativeTypesConfig[type]);
  result.loadDataTransfer(dataTransfer5);
  return result;
}
function matchNativeItemType(dataTransfer5) {
  if (!dataTransfer5) {
    return null;
  }
  var dataTransferTypes = Array.prototype.slice.call(dataTransfer5.types || []);
  return Object.keys(nativeTypesConfig).filter(function(nativeItemType) {
    var matchesTypes = nativeTypesConfig[nativeItemType].matchesTypes;
    return matchesTypes.some(function(t) {
      return dataTransferTypes.indexOf(t) > -1;
    });
  })[0] || null;
}

// node_modules/react-dnd-html5-backend/dist/esm/OptionsReader.js
function _classCallCheck16(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties16(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass16(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties16(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties16(Constructor, staticProps);
  return Constructor;
}
function _defineProperty22(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var OptionsReader = function() {
  function OptionsReader2(globalContext, options) {
    _classCallCheck16(this, OptionsReader2);
    _defineProperty22(this, "ownerDocument", null);
    _defineProperty22(this, "globalContext", void 0);
    _defineProperty22(this, "optionsArgs", void 0);
    this.globalContext = globalContext;
    this.optionsArgs = options;
  }
  _createClass16(OptionsReader2, [{
    key: "window",
    get: function get2() {
      if (this.globalContext) {
        return this.globalContext;
      } else if (typeof window !== "undefined") {
        return window;
      }
      return void 0;
    }
  }, {
    key: "document",
    get: function get2() {
      var _this$globalContext;
      if ((_this$globalContext = this.globalContext) !== null && _this$globalContext !== void 0 && _this$globalContext.document) {
        return this.globalContext.document;
      } else if (this.window) {
        return this.window.document;
      } else {
        return void 0;
      }
    }
  }, {
    key: "rootElement",
    get: function get2() {
      var _this$optionsArgs;
      return ((_this$optionsArgs = this.optionsArgs) === null || _this$optionsArgs === void 0 ? void 0 : _this$optionsArgs.rootElement) || this.window;
    }
  }]);
  return OptionsReader2;
}();

// node_modules/react-dnd-html5-backend/dist/esm/HTML5BackendImpl.js
function ownKeys5(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread6(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys5(Object(source), true).forEach(function(key) {
        _defineProperty23(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys5(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _classCallCheck17(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties17(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass17(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties17(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties17(Constructor, staticProps);
  return Constructor;
}
function _defineProperty23(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var HTML5BackendImpl = function() {
  function HTML5BackendImpl2(manager, globalContext, options) {
    var _this = this;
    _classCallCheck17(this, HTML5BackendImpl2);
    _defineProperty23(this, "options", void 0);
    _defineProperty23(this, "actions", void 0);
    _defineProperty23(this, "monitor", void 0);
    _defineProperty23(this, "registry", void 0);
    _defineProperty23(this, "enterLeaveCounter", void 0);
    _defineProperty23(this, "sourcePreviewNodes", /* @__PURE__ */ new Map());
    _defineProperty23(this, "sourcePreviewNodeOptions", /* @__PURE__ */ new Map());
    _defineProperty23(this, "sourceNodes", /* @__PURE__ */ new Map());
    _defineProperty23(this, "sourceNodeOptions", /* @__PURE__ */ new Map());
    _defineProperty23(this, "dragStartSourceIds", null);
    _defineProperty23(this, "dropTargetIds", []);
    _defineProperty23(this, "dragEnterTargetIds", []);
    _defineProperty23(this, "currentNativeSource", null);
    _defineProperty23(this, "currentNativeHandle", null);
    _defineProperty23(this, "currentDragSourceNode", null);
    _defineProperty23(this, "altKeyPressed", false);
    _defineProperty23(this, "mouseMoveTimeoutTimer", null);
    _defineProperty23(this, "asyncEndDragFrameId", null);
    _defineProperty23(this, "dragOverTargetIds", null);
    _defineProperty23(this, "lastClientOffset", null);
    _defineProperty23(this, "hoverRafId", null);
    _defineProperty23(this, "getSourceClientOffset", function(sourceId) {
      var source = _this.sourceNodes.get(sourceId);
      return source && getNodeClientOffset(source) || null;
    });
    _defineProperty23(this, "endDragNativeItem", function() {
      if (!_this.isDraggingNativeItem()) {
        return;
      }
      _this.actions.endDrag();
      if (_this.currentNativeHandle) {
        _this.registry.removeSource(_this.currentNativeHandle);
      }
      _this.currentNativeHandle = null;
      _this.currentNativeSource = null;
    });
    _defineProperty23(this, "isNodeInDocument", function(node) {
      return Boolean(node && _this.document && _this.document.body && _this.document.body.contains(node));
    });
    _defineProperty23(this, "endDragIfSourceWasRemovedFromDOM", function() {
      var node = _this.currentDragSourceNode;
      if (node == null || _this.isNodeInDocument(node)) {
        return;
      }
      if (_this.clearCurrentDragSourceNode() && _this.monitor.isDragging()) {
        _this.actions.endDrag();
      }
    });
    _defineProperty23(this, "handleTopDragStartCapture", function() {
      _this.clearCurrentDragSourceNode();
      _this.dragStartSourceIds = [];
    });
    _defineProperty23(this, "handleTopDragStart", function(e) {
      if (e.defaultPrevented) {
        return;
      }
      var dragStartSourceIds = _this.dragStartSourceIds;
      _this.dragStartSourceIds = null;
      var clientOffset = getEventClientOffset(e);
      if (_this.monitor.isDragging()) {
        _this.actions.endDrag();
      }
      _this.actions.beginDrag(dragStartSourceIds || [], {
        publishSource: false,
        getSourceClientOffset: _this.getSourceClientOffset,
        clientOffset
      });
      var dataTransfer5 = e.dataTransfer;
      var nativeType = matchNativeItemType(dataTransfer5);
      if (_this.monitor.isDragging()) {
        if (dataTransfer5 && typeof dataTransfer5.setDragImage === "function") {
          var sourceId = _this.monitor.getSourceId();
          var sourceNode = _this.sourceNodes.get(sourceId);
          var dragPreview = _this.sourcePreviewNodes.get(sourceId) || sourceNode;
          if (dragPreview) {
            var _this$getCurrentSourc = _this.getCurrentSourcePreviewNodeOptions(), anchorX = _this$getCurrentSourc.anchorX, anchorY = _this$getCurrentSourc.anchorY, offsetX = _this$getCurrentSourc.offsetX, offsetY = _this$getCurrentSourc.offsetY;
            var anchorPoint = {
              anchorX,
              anchorY
            };
            var offsetPoint = {
              offsetX,
              offsetY
            };
            var dragPreviewOffset = getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint);
            dataTransfer5.setDragImage(dragPreview, dragPreviewOffset.x, dragPreviewOffset.y);
          }
        }
        try {
          dataTransfer5 === null || dataTransfer5 === void 0 ? void 0 : dataTransfer5.setData("application/json", {});
        } catch (err) {
        }
        _this.setCurrentDragSourceNode(e.target);
        var _this$getCurrentSourc2 = _this.getCurrentSourcePreviewNodeOptions(), captureDraggingState = _this$getCurrentSourc2.captureDraggingState;
        if (!captureDraggingState) {
          setTimeout(function() {
            return _this.actions.publishDragSource();
          }, 0);
        } else {
          _this.actions.publishDragSource();
        }
      } else if (nativeType) {
        _this.beginDragNativeItem(nativeType);
      } else if (dataTransfer5 && !dataTransfer5.types && (e.target && !e.target.hasAttribute || !e.target.hasAttribute("draggable"))) {
        return;
      } else {
        e.preventDefault();
      }
    });
    _defineProperty23(this, "handleTopDragEndCapture", function() {
      if (_this.clearCurrentDragSourceNode() && _this.monitor.isDragging()) {
        _this.actions.endDrag();
      }
    });
    _defineProperty23(this, "handleTopDragEnterCapture", function(e) {
      _this.dragEnterTargetIds = [];
      var isFirstEnter = _this.enterLeaveCounter.enter(e.target);
      if (!isFirstEnter || _this.monitor.isDragging()) {
        return;
      }
      var dataTransfer5 = e.dataTransfer;
      var nativeType = matchNativeItemType(dataTransfer5);
      if (nativeType) {
        _this.beginDragNativeItem(nativeType, dataTransfer5);
      }
    });
    _defineProperty23(this, "handleTopDragEnter", function(e) {
      var dragEnterTargetIds = _this.dragEnterTargetIds;
      _this.dragEnterTargetIds = [];
      if (!_this.monitor.isDragging()) {
        return;
      }
      _this.altKeyPressed = e.altKey;
      if (dragEnterTargetIds.length > 0) {
        _this.actions.hover(dragEnterTargetIds, {
          clientOffset: getEventClientOffset(e)
        });
      }
      var canDrop = dragEnterTargetIds.some(function(targetId) {
        return _this.monitor.canDropOnTarget(targetId);
      });
      if (canDrop) {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = _this.getCurrentDropEffect();
        }
      }
    });
    _defineProperty23(this, "handleTopDragOverCapture", function() {
      _this.dragOverTargetIds = [];
    });
    _defineProperty23(this, "handleTopDragOver", function(e) {
      var dragOverTargetIds = _this.dragOverTargetIds;
      _this.dragOverTargetIds = [];
      if (!_this.monitor.isDragging()) {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = "none";
        }
        return;
      }
      _this.altKeyPressed = e.altKey;
      _this.lastClientOffset = getEventClientOffset(e);
      if (_this.hoverRafId === null && typeof requestAnimationFrame !== "undefined") {
        _this.hoverRafId = requestAnimationFrame(function() {
          if (_this.monitor.isDragging()) {
            _this.actions.hover(dragOverTargetIds || [], {
              clientOffset: _this.lastClientOffset
            });
          }
          _this.hoverRafId = null;
        });
      }
      var canDrop = (dragOverTargetIds || []).some(function(targetId) {
        return _this.monitor.canDropOnTarget(targetId);
      });
      if (canDrop) {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = _this.getCurrentDropEffect();
        }
      } else if (_this.isDraggingNativeItem()) {
        e.preventDefault();
      } else {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = "none";
        }
      }
    });
    _defineProperty23(this, "handleTopDragLeaveCapture", function(e) {
      if (_this.isDraggingNativeItem()) {
        e.preventDefault();
      }
      var isLastLeave = _this.enterLeaveCounter.leave(e.target);
      if (!isLastLeave) {
        return;
      }
      if (_this.isDraggingNativeItem()) {
        setTimeout(function() {
          return _this.endDragNativeItem();
        }, 0);
      }
    });
    _defineProperty23(this, "handleTopDropCapture", function(e) {
      _this.dropTargetIds = [];
      if (_this.isDraggingNativeItem()) {
        var _this$currentNativeSo;
        e.preventDefault();
        (_this$currentNativeSo = _this.currentNativeSource) === null || _this$currentNativeSo === void 0 ? void 0 : _this$currentNativeSo.loadDataTransfer(e.dataTransfer);
      } else if (matchNativeItemType(e.dataTransfer)) {
        e.preventDefault();
      }
      _this.enterLeaveCounter.reset();
    });
    _defineProperty23(this, "handleTopDrop", function(e) {
      var dropTargetIds = _this.dropTargetIds;
      _this.dropTargetIds = [];
      _this.actions.hover(dropTargetIds, {
        clientOffset: getEventClientOffset(e)
      });
      _this.actions.drop({
        dropEffect: _this.getCurrentDropEffect()
      });
      if (_this.isDraggingNativeItem()) {
        _this.endDragNativeItem();
      } else if (_this.monitor.isDragging()) {
        _this.actions.endDrag();
      }
    });
    _defineProperty23(this, "handleSelectStart", function(e) {
      var target = e.target;
      if (typeof target.dragDrop !== "function") {
        return;
      }
      if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      e.preventDefault();
      target.dragDrop();
    });
    this.options = new OptionsReader(globalContext, options);
    this.actions = manager.getActions();
    this.monitor = manager.getMonitor();
    this.registry = manager.getRegistry();
    this.enterLeaveCounter = new EnterLeaveCounter(this.isNodeInDocument);
  }
  _createClass17(HTML5BackendImpl2, [{
    key: "profile",
    value: function profile() {
      var _this$dragStartSource, _this$dragOverTargetI;
      return {
        sourcePreviewNodes: this.sourcePreviewNodes.size,
        sourcePreviewNodeOptions: this.sourcePreviewNodeOptions.size,
        sourceNodeOptions: this.sourceNodeOptions.size,
        sourceNodes: this.sourceNodes.size,
        dragStartSourceIds: ((_this$dragStartSource = this.dragStartSourceIds) === null || _this$dragStartSource === void 0 ? void 0 : _this$dragStartSource.length) || 0,
        dropTargetIds: this.dropTargetIds.length,
        dragEnterTargetIds: this.dragEnterTargetIds.length,
        dragOverTargetIds: ((_this$dragOverTargetI = this.dragOverTargetIds) === null || _this$dragOverTargetI === void 0 ? void 0 : _this$dragOverTargetI.length) || 0
      };
    }
    // public for test
  }, {
    key: "window",
    get: function get2() {
      return this.options.window;
    }
  }, {
    key: "document",
    get: function get2() {
      return this.options.document;
    }
    /**
     * Get the root element to use for event subscriptions
     */
  }, {
    key: "rootElement",
    get: function get2() {
      return this.options.rootElement;
    }
  }, {
    key: "setup",
    value: function setup() {
      var root = this.rootElement;
      if (root === void 0) {
        return;
      }
      if (root.__isReactDndBackendSetUp) {
        throw new Error("Cannot have two HTML5 backends at the same time.");
      }
      root.__isReactDndBackendSetUp = true;
      this.addEventListeners(root);
    }
  }, {
    key: "teardown",
    value: function teardown() {
      var root = this.rootElement;
      if (root === void 0) {
        return;
      }
      root.__isReactDndBackendSetUp = false;
      this.removeEventListeners(this.rootElement);
      this.clearCurrentDragSourceNode();
      if (this.asyncEndDragFrameId) {
        var _this$window;
        (_this$window = this.window) === null || _this$window === void 0 ? void 0 : _this$window.cancelAnimationFrame(this.asyncEndDragFrameId);
      }
    }
  }, {
    key: "connectDragPreview",
    value: function connectDragPreview(sourceId, node, options) {
      var _this2 = this;
      this.sourcePreviewNodeOptions.set(sourceId, options);
      this.sourcePreviewNodes.set(sourceId, node);
      return function() {
        _this2.sourcePreviewNodes.delete(sourceId);
        _this2.sourcePreviewNodeOptions.delete(sourceId);
      };
    }
  }, {
    key: "connectDragSource",
    value: function connectDragSource(sourceId, node, options) {
      var _this3 = this;
      this.sourceNodes.set(sourceId, node);
      this.sourceNodeOptions.set(sourceId, options);
      var handleDragStart = function handleDragStart2(e) {
        return _this3.handleDragStart(e, sourceId);
      };
      var handleSelectStart = function handleSelectStart2(e) {
        return _this3.handleSelectStart(e);
      };
      node.setAttribute("draggable", "true");
      node.addEventListener("dragstart", handleDragStart);
      node.addEventListener("selectstart", handleSelectStart);
      return function() {
        _this3.sourceNodes.delete(sourceId);
        _this3.sourceNodeOptions.delete(sourceId);
        node.removeEventListener("dragstart", handleDragStart);
        node.removeEventListener("selectstart", handleSelectStart);
        node.setAttribute("draggable", "false");
      };
    }
  }, {
    key: "connectDropTarget",
    value: function connectDropTarget(targetId, node) {
      var _this4 = this;
      var handleDragEnter = function handleDragEnter2(e) {
        return _this4.handleDragEnter(e, targetId);
      };
      var handleDragOver = function handleDragOver2(e) {
        return _this4.handleDragOver(e, targetId);
      };
      var handleDrop = function handleDrop2(e) {
        return _this4.handleDrop(e, targetId);
      };
      node.addEventListener("dragenter", handleDragEnter);
      node.addEventListener("dragover", handleDragOver);
      node.addEventListener("drop", handleDrop);
      return function() {
        node.removeEventListener("dragenter", handleDragEnter);
        node.removeEventListener("dragover", handleDragOver);
        node.removeEventListener("drop", handleDrop);
      };
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners(target) {
      if (!target.addEventListener) {
        return;
      }
      target.addEventListener("dragstart", this.handleTopDragStart);
      target.addEventListener("dragstart", this.handleTopDragStartCapture, true);
      target.addEventListener("dragend", this.handleTopDragEndCapture, true);
      target.addEventListener("dragenter", this.handleTopDragEnter);
      target.addEventListener("dragenter", this.handleTopDragEnterCapture, true);
      target.addEventListener("dragleave", this.handleTopDragLeaveCapture, true);
      target.addEventListener("dragover", this.handleTopDragOver);
      target.addEventListener("dragover", this.handleTopDragOverCapture, true);
      target.addEventListener("drop", this.handleTopDrop);
      target.addEventListener("drop", this.handleTopDropCapture, true);
    }
  }, {
    key: "removeEventListeners",
    value: function removeEventListeners(target) {
      if (!target.removeEventListener) {
        return;
      }
      target.removeEventListener("dragstart", this.handleTopDragStart);
      target.removeEventListener("dragstart", this.handleTopDragStartCapture, true);
      target.removeEventListener("dragend", this.handleTopDragEndCapture, true);
      target.removeEventListener("dragenter", this.handleTopDragEnter);
      target.removeEventListener("dragenter", this.handleTopDragEnterCapture, true);
      target.removeEventListener("dragleave", this.handleTopDragLeaveCapture, true);
      target.removeEventListener("dragover", this.handleTopDragOver);
      target.removeEventListener("dragover", this.handleTopDragOverCapture, true);
      target.removeEventListener("drop", this.handleTopDrop);
      target.removeEventListener("drop", this.handleTopDropCapture, true);
    }
  }, {
    key: "getCurrentSourceNodeOptions",
    value: function getCurrentSourceNodeOptions() {
      var sourceId = this.monitor.getSourceId();
      var sourceNodeOptions = this.sourceNodeOptions.get(sourceId);
      return _objectSpread6({
        dropEffect: this.altKeyPressed ? "copy" : "move"
      }, sourceNodeOptions || {});
    }
  }, {
    key: "getCurrentDropEffect",
    value: function getCurrentDropEffect() {
      if (this.isDraggingNativeItem()) {
        return "copy";
      }
      return this.getCurrentSourceNodeOptions().dropEffect;
    }
  }, {
    key: "getCurrentSourcePreviewNodeOptions",
    value: function getCurrentSourcePreviewNodeOptions() {
      var sourceId = this.monitor.getSourceId();
      var sourcePreviewNodeOptions = this.sourcePreviewNodeOptions.get(sourceId);
      return _objectSpread6({
        anchorX: 0.5,
        anchorY: 0.5,
        captureDraggingState: false
      }, sourcePreviewNodeOptions || {});
    }
  }, {
    key: "isDraggingNativeItem",
    value: function isDraggingNativeItem() {
      var itemType = this.monitor.getItemType();
      return Object.keys(NativeTypes_exports).some(function(key) {
        return NativeTypes_exports[key] === itemType;
      });
    }
  }, {
    key: "beginDragNativeItem",
    value: function beginDragNativeItem(type, dataTransfer5) {
      this.clearCurrentDragSourceNode();
      this.currentNativeSource = createNativeDragSource(type, dataTransfer5);
      this.currentNativeHandle = this.registry.addSource(type, this.currentNativeSource);
      this.actions.beginDrag([this.currentNativeHandle]);
    }
  }, {
    key: "setCurrentDragSourceNode",
    value: function setCurrentDragSourceNode(node) {
      var _this5 = this;
      this.clearCurrentDragSourceNode();
      this.currentDragSourceNode = node;
      var MOUSE_MOVE_TIMEOUT = 1e3;
      this.mouseMoveTimeoutTimer = setTimeout(function() {
        var _this5$rootElement;
        return (_this5$rootElement = _this5.rootElement) === null || _this5$rootElement === void 0 ? void 0 : _this5$rootElement.addEventListener("mousemove", _this5.endDragIfSourceWasRemovedFromDOM, true);
      }, MOUSE_MOVE_TIMEOUT);
    }
  }, {
    key: "clearCurrentDragSourceNode",
    value: function clearCurrentDragSourceNode() {
      if (this.currentDragSourceNode) {
        this.currentDragSourceNode = null;
        if (this.rootElement) {
          var _this$window2;
          (_this$window2 = this.window) === null || _this$window2 === void 0 ? void 0 : _this$window2.clearTimeout(this.mouseMoveTimeoutTimer || void 0);
          this.rootElement.removeEventListener("mousemove", this.endDragIfSourceWasRemovedFromDOM, true);
        }
        this.mouseMoveTimeoutTimer = null;
        return true;
      }
      return false;
    }
  }, {
    key: "handleDragStart",
    value: function handleDragStart(e, sourceId) {
      if (e.defaultPrevented) {
        return;
      }
      if (!this.dragStartSourceIds) {
        this.dragStartSourceIds = [];
      }
      this.dragStartSourceIds.unshift(sourceId);
    }
  }, {
    key: "handleDragEnter",
    value: function handleDragEnter(e, targetId) {
      this.dragEnterTargetIds.unshift(targetId);
    }
  }, {
    key: "handleDragOver",
    value: function handleDragOver(e, targetId) {
      if (this.dragOverTargetIds === null) {
        this.dragOverTargetIds = [];
      }
      this.dragOverTargetIds.unshift(targetId);
    }
  }, {
    key: "handleDrop",
    value: function handleDrop(e, targetId) {
      this.dropTargetIds.unshift(targetId);
    }
  }]);
  return HTML5BackendImpl2;
}();

// node_modules/react-dnd-html5-backend/dist/esm/getEmptyImage.js
var emptyImage;
function getEmptyImage() {
  if (!emptyImage) {
    emptyImage = new Image();
    emptyImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  }
  return emptyImage;
}

// node_modules/react-dnd-html5-backend/dist/esm/index.js
var HTML5Backend = function createBackend(manager, context, options) {
  return new HTML5BackendImpl(manager, context, options);
};

// node_modules/react-arborist/dist/module/dnd/drag-hook.js
function useDragHook(node) {
  const tree = useTreeApi();
  const ids = tree.selectedIds;
  const [_, ref, preview] = useDrag(() => ({
    canDrag: () => node.isDraggable,
    type: "NODE",
    item: () => {
      const dragIds = tree.isSelected(node.id) ? Array.from(ids) : [node.id];
      tree.dispatch(actions3.dragStart(node.id, dragIds));
      return { id: node.id };
    },
    end: () => {
      tree.hideCursor();
      let { parentId, index, dragIds } = tree.state.dnd;
      if (tree.canDrop()) {
        safeRun(tree.props.onMove, {
          dragIds,
          parentId: parentId === ROOT_ID ? null : parentId,
          index: index === null ? 0 : index,
          // When it's null it was dropped over a folder
          dragNodes: tree.dragNodes,
          parentNode: tree.get(parentId)
        });
        tree.open(parentId);
      }
      tree.dispatch(actions3.dragEnd());
    }
  }), [ids, node]);
  (0, import_react29.useEffect)(() => {
    preview(getEmptyImage());
  }, [preview]);
  return ref;
}

// node_modules/react-arborist/dist/module/dnd/compute-drop.js
function measureHover(el, offset) {
  const rect = el.getBoundingClientRect();
  const x = offset.x - Math.round(rect.x);
  const y = offset.y - Math.round(rect.y);
  const height = rect.height;
  const inTopHalf = y < height / 2;
  const inBottomHalf = !inTopHalf;
  const pad = height / 4;
  const inMiddle = y > pad && y < height - pad;
  const atTop = !inMiddle && inTopHalf;
  const atBottom = !inMiddle && inBottomHalf;
  return { x, inTopHalf, inBottomHalf, inMiddle, atTop, atBottom };
}
function getNodesAroundCursor(node, prev, next, hover) {
  if (!node) {
    return [prev, null];
  }
  if (node.isInternal) {
    if (hover.atTop) {
      return [prev, node];
    } else if (hover.inMiddle) {
      return [node, node];
    } else {
      return [node, next];
    }
  } else {
    if (hover.inTopHalf) {
      return [prev, node];
    } else {
      return [node, next];
    }
  }
}
function dropAt(parentId, index) {
  return { parentId: parentId || null, index };
}
function lineCursor(index, level) {
  return {
    type: "line",
    index,
    level
  };
}
function highlightCursor(id) {
  return {
    type: "highlight",
    id
  };
}
function walkUpFrom(node, level) {
  var _a;
  let drop = node;
  while (drop.parent && drop.level > level) {
    drop = drop.parent;
  }
  const parentId = ((_a = drop.parent) === null || _a === void 0 ? void 0 : _a.id) || null;
  const index = indexOf(drop) + 1;
  return { parentId, index };
}
function computeDrop(args) {
  var _a;
  const hover = measureHover(args.element, args.offset);
  const indent = args.indent;
  const hoverLevel = Math.round(Math.max(0, hover.x - indent) / indent);
  const { node, nextNode, prevNode } = args;
  const [above, below] = getNodesAroundCursor(node, prevNode, nextNode, hover);
  if (node && node.isInternal && hover.inMiddle) {
    return {
      drop: dropAt(node.id, null),
      cursor: highlightCursor(node.id)
    };
  }
  if (!above) {
    return {
      drop: dropAt((_a = below === null || below === void 0 ? void 0 : below.parent) === null || _a === void 0 ? void 0 : _a.id, 0),
      cursor: lineCursor(0, 0)
    };
  }
  if (isItem(above)) {
    const level = bound(hoverLevel, (below === null || below === void 0 ? void 0 : below.level) || 0, above.level);
    return {
      drop: walkUpFrom(above, level),
      cursor: lineCursor(above.rowIndex + 1, level)
    };
  }
  if (isClosed(above)) {
    const level = bound(hoverLevel, (below === null || below === void 0 ? void 0 : below.level) || 0, above.level);
    return {
      drop: walkUpFrom(above, level),
      cursor: lineCursor(above.rowIndex + 1, level)
    };
  }
  if (isOpenWithEmptyChildren(above)) {
    const level = bound(hoverLevel, 0, above.level + 1);
    if (level > above.level) {
      return {
        drop: dropAt(above.id, 0),
        cursor: lineCursor(above.rowIndex + 1, level)
      };
    } else {
      return {
        drop: walkUpFrom(above, level),
        cursor: lineCursor(above.rowIndex + 1, level)
      };
    }
  }
  return {
    drop: dropAt(above === null || above === void 0 ? void 0 : above.id, 0),
    cursor: lineCursor(above.rowIndex + 1, above.level + 1)
  };
}

// node_modules/react-arborist/dist/module/dnd/drop-hook.js
function useDropHook(el, node) {
  const tree = useTreeApi();
  const [_, dropRef] = useDrop(() => ({
    accept: "NODE",
    canDrop: () => tree.canDrop(),
    hover: (_item, m) => {
      const offset = m.getClientOffset();
      if (!el.current || !offset)
        return;
      const { cursor, drop } = computeDrop({
        element: el.current,
        offset,
        indent: tree.indent,
        node,
        prevNode: node.prev,
        nextNode: node.next
      });
      if (drop)
        tree.dispatch(actions3.hovering(drop.parentId, drop.index));
      if (m.canDrop()) {
        if (cursor)
          tree.showCursor(cursor);
      } else {
        tree.hideCursor();
      }
    },
    drop: (_2, m) => {
      if (!m.canDrop())
        return null;
    }
  }), [node, el.current, tree.props]);
  return dropRef;
}

// node_modules/react-arborist/dist/module/hooks/use-fresh-node.js
var import_react30 = __toESM(require_react());
function useFreshNode(index) {
  const tree = useTreeApi();
  const original = tree.at(index);
  if (!original)
    throw new Error(`Could not find node for index: ${index}`);
  return (0, import_react30.useMemo)(() => {
    const fresh = original.clone();
    tree.visibleNodes[index] = fresh;
    return fresh;
  }, [...Object.values(original.state), original]);
}

// node_modules/react-arborist/dist/module/components/row-container.js
var RowContainer = import_react31.default.memo(function RowContainer2({ index, style }) {
  useDataUpdates();
  const _ = useNodesContext();
  const tree = useTreeApi();
  const node = useFreshNode(index);
  const el = (0, import_react31.useRef)(null);
  const dragRef = useDragHook(node);
  const dropRef = useDropHook(el, node);
  const innerRef = (0, import_react31.useCallback)((n) => {
    el.current = n;
    dropRef(n);
  }, [dropRef]);
  const indent = tree.indent * node.level;
  const nodeStyle = (0, import_react31.useMemo)(() => ({ paddingLeft: indent }), [indent]);
  const rowStyle = (0, import_react31.useMemo)(() => {
    var _a, _b;
    return Object.assign(Object.assign({}, style), { top: parseFloat(style.top) + ((_b = (_a = tree.props.padding) !== null && _a !== void 0 ? _a : tree.props.paddingTop) !== null && _b !== void 0 ? _b : 0) });
  }, [style, tree.props.padding, tree.props.paddingTop]);
  const rowAttrs = {
    role: "treeitem",
    "aria-level": node.level + 1,
    "aria-selected": node.isSelected,
    style: rowStyle,
    tabIndex: -1,
    className: tree.props.rowClassName
  };
  (0, import_react31.useEffect)(() => {
    var _a;
    if (!node.isEditing && node.isFocused) {
      (_a = el.current) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
    }
  }, [node.isEditing, node.isFocused, el.current]);
  const Node = tree.renderNode;
  const Row = tree.renderRow;
  return (0, import_jsx_runtime11.jsx)(Row, { node, innerRef, attrs: rowAttrs, children: (0, import_jsx_runtime11.jsx)(Node, { node, tree, style: nodeStyle, dragHandle: dragRef }) });
});

// node_modules/react-arborist/dist/module/components/default-container.js
var focusSearchTerm = "";
var timeoutId = null;
function DefaultContainer() {
  useDataUpdates();
  const tree = useTreeApi();
  return (0, import_jsx_runtime12.jsx)("div", { role: "tree", style: {
    height: tree.height,
    width: tree.width,
    minHeight: 0,
    minWidth: 0
  }, onContextMenu: tree.props.onContextMenu, onClick: tree.props.onClick, tabIndex: 0, onFocus: (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      tree.onFocus();
    }
  }, onBlur: (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      tree.onBlur();
    }
  }, onKeyDown: (e) => {
    var _a;
    if (tree.isEditing) {
      return;
    }
    if (e.key === "Backspace") {
      if (!tree.props.onDelete)
        return;
      const ids = Array.from(tree.selectedIds);
      if (ids.length > 1) {
        let nextFocus = tree.mostRecentNode;
        while (nextFocus && nextFocus.isSelected) {
          nextFocus = nextFocus.nextSibling;
        }
        if (!nextFocus)
          nextFocus = tree.lastNode;
        tree.focus(nextFocus, { scroll: false });
        tree.delete(Array.from(ids));
      } else {
        const node2 = tree.focusedNode;
        if (node2) {
          const sib = node2.nextSibling;
          const parent = node2.parent;
          tree.focus(sib || parent, { scroll: false });
          tree.delete(node2);
        }
      }
      return;
    }
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      focusNextElement(e.currentTarget);
      return;
    }
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      focusPrevElement(e.currentTarget);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = tree.nextNode;
      if (e.metaKey) {
        tree.select(tree.focusedNode);
        tree.activate(tree.focusedNode);
        return;
      } else if (!e.shiftKey || tree.props.disableMultiSelection) {
        tree.focus(next);
        return;
      } else {
        if (!next)
          return;
        const current = tree.focusedNode;
        if (!current) {
          tree.focus(tree.firstNode);
        } else if (current.isSelected) {
          tree.selectContiguous(next);
        } else {
          tree.selectMulti(next);
        }
        return;
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = tree.prevNode;
      if (!e.shiftKey || tree.props.disableMultiSelection) {
        tree.focus(prev);
        return;
      } else {
        if (!prev)
          return;
        const current = tree.focusedNode;
        if (!current) {
          tree.focus(tree.lastNode);
        } else if (current.isSelected) {
          tree.selectContiguous(prev);
        } else {
          tree.selectMulti(prev);
        }
        return;
      }
    }
    if (e.key === "ArrowRight") {
      const node2 = tree.focusedNode;
      if (!node2)
        return;
      if (node2.isInternal && node2.isOpen) {
        tree.focus(tree.nextNode);
      } else if (node2.isInternal)
        tree.open(node2.id);
      return;
    }
    if (e.key === "ArrowLeft") {
      const node2 = tree.focusedNode;
      if (!node2 || node2.isRoot)
        return;
      if (node2.isInternal && node2.isOpen)
        tree.close(node2.id);
      else if (!((_a = node2.parent) === null || _a === void 0 ? void 0 : _a.isRoot)) {
        tree.focus(node2.parent);
      }
      return;
    }
    if (e.key === "a" && e.metaKey && !tree.props.disableMultiSelection) {
      e.preventDefault();
      tree.selectAll();
      return;
    }
    if (e.key === "a" && !e.metaKey && tree.props.onCreate) {
      tree.createLeaf();
      return;
    }
    if (e.key === "A" && !e.metaKey) {
      if (!tree.props.onCreate)
        return;
      tree.createInternal();
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      tree.focus(tree.firstNode);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      tree.focus(tree.lastNode);
      return;
    }
    if (e.key === "Enter") {
      const node2 = tree.focusedNode;
      if (!node2)
        return;
      if (!node2.isEditable || !tree.props.onRename)
        return;
      setTimeout(() => {
        if (node2)
          tree.edit(node2);
      });
      return;
    }
    if (e.key === " ") {
      e.preventDefault();
      const node2 = tree.focusedNode;
      if (!node2)
        return;
      if (node2.isLeaf) {
        node2.select();
        node2.activate();
      } else {
        node2.toggle();
      }
      return;
    }
    if (e.key === "*") {
      const node2 = tree.focusedNode;
      if (!node2)
        return;
      tree.openSiblings(node2);
      return;
    }
    if (e.key === "PageUp") {
      e.preventDefault();
      tree.pageUp();
      return;
    }
    if (e.key === "PageDown") {
      e.preventDefault();
      tree.pageDown();
    }
    clearTimeout(timeoutId);
    focusSearchTerm += e.key;
    timeoutId = setTimeout(() => {
      focusSearchTerm = "";
    }, 600);
    const node = tree.visibleNodes.find((n) => {
      const name = n.data.name;
      if (typeof name === "string") {
        return name.toLowerCase().startsWith(focusSearchTerm);
      } else
        return false;
    });
    if (node)
      tree.focus(node.id);
  }, children: (0, import_jsx_runtime12.jsx)(FixedSizeList, { className: tree.props.className, outerRef: tree.listEl, itemCount: tree.visibleNodes.length, height: tree.height, width: tree.width, itemSize: tree.rowHeight, overscanCount: tree.overscanCount, itemKey: (index) => {
    var _a;
    return ((_a = tree.visibleNodes[index]) === null || _a === void 0 ? void 0 : _a.id) || index;
  }, outerElementType: ListOuterElement, innerElementType: ListInnerElement, onScroll: tree.props.onScroll, onItemsRendered: tree.onItemsRendered.bind(tree), ref: tree.list, children: RowContainer }) });
}

// node_modules/react-arborist/dist/module/data/create-list.js
function createList(tree) {
  if (tree.isFiltered) {
    return flattenAndFilterTree(tree.root, tree.isMatch.bind(tree));
  } else {
    return flattenTree(tree.root);
  }
}
function flattenTree(root) {
  const list = [];
  function collect(node) {
    var _a;
    if (node.level >= 0) {
      list.push(node);
    }
    if (node.isOpen) {
      (_a = node.children) === null || _a === void 0 ? void 0 : _a.forEach(collect);
    }
  }
  collect(root);
  list.forEach(assignRowIndex);
  return list;
}
function flattenAndFilterTree(root, isMatch) {
  const matches = {};
  const list = [];
  function markMatch(node) {
    const yes = !node.isRoot && isMatch(node);
    if (yes) {
      matches[node.id] = true;
      let parent = node.parent;
      while (parent) {
        matches[parent.id] = true;
        parent = parent.parent;
      }
    }
    if (node.children) {
      for (let child of node.children)
        markMatch(child);
    }
  }
  function collect(node) {
    var _a;
    if (node.level >= 0 && matches[node.id]) {
      list.push(node);
    }
    if (node.isOpen) {
      (_a = node.children) === null || _a === void 0 ? void 0 : _a.forEach(collect);
    }
  }
  markMatch(root);
  collect(root);
  list.forEach(assignRowIndex);
  return list;
}
function assignRowIndex(node, index) {
  node.rowIndex = index;
}

// node_modules/react-arborist/dist/module/data/create-index.js
var createIndex = (nodes) => {
  return nodes.reduce((map, node, index) => {
    map[node.id] = index;
    return map;
  }, {});
};

// node_modules/react-arborist/dist/module/interfaces/tree-api.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var { safeRun: safeRun2, identify: identify2, identifyNull: identifyNull2 } = utils_exports;
var TreeApi = class _TreeApi {
  constructor(store, props, list, listEl) {
    this.store = store;
    this.props = props;
    this.list = list;
    this.listEl = listEl;
    this.visibleStartIndex = 0;
    this.visibleStopIndex = 0;
    this.root = createRoot(this);
    this.visibleNodes = createList(this);
    this.idToIndex = createIndex(this.visibleNodes);
  }
  /* Changes here must also be made in constructor() */
  update(props) {
    this.props = props;
    this.root = createRoot(this);
    this.visibleNodes = createList(this);
    this.idToIndex = createIndex(this.visibleNodes);
  }
  /* Store helpers */
  dispatch(action) {
    return this.store.dispatch(action);
  }
  get state() {
    return this.store.getState();
  }
  get openState() {
    return this.state.nodes.open.unfiltered;
  }
  /* Tree Props */
  get width() {
    var _a;
    return (_a = this.props.width) !== null && _a !== void 0 ? _a : 300;
  }
  get height() {
    var _a;
    return (_a = this.props.height) !== null && _a !== void 0 ? _a : 500;
  }
  get indent() {
    var _a;
    return (_a = this.props.indent) !== null && _a !== void 0 ? _a : 24;
  }
  get rowHeight() {
    var _a;
    return (_a = this.props.rowHeight) !== null && _a !== void 0 ? _a : 24;
  }
  get overscanCount() {
    var _a;
    return (_a = this.props.overscanCount) !== null && _a !== void 0 ? _a : 1;
  }
  get searchTerm() {
    return (this.props.searchTerm || "").trim();
  }
  get matchFn() {
    var _a;
    const match = (_a = this.props.searchMatch) !== null && _a !== void 0 ? _a : (node, term) => {
      const string = JSON.stringify(Object.values(node.data));
      return string.toLocaleLowerCase().includes(term.toLocaleLowerCase());
    };
    return (node) => match(node, this.searchTerm);
  }
  accessChildren(data) {
    var _a;
    const get2 = this.props.childrenAccessor || "children";
    return (_a = access(data, get2)) !== null && _a !== void 0 ? _a : null;
  }
  accessId(data) {
    const get2 = this.props.idAccessor || "id";
    const id = access(data, get2);
    if (!id)
      throw new Error("Data must contain an 'id' property or props.idAccessor must return a string");
    return id;
  }
  /* Node Access */
  get firstNode() {
    var _a;
    return (_a = this.visibleNodes[0]) !== null && _a !== void 0 ? _a : null;
  }
  get lastNode() {
    var _a;
    return (_a = this.visibleNodes[this.visibleNodes.length - 1]) !== null && _a !== void 0 ? _a : null;
  }
  get focusedNode() {
    var _a;
    return (_a = this.get(this.state.nodes.focus.id)) !== null && _a !== void 0 ? _a : null;
  }
  get mostRecentNode() {
    var _a;
    return (_a = this.get(this.state.nodes.selection.mostRecent)) !== null && _a !== void 0 ? _a : null;
  }
  get nextNode() {
    const index = this.indexOf(this.focusedNode);
    if (index === null)
      return null;
    else
      return this.at(index + 1);
  }
  get prevNode() {
    const index = this.indexOf(this.focusedNode);
    if (index === null)
      return null;
    else
      return this.at(index - 1);
  }
  get(id) {
    if (!id)
      return null;
    if (id in this.idToIndex)
      return this.visibleNodes[this.idToIndex[id]] || null;
    else
      return null;
  }
  at(index) {
    return this.visibleNodes[index] || null;
  }
  nodesBetween(startId, endId) {
    var _a;
    if (startId === null || endId === null)
      return [];
    const index1 = (_a = this.indexOf(startId)) !== null && _a !== void 0 ? _a : 0;
    const index2 = this.indexOf(endId);
    if (index2 === null)
      return [];
    const start = Math.min(index1, index2);
    const end = Math.max(index1, index2);
    return this.visibleNodes.slice(start, end + 1);
  }
  indexOf(id) {
    const key = identifyNull(id);
    if (!key)
      return null;
    return this.idToIndex[key];
  }
  /* Data Operations */
  get editingId() {
    return this.state.nodes.edit.id;
  }
  createInternal() {
    return this.create({ type: "internal" });
  }
  createLeaf() {
    return this.create({ type: "leaf" });
  }
  create(opts = {}) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      const parentId = opts.parentId === void 0 ? getInsertParentId(this) : opts.parentId;
      const index = (_a = opts.index) !== null && _a !== void 0 ? _a : getInsertIndex(this);
      const type = (_b = opts.type) !== null && _b !== void 0 ? _b : "leaf";
      const data = yield safeRun2(this.props.onCreate, {
        type,
        parentId,
        index,
        parentNode: this.get(parentId)
      });
      if (data) {
        this.focus(data);
        setTimeout(() => {
          this.edit(data).then(() => {
            this.select(data);
            this.activate(data);
          });
        });
      }
    });
  }
  delete(node) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!node)
        return;
      const idents = Array.isArray(node) ? node : [node];
      const ids = idents.map(identify2);
      const nodes = ids.map((id) => this.get(id)).filter((n) => !!n);
      yield safeRun2(this.props.onDelete, { nodes, ids });
    });
  }
  edit(node) {
    const id = identify2(node);
    this.resolveEdit({ cancelled: true });
    this.scrollTo(id);
    this.dispatch(edit(id));
    return new Promise((resolve) => {
      _TreeApi.editPromise = resolve;
    });
  }
  submit(identity, value) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!identity)
        return;
      const id = identify2(identity);
      yield safeRun2(this.props.onRename, {
        id,
        name: value,
        node: this.get(id)
      });
      this.dispatch(edit(null));
      this.resolveEdit({ cancelled: false, value });
      setTimeout(() => this.onFocus());
    });
  }
  reset() {
    this.dispatch(edit(null));
    this.resolveEdit({ cancelled: true });
    setTimeout(() => this.onFocus());
  }
  activate(id) {
    const node = this.get(identifyNull2(id));
    if (!node)
      return;
    safeRun2(this.props.onActivate, node);
  }
  resolveEdit(value) {
    const resolve = _TreeApi.editPromise;
    if (resolve)
      resolve(value);
    _TreeApi.editPromise = null;
  }
  /* Focus and Selection */
  get selectedIds() {
    return this.state.nodes.selection.ids;
  }
  get selectedNodes() {
    let nodes = [];
    for (let id of Array.from(this.selectedIds)) {
      const node = this.get(id);
      if (node)
        nodes.push(node);
    }
    return nodes;
  }
  focus(node, opts = {}) {
    if (!node)
      return;
    if (this.props.selectionFollowsFocus) {
      this.select(node);
    } else {
      this.dispatch(focus(identify2(node)));
      if (opts.scroll !== false)
        this.scrollTo(node);
      if (this.focusedNode)
        safeRun2(this.props.onFocus, this.focusedNode);
    }
  }
  pageUp() {
    var _a, _b;
    const start = this.visibleStartIndex;
    const stop = this.visibleStopIndex;
    const page = stop - start;
    let index = (_b = (_a = this.focusedNode) === null || _a === void 0 ? void 0 : _a.rowIndex) !== null && _b !== void 0 ? _b : 0;
    if (index > start) {
      index = start;
    } else {
      index = Math.max(start - page, 0);
    }
    this.focus(this.at(index));
  }
  pageDown() {
    var _a, _b;
    const start = this.visibleStartIndex;
    const stop = this.visibleStopIndex;
    const page = stop - start;
    let index = (_b = (_a = this.focusedNode) === null || _a === void 0 ? void 0 : _a.rowIndex) !== null && _b !== void 0 ? _b : 0;
    if (index < stop) {
      index = stop;
    } else {
      index = Math.min(index + page, this.visibleNodes.length - 1);
    }
    this.focus(this.at(index));
  }
  select(node, opts = {}) {
    if (!node)
      return;
    const changeFocus = opts.focus !== false;
    const id = identify2(node);
    if (changeFocus)
      this.dispatch(focus(id));
    this.dispatch(actions2.only(id));
    this.dispatch(actions2.anchor(id));
    this.dispatch(actions2.mostRecent(id));
    this.scrollTo(id, opts.align);
    if (this.focusedNode && changeFocus) {
      safeRun2(this.props.onFocus, this.focusedNode);
    }
    safeRun2(this.props.onSelect, this.selectedNodes);
  }
  deselect(node) {
    if (!node)
      return;
    const id = identify2(node);
    this.dispatch(actions2.remove(id));
  }
  selectMulti(identity) {
    const node = this.get(identifyNull2(identity));
    if (!node)
      return;
    this.dispatch(focus(node.id));
    this.dispatch(actions2.add(node.id));
    this.dispatch(actions2.anchor(node.id));
    this.dispatch(actions2.mostRecent(node.id));
    this.scrollTo(node);
    if (this.focusedNode)
      safeRun2(this.props.onFocus, this.focusedNode);
    safeRun2(this.props.onSelect, this.selectedNodes);
  }
  selectContiguous(identity) {
    if (!identity)
      return;
    const id = identify2(identity);
    const { anchor, mostRecent } = this.state.nodes.selection;
    this.dispatch(focus(id));
    this.dispatch(actions2.remove(this.nodesBetween(anchor, mostRecent)));
    this.dispatch(actions2.add(this.nodesBetween(anchor, identifyNull2(id))));
    this.dispatch(actions2.mostRecent(id));
    this.scrollTo(id);
    if (this.focusedNode)
      safeRun2(this.props.onFocus, this.focusedNode);
    safeRun2(this.props.onSelect, this.selectedNodes);
  }
  deselectAll() {
    this.setSelection({ ids: [], anchor: null, mostRecent: null });
    safeRun2(this.props.onSelect, this.selectedNodes);
  }
  selectAll() {
    var _a;
    this.setSelection({
      ids: Object.keys(this.idToIndex),
      anchor: this.firstNode,
      mostRecent: this.lastNode
    });
    this.dispatch(focus((_a = this.lastNode) === null || _a === void 0 ? void 0 : _a.id));
    if (this.focusedNode)
      safeRun2(this.props.onFocus, this.focusedNode);
    safeRun2(this.props.onSelect, this.selectedNodes);
  }
  setSelection(args) {
    var _a;
    const ids = new Set((_a = args.ids) === null || _a === void 0 ? void 0 : _a.map(identify2));
    const anchor = identifyNull2(args.anchor);
    const mostRecent = identifyNull2(args.mostRecent);
    this.dispatch(actions2.set({ ids, anchor, mostRecent }));
    safeRun2(this.props.onSelect, this.selectedNodes);
  }
  /* Drag and Drop */
  get cursorParentId() {
    const { cursor } = this.state.dnd;
    switch (cursor.type) {
      case "highlight":
        return cursor.id;
      default:
        return null;
    }
  }
  get cursorOverFolder() {
    return this.state.dnd.cursor.type === "highlight";
  }
  get dragNodes() {
    return this.state.dnd.dragIds.map((id) => this.get(id)).filter((n) => !!n);
  }
  get dragNode() {
    return this.get(this.state.nodes.drag.id);
  }
  get dragDestinationParent() {
    return this.get(this.state.nodes.drag.destinationParentId);
  }
  get dragDestinationIndex() {
    return this.state.nodes.drag.destinationIndex;
  }
  canDrop() {
    var _a;
    if (this.isFiltered)
      return false;
    const parentNode = (_a = this.get(this.state.dnd.parentId)) !== null && _a !== void 0 ? _a : this.root;
    const dragNodes = this.dragNodes;
    const isDisabled = this.props.disableDrop;
    for (const drag of dragNodes) {
      if (!drag)
        return false;
      if (!parentNode)
        return false;
      if (drag.isInternal && isDescendant(parentNode, drag))
        return false;
    }
    if (typeof isDisabled == "function") {
      return !isDisabled({
        parentNode,
        dragNodes: this.dragNodes,
        index: this.state.dnd.index || 0
      });
    } else if (typeof isDisabled == "string") {
      return !parentNode.data[isDisabled];
    } else if (typeof isDisabled === "boolean") {
      return !isDisabled;
    } else {
      return true;
    }
  }
  hideCursor() {
    this.dispatch(actions3.cursor({ type: "none" }));
  }
  showCursor(cursor) {
    this.dispatch(actions3.cursor(cursor));
  }
  /* Visibility */
  open(identity) {
    const id = identifyNull2(identity);
    if (!id)
      return;
    if (this.isOpen(id))
      return;
    this.dispatch(actions.open(id, this.isFiltered));
    safeRun2(this.props.onToggle, id);
  }
  close(identity) {
    const id = identifyNull2(identity);
    if (!id)
      return;
    if (!this.isOpen(id))
      return;
    this.dispatch(actions.close(id, this.isFiltered));
    safeRun2(this.props.onToggle, id);
  }
  toggle(identity) {
    const id = identifyNull2(identity);
    if (!id)
      return;
    return this.isOpen(id) ? this.close(id) : this.open(id);
  }
  openParents(identity) {
    const id = identifyNull2(identity);
    if (!id)
      return;
    const node = dfs(this.root, id);
    let parent = node === null || node === void 0 ? void 0 : node.parent;
    while (parent) {
      this.open(parent.id);
      parent = parent.parent;
    }
  }
  openSiblings(node) {
    const parent = node.parent;
    if (!parent) {
      this.toggle(node.id);
    } else if (parent.children) {
      const isOpen = node.isOpen;
      for (let sibling of parent.children) {
        if (sibling.isInternal) {
          isOpen ? this.close(sibling.id) : this.open(sibling.id);
        }
      }
      this.scrollTo(this.focusedNode);
    }
  }
  openAll() {
    walk(this.root, (node) => {
      if (node.isInternal)
        node.open();
    });
  }
  closeAll() {
    walk(this.root, (node) => {
      if (node.isInternal)
        node.close();
    });
  }
  /* Scrolling */
  scrollTo(identity, align = "smart") {
    if (!identity)
      return;
    const id = identify2(identity);
    this.openParents(id);
    return waitFor(() => id in this.idToIndex).then(() => {
      var _a;
      const index = this.idToIndex[id];
      if (index === void 0)
        return;
      (_a = this.list.current) === null || _a === void 0 ? void 0 : _a.scrollToItem(index, align);
    }).catch(() => {
    });
  }
  /* State Checks */
  get isEditing() {
    return this.state.nodes.edit.id !== null;
  }
  get isFiltered() {
    var _a;
    return !!((_a = this.props.searchTerm) === null || _a === void 0 ? void 0 : _a.trim());
  }
  get hasFocus() {
    return this.state.nodes.focus.treeFocused;
  }
  get hasNoSelection() {
    return this.state.nodes.selection.ids.size === 0;
  }
  get hasOneSelection() {
    return this.state.nodes.selection.ids.size === 1;
  }
  get hasMultipleSelections() {
    return this.state.nodes.selection.ids.size > 1;
  }
  isSelected(id) {
    if (!id)
      return false;
    return this.state.nodes.selection.ids.has(id);
  }
  isOpen(id) {
    var _a, _b, _c;
    if (!id)
      return false;
    if (id === ROOT_ID)
      return true;
    const def = (_a = this.props.openByDefault) !== null && _a !== void 0 ? _a : true;
    if (this.isFiltered) {
      return (_b = this.state.nodes.open.filtered[id]) !== null && _b !== void 0 ? _b : true;
    } else {
      return (_c = this.state.nodes.open.unfiltered[id]) !== null && _c !== void 0 ? _c : def;
    }
  }
  isEditable(data) {
    var _a;
    const check = this.props.disableEdit || (() => false);
    return (_a = !access(data, check)) !== null && _a !== void 0 ? _a : true;
  }
  isDraggable(data) {
    var _a;
    const check = this.props.disableDrag || (() => false);
    return (_a = !access(data, check)) !== null && _a !== void 0 ? _a : true;
  }
  isDragging(node) {
    const id = identifyNull2(node);
    if (!id)
      return false;
    return this.state.nodes.drag.id === id;
  }
  isFocused(id) {
    return this.hasFocus && this.state.nodes.focus.id === id;
  }
  isMatch(node) {
    return this.matchFn(node);
  }
  willReceiveDrop(node) {
    const id = identifyNull2(node);
    if (!id)
      return false;
    const { destinationParentId, destinationIndex } = this.state.nodes.drag;
    return id === destinationParentId && destinationIndex === null;
  }
  /* Tree Event Handlers */
  onFocus() {
    const node = this.focusedNode || this.firstNode;
    if (node)
      this.dispatch(focus(node.id));
  }
  onBlur() {
    this.dispatch(treeBlur());
  }
  onItemsRendered(args) {
    this.visibleStartIndex = args.visibleStartIndex;
    this.visibleStopIndex = args.visibleStopIndex;
  }
  /* Get Renderers */
  get renderContainer() {
    return this.props.renderContainer || DefaultContainer;
  }
  get renderRow() {
    return this.props.renderRow || DefaultRow;
  }
  get renderNode() {
    return this.props.children || DefaultNode;
  }
  get renderDragPreview() {
    return this.props.renderDragPreview || DefaultDragPreview;
  }
  get renderCursor() {
    return this.props.renderCursor || DefaultCursor;
  }
};

// node_modules/redux/dist/redux.mjs
var $$observable2 = (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
var symbol_observable_default = $$observable2;
var randomString3 = () => Math.random().toString(36).substring(7).split("").join(".");
var ActionTypes2 = {
  INIT: `@@redux/INIT${randomString3()}`,
  REPLACE: `@@redux/REPLACE${randomString3()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString3()}`
};
var actionTypes_default = ActionTypes2;
function isPlainObject3(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null;
}
function miniKindOf2(val) {
  if (val === void 0)
    return "undefined";
  if (val === null)
    return "null";
  const type = typeof val;
  switch (type) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function": {
      return type;
    }
  }
  if (Array.isArray(val))
    return "array";
  if (isDate2(val))
    return "date";
  if (isError2(val))
    return "error";
  const constructorName = ctorName2(val);
  switch (constructorName) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return constructorName;
  }
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function ctorName2(val) {
  return typeof val.constructor === "function" ? val.constructor.name : null;
}
function isError2(val) {
  return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
}
function isDate2(val) {
  if (val instanceof Date)
    return true;
  return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
}
function kindOf2(val) {
  let typeOfVal = typeof val;
  if (true) {
    typeOfVal = miniKindOf2(val);
  }
  return typeOfVal;
}
function createStore2(reducer7, preloadedState, enhancer) {
  if (typeof reducer7 !== "function") {
    throw new Error(false ? formatProdErrorMessage(2) : `Expected the root reducer to be a function. Instead, received: '${kindOf2(reducer7)}'`);
  }
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(false ? formatProdErrorMessage(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(false ? formatProdErrorMessage(1) : `Expected the enhancer to be a function. Instead, received: '${kindOf2(enhancer)}'`);
    }
    return enhancer(createStore2)(reducer7, preloadedState);
  }
  let currentReducer = reducer7;
  let currentState = preloadedState;
  let currentListeners = /* @__PURE__ */ new Map();
  let nextListeners = currentListeners;
  let listenerIdCounter = 0;
  let isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = /* @__PURE__ */ new Map();
      currentListeners.forEach((listener, key) => {
        nextListeners.set(key, listener);
      });
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(false ? formatProdErrorMessage(4) : `Expected the listener to be a function. Instead, received: '${kindOf2(listener)}'`);
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    }
    let isSubscribed = true;
    ensureCanMutateNextListeners();
    const listenerId = listenerIdCounter++;
    nextListeners.set(listenerId, listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(false ? formatProdErrorMessage(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      nextListeners.delete(listenerId);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject3(action)) {
      throw new Error(false ? formatProdErrorMessage(7) : `Actions must be plain objects. Instead, the actual type was: '${kindOf2(action)}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`);
    }
    if (typeof action.type === "undefined") {
      throw new Error(false ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    }
    if (typeof action.type !== "string") {
      throw new Error(false ? formatProdErrorMessage(17) : `Action "type" property must be a string. Instead, the actual type was: '${kindOf2(action.type)}'. Value was: '${action.type}' (stringified)`);
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(9) : "Reducers may not dispatch actions.");
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    const listeners = currentListeners = nextListeners;
    listeners.forEach((listener) => {
      listener();
    });
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(false ? formatProdErrorMessage(10) : `Expected the nextReducer to be a function. Instead, received: '${kindOf2(nextReducer)}`);
    }
    currentReducer = nextReducer;
    dispatch({
      type: actionTypes_default.REPLACE
    });
  }
  function observable() {
    const outerSubscribe = subscribe;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(false ? formatProdErrorMessage(11) : `Expected the observer to be an object. Instead, received: '${kindOf2(observer)}'`);
        }
        function observeState() {
          const observerAsObserver = observer;
          if (observerAsObserver.next) {
            observerAsObserver.next(getState());
          }
        }
        observeState();
        const unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      },
      [symbol_observable_default]() {
        return this;
      }
    };
  }
  dispatch({
    type: actionTypes_default.INIT
  });
  const store = {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [symbol_observable_default]: observable
  };
  return store;
}
function warning(message) {
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  try {
    throw new Error(message);
  } catch (e) {
  }
}
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  const reducerKeys = Object.keys(reducers);
  const argumentName = action && action.type === actionTypes_default.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (reducerKeys.length === 0) {
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  }
  if (!isPlainObject3(inputState)) {
    return `The ${argumentName} has unexpected type of "${kindOf2(inputState)}". Expected argument to be an object with the following keys: "${reducerKeys.join('", "')}"`;
  }
  const unexpectedKeys = Object.keys(inputState).filter((key) => !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key]);
  unexpectedKeys.forEach((key) => {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === actionTypes_default.REPLACE)
    return;
  if (unexpectedKeys.length > 0) {
    return `Unexpected ${unexpectedKeys.length > 1 ? "keys" : "key"} "${unexpectedKeys.join('", "')}" found in ${argumentName}. Expected to find one of the known reducer keys instead: "${reducerKeys.join('", "')}". Unexpected keys will be ignored.`;
  }
}
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach((key) => {
    const reducer7 = reducers[key];
    const initialState4 = reducer7(void 0, {
      type: actionTypes_default.INIT
    });
    if (typeof initialState4 === "undefined") {
      throw new Error(false ? formatProdErrorMessage(12) : `The slice reducer for key "${key}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`);
    }
    if (typeof reducer7(void 0, {
      type: actionTypes_default.PROBE_UNKNOWN_ACTION()
    }) === "undefined") {
      throw new Error(false ? formatProdErrorMessage(13) : `The slice reducer for key "${key}" returned undefined when probed with a random type. Don't try to handle '${actionTypes_default.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`);
    }
  });
}
function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (true) {
      if (typeof reducers[key] === "undefined") {
        warning(`No reducer provided for key "${key}"`);
      }
    }
    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);
  let unexpectedKeyCache;
  if (true) {
    unexpectedKeyCache = {};
  }
  let shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    if (true) {
      const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning(warningMessage);
      }
    }
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer7 = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer7(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        const actionType = action && action.type;
        throw new Error(false ? formatProdErrorMessage(14) : `When called with an action of type ${actionType ? `"${String(actionType)}"` : "(unknown type)"}, the slice reducer for key "${key}" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.`);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

// node_modules/react-arborist/dist/module/state/drag-slice.js
function reducer6(state = initialState().nodes.drag, action) {
  switch (action.type) {
    case "DND_DRAG_START":
      return Object.assign(Object.assign({}, state), { id: action.id, selectedIds: action.dragIds });
    case "DND_DRAG_END":
      return Object.assign(Object.assign({}, state), { id: null, destinationParentId: null, destinationIndex: null, selectedIds: [] });
    case "DND_HOVERING":
      if (action.parentId !== state.destinationParentId || action.index != state.destinationIndex) {
        return Object.assign(Object.assign({}, state), { destinationParentId: action.parentId, destinationIndex: action.index });
      } else {
        return state;
      }
    default:
      return state;
  }
}

// node_modules/react-arborist/dist/module/state/root-reducer.js
var rootReducer = combineReducers({
  nodes: combineReducers({
    focus: reducer2,
    edit: reducer,
    open: reducer3,
    selection: reducer4,
    drag: reducer6
  }),
  dnd: reducer5
});

// node_modules/react-arborist/dist/module/components/provider.js
var SERVER_STATE = initialState();
function TreeProvider({ treeProps, imperativeHandle, children }) {
  const list = (0, import_react32.useRef)(null);
  const listEl = (0, import_react32.useRef)(null);
  const store = (0, import_react32.useRef)(
    // @ts-ignore
    createStore2(rootReducer, initialState(treeProps))
  );
  const state = (0, import_shim.useSyncExternalStore)(store.current.subscribe, store.current.getState, () => SERVER_STATE);
  const api = (0, import_react32.useMemo)(() => {
    return new TreeApi(store.current, treeProps, list, listEl);
  }, []);
  const updateCount = (0, import_react32.useRef)(0);
  (0, import_react32.useMemo)(() => {
    updateCount.current += 1;
    api.update(treeProps);
  }, [...Object.values(treeProps), state.nodes.open]);
  (0, import_react32.useImperativeHandle)(imperativeHandle, () => api);
  (0, import_react32.useEffect)(() => {
    if (api.props.selection) {
      api.select(api.props.selection, { focus: false });
    } else {
      api.deselectAll();
    }
  }, [api.props.selection]);
  (0, import_react32.useEffect)(() => {
    if (!api.props.searchTerm) {
      store.current.dispatch(actions.clear(true));
    }
  }, [api.props.searchTerm]);
  return (0, import_jsx_runtime13.jsx)(TreeApiContext.Provider, { value: api, children: (0, import_jsx_runtime13.jsx)(DataUpdatesContext.Provider, { value: updateCount.current, children: (0, import_jsx_runtime13.jsx)(NodesContext.Provider, { value: state.nodes, children: (0, import_jsx_runtime13.jsx)(DndContext.Provider, { value: state.dnd, children: (0, import_jsx_runtime13.jsx)(DndProvider, Object.assign({ backend: HTML5Backend, options: { rootElement: api.props.dndRootElement || void 0 } }, treeProps.dndManager && { manager: treeProps.dndManager }, { children })) }) }) }) });
}

// node_modules/react-arborist/dist/module/dnd/outer-drop-hook.js
function useOuterDrop() {
  const tree = useTreeApi();
  const [, drop] = useDrop(() => ({
    accept: "NODE",
    canDrop: (_item, m) => {
      if (!m.isOver({ shallow: true }))
        return false;
      return tree.canDrop();
    },
    hover: (_item, m) => {
      if (!m.isOver({ shallow: true }))
        return;
      const offset = m.getClientOffset();
      if (!tree.listEl.current || !offset)
        return;
      const { cursor, drop: drop2 } = computeDrop({
        element: tree.listEl.current,
        offset,
        indent: tree.indent,
        node: null,
        prevNode: tree.visibleNodes[tree.visibleNodes.length - 1],
        nextNode: null
      });
      if (drop2)
        tree.dispatch(actions3.hovering(drop2.parentId, drop2.index));
      if (m.canDrop()) {
        if (cursor)
          tree.showCursor(cursor);
      } else {
        tree.hideCursor();
      }
    }
  }), [tree]);
  drop(tree.listEl);
}

// node_modules/react-arborist/dist/module/components/outer-drop.js
function OuterDrop(props) {
  useOuterDrop();
  return props.children;
}

// node_modules/react-arborist/dist/module/components/tree-container.js
var import_jsx_runtime14 = __toESM(require_jsx_runtime());
function TreeContainer() {
  const tree = useTreeApi();
  const Container = tree.props.renderContainer || DefaultContainer;
  return (0, import_jsx_runtime14.jsx)(import_jsx_runtime14.Fragment, { children: (0, import_jsx_runtime14.jsx)(Container, {}) });
}

// node_modules/react-arborist/dist/module/components/drag-preview-container.js
var import_jsx_runtime15 = __toESM(require_jsx_runtime());
function DragPreviewContainer() {
  const tree = useTreeApi();
  const { offset, mouse, item, isDragging } = useDragLayer((m) => {
    return {
      offset: m.getSourceClientOffset(),
      mouse: m.getClientOffset(),
      item: m.getItem(),
      isDragging: m.isDragging()
    };
  });
  const DragPreview = tree.props.renderDragPreview || DefaultDragPreview;
  return (0, import_jsx_runtime15.jsx)(DragPreview, { offset, mouse, id: (item === null || item === void 0 ? void 0 : item.id) || null, dragIds: (item === null || item === void 0 ? void 0 : item.dragIds) || [], isDragging });
}

// node_modules/react-arborist/dist/module/hooks/use-simple-tree.js
var import_react33 = __toESM(require_react());

// node_modules/react-arborist/dist/module/data/simple-tree.js
var SimpleTree = class {
  constructor(data) {
    this.root = createRoot2(data);
  }
  get data() {
    var _a, _b;
    return (_b = (_a = this.root.children) === null || _a === void 0 ? void 0 : _a.map((node) => node.data)) !== null && _b !== void 0 ? _b : [];
  }
  create(args) {
    const parent = args.parentId ? this.find(args.parentId) : this.root;
    if (!parent)
      return null;
    parent.addChild(args.data, args.index);
  }
  move(args) {
    const src = this.find(args.id);
    const parent = args.parentId ? this.find(args.parentId) : this.root;
    if (!src || !parent)
      return;
    parent.addChild(src.data, args.index);
    src.drop();
  }
  update(args) {
    const node = this.find(args.id);
    if (node)
      node.update(args.changes);
  }
  drop(args) {
    const node = this.find(args.id);
    if (node)
      node.drop();
  }
  find(id, node = this.root) {
    if (!node)
      return null;
    if (node.id === id)
      return node;
    if (node.children) {
      for (let child of node.children) {
        const found = this.find(id, child);
        if (found)
          return found;
      }
      return null;
    }
    return null;
  }
};
function createRoot2(data) {
  const root = new SimpleNode({ id: "ROOT" }, null);
  root.children = data.map((d) => createNode(d, root));
  return root;
}
function createNode(data, parent) {
  const node = new SimpleNode(data, parent);
  if (data.children)
    node.children = data.children.map((d) => createNode(d, node));
  return node;
}
var SimpleNode = class {
  constructor(data, parent) {
    this.data = data;
    this.parent = parent;
    this.id = data.id;
  }
  hasParent() {
    return !!this.parent;
  }
  get childIndex() {
    return this.hasParent() ? this.parent.children.indexOf(this) : -1;
  }
  addChild(data, index) {
    var _a, _b;
    const node = createNode(data, this);
    this.children = (_a = this.children) !== null && _a !== void 0 ? _a : [];
    this.children.splice(index, 0, node);
    this.data.children = (_b = this.data.children) !== null && _b !== void 0 ? _b : [];
    this.data.children.splice(index, 0, data);
  }
  removeChild(index) {
    var _a, _b;
    (_a = this.children) === null || _a === void 0 ? void 0 : _a.splice(index, 1);
    (_b = this.data.children) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
  }
  update(changes) {
    if (this.hasParent()) {
      const i = this.childIndex;
      this.parent.addChild(Object.assign(Object.assign({}, this.data), changes), i);
      this.drop();
    }
  }
  drop() {
    if (this.hasParent())
      this.parent.removeChild(this.childIndex);
  }
};

// node_modules/react-arborist/dist/module/hooks/use-simple-tree.js
var nextId = 0;
function useSimpleTree(initialData) {
  const [data, setData] = (0, import_react33.useState)(initialData);
  const tree = (0, import_react33.useMemo)(() => new SimpleTree(data), [data]);
  const onMove = (args) => {
    for (const id of args.dragIds) {
      tree.move({ id, parentId: args.parentId, index: args.index });
    }
    setData(tree.data);
  };
  const onRename = ({ name, id }) => {
    tree.update({ id, changes: { name } });
    setData(tree.data);
  };
  const onCreate = ({ parentId, index, type }) => {
    const data2 = { id: `simple-tree-id-${nextId++}`, name: "" };
    if (type === "internal")
      data2.children = [];
    tree.create({ parentId, index, data: data2 });
    setData(tree.data);
    return data2;
  };
  const onDelete = (args) => {
    args.ids.forEach((id) => tree.drop({ id }));
    setData(tree.data);
  };
  const controller = { onMove, onRename, onCreate, onDelete };
  return [data, controller];
}

// node_modules/react-arborist/dist/module/hooks/use-validated-props.js
function useValidatedProps(props) {
  if (props.initialData && props.data) {
    throw new Error(`React Arborist Tree => Provide either a data or initialData prop, but not both.`);
  }
  if (props.initialData && (props.onCreate || props.onDelete || props.onMove || props.onRename)) {
    throw new Error(`React Arborist Tree => You passed the initialData prop along with a data handler.
Use the data prop if you want to provide your own handlers.`);
  }
  if (props.initialData) {
    const [data, controller] = useSimpleTree(props.initialData);
    return Object.assign(Object.assign(Object.assign({}, props), controller), { data });
  } else {
    return props;
  }
}

// node_modules/react-arborist/dist/module/components/tree.js
function TreeComponent(props, ref) {
  const treeProps = useValidatedProps(props);
  return (0, import_jsx_runtime16.jsxs)(TreeProvider, { treeProps, imperativeHandle: ref, children: [(0, import_jsx_runtime16.jsx)(OuterDrop, { children: (0, import_jsx_runtime16.jsx)(TreeContainer, {}) }), (0, import_jsx_runtime16.jsx)(DragPreviewContainer, {})] });
}
var Tree = (0, import_react34.forwardRef)(TreeComponent);
export {
  NodeApi,
  SimpleTree,
  Tree,
  TreeApi,
  useSimpleTree
};
/*! Bundled license information:

use-sync-external-store/cjs/use-sync-external-store-shim.development.js:
  (**
   * @license React
   * use-sync-external-store-shim.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-is/cjs/react-is.development.js:
  (** @license React v16.13.1
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=react-arborist.js.map
