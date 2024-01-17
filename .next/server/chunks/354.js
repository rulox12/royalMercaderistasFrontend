"use strict";
exports.id = 354;
exports.ids = [354];
exports.modules = {

/***/ 8354:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var src_components_logo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2540);





// TODO: Change subtitle text
const Layout = (props)=>{
    const { children  } = props;
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Box, {
        component: "main",
        sx: {
            display: "flex",
            flex: "1 1 auto"
        },
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Unstable_Grid2, {
            container: true,
            sx: {
                flex: "1 1 auto"
            },
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Unstable_Grid2, {
                    xs: 12,
                    lg: 6,
                    sx: {
                        backgroundColor: "background.paper",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                    },
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Box, {
                            component: "header",
                            sx: {
                                left: 0,
                                p: 3,
                                position: "fixed",
                                top: 0,
                                width: "100%"
                            },
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Box, {
                                component: (next_link__WEBPACK_IMPORTED_MODULE_2___default()),
                                href: "/",
                                sx: {
                                    display: "inline-flex",
                                    height: 32,
                                    width: 32
                                },
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(src_components_logo__WEBPACK_IMPORTED_MODULE_4__/* .Logo */ .T, {})
                            })
                        }),
                        children
                    ]
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Unstable_Grid2, {
                    xs: 12,
                    lg: 6,
                    sx: {
                        alignItems: "center",
                        background: "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        "& img": {
                            maxWidth: "100%"
                        }
                    }
                })
            ]
        })
    });
};
Layout.prototypes = {
    children: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().node)
};


/***/ })

};
;