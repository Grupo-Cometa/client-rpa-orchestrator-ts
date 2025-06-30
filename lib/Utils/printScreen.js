"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printScreen = void 0;
exports.printScreen = {
    info: (...args) => {
        console.log('\x1b[34m%s\x1b[0m', ...args);
    },
    success: (...args) => {
        console.log('\x1b[32m%s\x1b[0m', ...args);
    },
    error: (...args) => {
        console.log('\x1b[31m%s\x1b[0m', ...args);
    },
    warning: (...args) => {
        console.log('\x1b[33m%s\x1b[0m', ...args);
    },
    critical: (...args) => {
        console.log('\x1b[35m%s\x1b[0m', ...args);
    },
};
