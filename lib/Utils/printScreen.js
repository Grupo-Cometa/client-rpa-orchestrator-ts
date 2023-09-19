"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printScreen = void 0;
exports.printScreen = {
    info: (data) => {
        console.log('\x1b[34m%s\x1b[0m', data);
    },
    success: (data) => {
        console.log('\x1b[32m%s\x1b[0m', data);
    },
    error: (data) => {
        console.error('\x1b[31m%s\x1b[0m', data);
    },
    warning: (data) => {
        console.warn('\x1b[33m%s\x1b[0m', data);
    }
};
