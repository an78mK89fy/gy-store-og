export function toLocaleTime(timestamp) {
    const time = new Date(timestamp)
    return `${[
        time.getFullYear(),
        String(time.getMonth() + 1).padStart(2, '0'),
        String(time.getDate()).padStart(2, '0'),
    ].join('/')} ${[
        String(time.getHours()).padStart(2, '0'),
        String(time.getMinutes()).padStart(2, '0')
    ].join(':')}`
}