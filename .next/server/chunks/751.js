"use strict";
exports.id = 751;
exports.ids = [751];
exports.modules = {

/***/ 2377:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": () => (/* binding */ Scrollbar)
/* harmony export */ });
/* harmony import */ var simplebar_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4172);
/* harmony import */ var simplebar_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(simplebar_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8442);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__);


const Scrollbar = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__.styled)((simplebar_react__WEBPACK_IMPORTED_MODULE_0___default()))``;


/***/ }),

/***/ 5642:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ AuthGuard)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var src_contexts_auth_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(249);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src_contexts_auth_context__WEBPACK_IMPORTED_MODULE_3__]);
src_contexts_auth_context__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




const AuthGuard = (props)=>{
    const { children  } = props;
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
    const { isAuthenticated  } = (0,src_contexts_auth_context__WEBPACK_IMPORTED_MODULE_3__/* .useAuthContext */ .Eu)();
    const ignore = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    const [checked, setChecked] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    // Only do authentication check on component mount.
    // This flow allows you to manually redirect the user after sign-out, otherwise this will be
    // triggered and will automatically redirect to sign-in page.
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        if (!router.isReady) {
            return;
        }
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (ignore.current) {
            return;
        }
        ignore.current = true;
        if (!isAuthenticated) {
            console.log("Not authenticated, redirecting");
            router.replace({
                pathname: "/auth/login",
                query: router.asPath !== "/" ? {
                    continueUrl: router.asPath
                } : undefined
            }).catch(console.error);
        } else {
            setChecked(true);
        }
    }, [
        router.isReady
    ]);
    if (!checked) {
        return null;
    }
    // If got here, it means that the redirect did not occur, and that tells us that the user is
    // authenticated / authorized.
    return children;
};
AuthGuard.propTypes = {
    children: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().node)
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9010:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "I": () => (/* binding */ withAuthGuard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var src_guards_auth_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5642);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src_guards_auth_guard__WEBPACK_IMPORTED_MODULE_1__]);
src_guards_auth_guard__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const withAuthGuard = (Component)=>(props)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(src_guards_auth_guard__WEBPACK_IMPORTED_MODULE_1__/* .AuthGuard */ .a, {
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                ...props
            })
        });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9797:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": () => (/* binding */ usePopover)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function usePopover() {
    const anchorRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const [open, setOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const handleOpen = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>{
        setOpen(true);
    }, []);
    const handleClose = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>{
        setOpen(false);
    }, []);
    const handleToggle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>{
        setOpen((prevState)=>!prevState);
    }, []);
    return {
        anchorRef,
        handleClose,
        handleOpen,
        handleToggle,
        open
    };
}


/***/ }),

/***/ 5392:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x": () => (/* binding */ AccountPopover)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9332);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var src_hooks_use_auth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2662);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src_hooks_use_auth__WEBPACK_IMPORTED_MODULE_5__]);
src_hooks_use_auth__WEBPACK_IMPORTED_MODULE_5__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






