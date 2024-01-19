"use strict";
exports.id = 304;
exports.ids = [304];
exports.modules = {

/***/ 8304:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$l": () => (/* binding */ createList),
/* harmony export */   "Gt": () => (/* binding */ createListProduct),
/* harmony export */   "TY": () => (/* binding */ getAllProductsForListId),
/* harmony export */   "yr": () => (/* binding */ getLists)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);
axios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

const API_URL = "http://217.196.49.92:3000/api";
;
const getLists = async ()=>{
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(`${API_URL}/lists`);
        return response.data;
    } catch (error) {
        console.error("Error fetching lists:", error);
        throw error;
    }
};
const createList = async (list)=>{
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].post(`${API_URL}/lists`, list);
        return response.data;
    } catch (error) {
        console.error("Error creating list:", error);
        throw error;
    }
};
const createListProduct = async (listId, products)=>{
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].post(`${API_URL}/lists/products`, {
            listId,
            products
        });
        return response.data;
    } catch (error) {
        console.error("Error creating list:", error);
        throw error;
    }
};
const getAllProductsForListId = async (listId)=>{
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(`${API_URL}/lists/products/${listId}/true`);
        return response.data;
    } catch (error) {
        console.error("Error creating list:", error);
        throw error;
    }
};


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;