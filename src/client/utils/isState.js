export const isState = {
    dev: import.meta.env.MODE === 'development',
    mobile: /Mobi|Android|iPhone/i.test(navigator.userAgent),
    local: location.hostname === 'localhost',
    get login() { return sessionStorage.getItem('userName') },
}