const AccountPopover = (props)=>{
    const { anchorEl , onClose , open  } = props;
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const auth = (0,src_hooks_use_auth__WEBPACK_IMPORTED_MODULE_5__/* .useAuth */ .a)();
    const handleSignOut = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{
        onClose?.();
        auth.signOut();
        router.push("/auth/login");
    }, [
        onClose,
        auth,
        router
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Popover, {
        anchorEl: anchorEl,
        anchorOrigin: {
            horizontal: "left",
            vertical: "bottom"
        },
        onClose: onClose,
        open: open,
        PaperProps: {
            sx: {
                width: 200
            }
        },
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Box, {
                sx: {
                    py: 1.5,
                    px: 2
                },
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Typography, {
                        variant: "overline",
                        children: "Account"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Typography, {
                        color: "text.secondary",
                        variant: "body2",
                        children: "Anika Visser"
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Divider, {}),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.MenuList, {
                disablePadding: true,
                dense: true,
                sx: {
                    p: "8px",
                    "& > *": {
                        borderRadius: 1
                    }
                },
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.MenuItem, {
                    onClick: handleSignOut,
                    children: "Sign out"
                })
            })
        ]
    });
};
AccountPopover.propTypes = {
    anchorEl: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().any),
    onClose: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func),
    open: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool.isRequired)
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8336:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "e": () => (/* binding */ items)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_24_solid_ChartBarIcon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5123);
/* harmony import */ var _heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1950);
/* harmony import */ var _heroicons_react_24_solid_BuildingOfficeIcon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2990);
/* harmony import */ var _heroicons_react_24_solid_ArchiveBoxIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3445);
/* harmony import */ var _heroicons_react_24_solid_QueueListIcon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5627);
/* harmony import */ var _heroicons_react_24_solid_BuildingLibraryIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2119);
/* harmony import */ var _heroicons_react_24_solid_ListBulletIcon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(579);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_8__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_heroicons_react_24_solid_ChartBarIcon__WEBPACK_IMPORTED_MODULE_1__, _heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_2__, _heroicons_react_24_solid_BuildingOfficeIcon__WEBPACK_IMPORTED_MODULE_3__, _heroicons_react_24_solid_ArchiveBoxIcon__WEBPACK_IMPORTED_MODULE_4__, _heroicons_react_24_solid_QueueListIcon__WEBPACK_IMPORTED_MODULE_5__, _heroicons_react_24_solid_BuildingLibraryIcon__WEBPACK_IMPORTED_MODULE_6__, _heroicons_react_24_solid_ListBulletIcon__WEBPACK_IMPORTED_MODULE_7__]);
([_heroicons_react_24_solid_ChartBarIcon__WEBPACK_IMPORTED_MODULE_1__, _heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_2__, _heroicons_react_24_solid_BuildingOfficeIcon__WEBPACK_IMPORTED_MODULE_3__, _heroicons_react_24_solid_ArchiveBoxIcon__WEBPACK_IMPORTED_MODULE_4__, _heroicons_react_24_solid_QueueListIcon__WEBPACK_IMPORTED_MODULE_5__, _heroicons_react_24_solid_BuildingLibraryIcon__WEBPACK_IMPORTED_MODULE_6__, _heroicons_react_24_solid_ListBulletIcon__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);









const items = [
    {
        title: "Home",
        path: "/",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_ChartBarIcon__WEBPACK_IMPORTED_MODULE_1__["default"], {})
        })
    },
    {
        title: "Usuarios",
        path: "/customers",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_2__["default"], {})
        })
    },
    {
        title: "Plataformas",
        path: "/platforms",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_BuildingOfficeIcon__WEBPACK_IMPORTED_MODULE_3__["default"], {})
        })
    },
    {
        title: "Locales",
        path: "/shops",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_BuildingOfficeIcon__WEBPACK_IMPORTED_MODULE_3__["default"], {})
        })
    },
    {
        title: "Productos",
        path: "/products",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_ArchiveBoxIcon__WEBPACK_IMPORTED_MODULE_4__["default"], {})
        })
    },
    {
        title: "Listas",
        path: "/lists",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_QueueListIcon__WEBPACK_IMPORTED_MODULE_5__["default"], {})
        })
    },
    {
        title: "Ciudades",
        path: "/cities",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_BuildingLibraryIcon__WEBPACK_IMPORTED_MODULE_6__["default"], {})
        })
    },
    {
        title: "Pedidos",
        path: "/big-orders",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_ListBulletIcon__WEBPACK_IMPORTED_MODULE_7__["default"], {})
        })
    }
];

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4751:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9332);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8442);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var src_hocs_with_auth_guard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9010);
/* harmony import */ var _side_nav__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9826);
/* harmony import */ var _top_nav__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8683);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src_hocs_with_auth_guard__WEBPACK_IMPORTED_MODULE_4__, _side_nav__WEBPACK_IMPORTED_MODULE_5__, _top_nav__WEBPACK_IMPORTED_MODULE_6__]);
([src_hocs_with_auth_guard__WEBPACK_IMPORTED_MODULE_4__, _side_nav__WEBPACK_IMPORTED_MODULE_5__, _top_nav__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







const SIDE_NAV_WIDTH = 280;
const LayoutRoot = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_3__.styled)("div")(({ theme  })=>({
        display: "flex",
        flex: "1 1 auto",
        maxWidth: "100%",
        [theme.breakpoints.up("lg")]: {
            paddingLeft: SIDE_NAV_WIDTH
        }
    }));
const LayoutContainer = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_3__.styled)("div")({
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    width: "100%"
});
const Layout = (0,src_hocs_with_auth_guard__WEBPACK_IMPORTED_MODULE_4__/* .withAuthGuard */ .I)((props)=>{
    const { children  } = props;
    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.usePathname)();
    const [openNav, setOpenNav] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const handlePathnameChange = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{
        if (openNav) {
            setOpenNav(false);
        }
    }, [
        openNav
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        handlePathnameChange();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        pathname
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_top_nav__WEBPACK_IMPORTED_MODULE_6__/* .TopNav */ .t, {
                onNavOpen: ()=>setOpenNav(true)
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_side_nav__WEBPACK_IMPORTED_MODULE_5__/* .SideNav */ .k, {
                onClose: ()=>setOpenNav(false),
                open: openNav
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(LayoutRoot, {
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(LayoutContainer, {
                    children: children
                })
            })
        ]
    });
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1587:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "y": () => (/* binding */ SideNavItem)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_3__);




