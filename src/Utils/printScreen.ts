export const printScreen = {
    info: (...args: any[]) => {
        console.log('\x1b[34m%s\x1b[0m', ...args)
    },

    success: (...args: any[]) => {
        console.log('\x1b[32m%s\x1b[0m', ...args)
    },

    error: (...args: any[]) => {
        console.log('\x1b[31m%s\x1b[0m', ...args)
    },

    warning: (...args: any[]) => {
        console.log('\x1b[33m%s\x1b[0m', ...args)
    }
}