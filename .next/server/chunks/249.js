"use strict";
exports.id = 249;
exports.ids = [249];
exports.modules = {

/***/ 249:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Eu": () => (/* binding */ useAuthContext),
/* harmony export */   "Ho": () => (/* binding */ AuthProvider),
/* harmony export */   "Vo": () => (/* binding */ AuthContext),
/* harmony export */   "he": () => (/* binding */ AuthConsumer)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var src_services_authService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3497);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src_services_authService__WEBPACK_IMPORTED_MODULE_3__]);
src_services_authService__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




const HANDLERS = {
    INITIALIZE: "INITIALIZE",
    SIGN_IN: "SIGN_IN",
    SIGN_OUT: "SIGN_OUT"
};
const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
};
const handlers = {
    [HANDLERS.INITIALIZE]: (state, action)=>{
        const user = action.payload;
        return {
            ...state,
            ...// if payload (user) is provided, then is authenticated
            user ? {
                isAuthenticated: true,
                isLoading: false,
                user
            } : {
                isLoading: false
            }
        };
    },
    [HANDLERS.SIGN_IN]: (state, action)=>{
        const user = action.payload;
        return {
            ...state,
            isAuthenticated: true,
            user
        };
    },
    [HANDLERS.SIGN_OUT]: (state)=>{
        return {
            ...state,
            isAuthenticated: false,
            user: null
        };
    }
};
const reducer = (state, action)=>handlers[action.type] ? handlers[action.type](state, action) : state;
// The role of this context is to propagate authentication state through the App tree.
const AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({
    undefined
});
const AuthProvider = (props)=>{
    const { children  } = props;
    const [state, dispatch] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useReducer)(reducer, initialState);
    const initialized = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
    const initialize = async ()=>{
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (initialized.current) {
            return;
        }
        initialized.current = true;
        let isAuthenticated = false;
        try {
            isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";
        } catch (err) {
            console.error(err);
        }
        if (isAuthenticated) {
            const user = {
                id: "5e86809283e28b96d2d38537",
                avatar: "/assets/avatars/avatar-anika-visser.png",
                name: "Anika Visser",
                email: "anika.visser@devias.io"
            };
            dispatch({
                type: HANDLERS.INITIALIZE,
                payload: user
            });
        } else {
            dispatch({
                type: HANDLERS.INITIALIZE
            });
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        initialize();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const skip = ()=>{
        try {
            window.sessionStorage.setItem("authenticated", "true");
        } catch (err) {
            console.error(err);
        }
        const user = {
            id: "5e86809283e28b96d2d38537",
            avatar: "/assets/avatars/avatar-anika-visser.png",
            name: "Anika Visser",
            email: "anika.visser@devias.io"
        };
        dispatch({
            type: HANDLERS.SIGN_IN,
            payload: user
        });
    };
    const signIn = async (email, password)=>{
        const response = await loginService(email, password);
        if (!response.status) {
            throw new Error("Please check your email and password");
        }
        try {
            window.sessionStorage.setItem("authenticated", "true");
        } catch (err) {
            console.error(err);
        }
        const user = {
            id: "",
            avatar: "/assets/avatars/avatar-anika-visser.png",
            name: "Anika Visser",
            email: "anika.visser@devias.io"
        };
        dispatch({
            type: HANDLERS.SIGN_IN,
            payload: user
        });
    };
    const signUp = async (email, name, password)=>{
        throw new Error("Sign up is not implemented");
    };
    const signOut = ()=>{
        dispatch({
            type: HANDLERS.SIGN_OUT
        });
    };
    const loginService = async (email, passoword)=>{
        try {
            const response = await (0,src_services_authService__WEBPACK_IMPORTED_MODULE_3__/* .login */ .x)(email, passoword);
            return {
                status: true,
                response
            };
        } catch (err) {
            return {
                status: false,
                error: err.response.data.error
            };
        }
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(AuthContext.Provider, {
        value: {
            ...state,
            skip,
            signIn,
            signUp,
            signOut
        },
        children: children
    });
};
AuthProvider.propTypes = {
    children: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().node)
};
const AuthConsumer = AuthContext.Consumer;
const useAuthContext = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3497:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x": () => (/* binding */ login)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);
axios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

const API_URL = "http://localhost:3000/api";
const login = async (email, password)=>{
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].post(`${API_URL}/auth/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;