const SideNavItem = (props)=>{
    const { active =false , disabled , external , icon , path , title  } = props;
    const linkProps = path ? external ? {
        component: "a",
        href: path,
        target: "_blank"
    } : {
        component: (next_link__WEBPACK_IMPORTED_MODULE_1___default()),
        href: path
    } : {};
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_3__.ButtonBase, {
            sx: {
                alignItems: "center",
                borderRadius: 1,
                display: "flex",
                justifyContent: "flex-start",
                pl: "16px",
                pr: "16px",
                py: "6px",
                textAlign: "left",
                width: "100%",
                ...active && {
                    backgroundColor: "rgba(255, 255, 255, 0.04)"
                },
                "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.04)"
                }
            },
            ...linkProps,
            children: [
                icon && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Box, {
                    component: "span",
                    sx: {
                        alignItems: "center",
                        color: "neutral.400",
                        display: "inline-flex",
                        justifyContent: "center",
                        mr: 2,
                        ...active && {
                            color: "primary.main"
                        }
                    },
                    children: icon
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Box, {
                    component: "span",
                    sx: {
                        color: "neutral.400",
                        flexGrow: 1,
                        fontFamily: (theme)=>theme.typography.fontFamily,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: "24px",
                        whiteSpace: "nowrap",
                        ...active && {
                            color: "common.white"
                        },
                        ...disabled && {
                            color: "neutral.500"
                        }
                    },
                    children: title
                })
            ]
        })
    });
};
SideNavItem.propTypes = {
    active: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    disabled: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    external: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    icon: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().node),
    path: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
    title: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string.isRequired)
};


/***/ }),

