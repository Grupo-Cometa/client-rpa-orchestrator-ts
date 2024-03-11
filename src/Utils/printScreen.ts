export const printScreen = {
    info: (data: any) => {
        console.log('\x1b[34m%s\x1b[0m', data)
    },

    success: (data: any) => {
        console.log('\x1b[32m%s\x1b[0m', data)
    },

    error: (data: any) => {
        console.log('\x1b[31m%s\x1b[0m', data)
    },

    warning: (data: any) => {
        console.log('\x1b[33m%s\x1b[0m', data)
    }
}