/***/ 9826:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": () => (/* binding */ SideNav)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9332);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _heroicons_react_24_solid_ArrowTopRightOnSquareIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(111);
/* harmony import */ var _heroicons_react_24_solid_ChevronUpDownIcon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9510);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var src_components_logo__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2540);
/* harmony import */ var src_components_scrollbar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2377);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(8336);
/* harmony import */ var _side_nav_item__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1587);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_heroicons_react_24_solid_ArrowTopRightOnSquareIcon__WEBPACK_IMPORTED_MODULE_4__, _heroicons_react_24_solid_ChevronUpDownIcon__WEBPACK_IMPORTED_MODULE_5__, _config__WEBPACK_IMPORTED_MODULE_9__]);
([_heroicons_react_24_solid_ArrowTopRightOnSquareIcon__WEBPACK_IMPORTED_MODULE_4__, _heroicons_react_24_solid_ChevronUpDownIcon__WEBPACK_IMPORTED_MODULE_5__, _config__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);











const SideNav = (props)=>{
    const { open , onClose  } = props;
    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.usePathname)();
    const lgUp = (0,_mui_material__WEBPACK_IMPORTED_MODULE_6__.useMediaQuery)((theme)=>theme.breakpoints.up("lg"));
    const content = /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(src_components_scrollbar__WEBPACK_IMPORTED_MODULE_8__/* .Scrollbar */ .L, {
        sx: {
            height: "100%",
            "& .simplebar-content": {
                height: "100%"
            },
            "& .simplebar-scrollbar:before": {
                background: "neutral.400"
            }
        },
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Box, {
            sx: {
                display: "flex",
                flexDirection: "column",
                height: "100%"
            },
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Box, {
                    sx: {
                        p: 3
                    },
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Box, {
                            component: (next_link__WEBPACK_IMPORTED_MODULE_1___default()),
                            href: "/",
                            sx: {
                                display: "inline-flex",
                                height: 32,
                                width: 32
                            },
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(src_components_logo__WEBPACK_IMPORTED_MODULE_7__/* .Logo */ .T, {})
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Box, {
                            sx: {
                                alignItems: "center",
                                backgroundColor: "rgba(255, 255, 255, 0.04)",
                                borderRadius: 1,
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 2,
                                p: "12px"
                            },
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Typography, {
                                            color: "inherit",
                                            variant: "subtitle1",
                                            children: "Devias"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Typography, {
                                            color: "neutral.400",
                                            variant: "body2",
                                            children: "Production"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.SvgIcon, {
                                    fontSize: "small",
                                    sx: {
                                        color: "neutral.500"
                                    },
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_ChevronUpDownIcon__WEBPACK_IMPORTED_MODULE_5__["default"], {})
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Divider, {
                    sx: {
                        borderColor: "neutral.700"
                    }
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Box, {
                    component: "nav",
                    sx: {
                        flexGrow: 1,
                        px: 2,
                        py: 3
                    },
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Stack, {
                        component: "ul",
                        spacing: 0.5,
                        sx: {
                            listStyle: "none",
                            p: 0,
                            m: 0
                        },
                        children: _config__WEBPACK_IMPORTED_MODULE_9__/* .items.map */ .e.map((item)=>{
                            const active = item.path ? pathname === item.path : false;
                            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_side_nav_item__WEBPACK_IMPORTED_MODULE_10__/* .SideNavItem */ .y, {
                                active: active,
                                disabled: item.disabled,
                                external: item.external,
                                icon: item.icon,
                                path: item.path,
                                title: item.title
                            }, item.title);
                        })
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Divider, {
                    sx: {
                        borderColor: "neutral.700"
                    }
                })
            ]
        })
    });
    if (lgUp) {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Drawer, {
            anchor: "left",
            open: true,
            PaperProps: {
                sx: {
                    backgroundColor: "neutral.800",
                    color: "common.white",
                    width: 280
                }
            },
            variant: "permanent",
            children: content
        });
    }
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Drawer, {
        anchor: "left",
        onClose: onClose,
        open: open,
        PaperProps: {
            sx: {
                backgroundColor: "neutral.800",
                color: "common.white",
                width: 280
            }
        },
        sx: {
            zIndex: (theme)=>theme.zIndex.appBar + 100
        },
        variant: "temporary",
        children: content
    });
};
SideNav.propTypes = {
    onClose: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func),
    open: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool)
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8683:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": () => (/* binding */ TopNav)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _heroicons_react_24_solid_BellIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5856);
/* harmony import */ var _heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1950);
/* harmony import */ var _heroicons_react_24_solid_Bars3Icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2506);
/* harmony import */ var _heroicons_react_24_solid_MagnifyingGlassIcon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(521);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8442);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var src_hooks_use_popover__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(9797);
/* harmony import */ var _account_popover__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5392);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_heroicons_react_24_solid_BellIcon__WEBPACK_IMPORTED_MODULE_2__, _heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_3__, _heroicons_react_24_solid_Bars3Icon__WEBPACK_IMPORTED_MODULE_4__, _heroicons_react_24_solid_MagnifyingGlassIcon__WEBPACK_IMPORTED_MODULE_5__, _account_popover__WEBPACK_IMPORTED_MODULE_9__]);
([_heroicons_react_24_solid_BellIcon__WEBPACK_IMPORTED_MODULE_2__, _heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_3__, _heroicons_react_24_solid_Bars3Icon__WEBPACK_IMPORTED_MODULE_4__, _heroicons_react_24_solid_MagnifyingGlassIcon__WEBPACK_IMPORTED_MODULE_5__, _account_popover__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);










const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;
const TopNav = (props)=>{
    const { onNavOpen  } = props;
    const lgUp = (0,_mui_material__WEBPACK_IMPORTED_MODULE_6__.useMediaQuery)((theme)=>theme.breakpoints.up("lg"));
    const accountPopover = (0,src_hooks_use_popover__WEBPACK_IMPORTED_MODULE_8__/* .usePopover */ .S)();
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Box, {
                component: "header",
                sx: {
                    backdropFilter: "blur(6px)",
                    backgroundColor: (theme)=>(0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_7__.alpha)(theme.palette.background.default, 0.8),
                    position: "sticky",
                    left: {
                        lg: `${SIDE_NAV_WIDTH}px`
                    },
                    top: 0,
                    width: {
                        lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
                    },
                    zIndex: (theme)=>theme.zIndex.appBar
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Stack, {
                    alignItems: "center",
                    direction: "row",
                    justifyContent: "space-between",
                    spacing: 2,
                    sx: {
                        minHeight: TOP_NAV_HEIGHT,
                        px: 2
                    },
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Stack, {
                            alignItems: "center",
                            direction: "row",
                            spacing: 2,
                            children: [
                                !lgUp && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
                                    onClick: onNavOpen,
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.SvgIcon, {
                                        fontSize: "small",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_Bars3Icon__WEBPACK_IMPORTED_MODULE_4__["default"], {})
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {
                                    title: "Search",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.SvgIcon, {
                                            fontSize: "small",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_MagnifyingGlassIcon__WEBPACK_IMPORTED_MODULE_5__["default"], {})
                                        })
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Stack, {
                            alignItems: "center",
                            direction: "row",
                            spacing: 2,
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {
                                    title: "Contacts",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.SvgIcon, {
                                            fontSize: "small",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_3__["default"], {})
                                        })
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {
                                    title: "Notifications",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Badge, {
                                            badgeContent: 4,
                                            color: "success",
                                            variant: "dot",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.SvgIcon, {
                                                fontSize: "small",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_BellIcon__WEBPACK_IMPORTED_MODULE_2__["default"], {})
                                            })
                                        })
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.Avatar, {
                                    onClick: accountPopover.handleOpen,
                                    ref: accountPopover.anchorRef,
                                    sx: {
                                        cursor: "pointer",
                                        height: 40,
                                        width: 40
                                    },
                                    src: "/assets/avatars/avatar-anika-visser.png"
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_account_popover__WEBPACK_IMPORTED_MODULE_9__/* .AccountPopover */ .x, {
                anchorEl: accountPopover.anchorRef.current,
                open: accountPopover.open,
                onClose: accountPopover.handleClose
            })
        ]
    });
};
TopNav.propTypes = {
    onNavOpen: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func)
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;