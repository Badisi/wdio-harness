const colorize = (msg: string, color: string): string => process.stdout.isTTY ? `${color}${msg}\x1b[0m` : msg;
const magenta = (msg: string): string => colorize(msg, '\x1b[35m');
const green = (msg: string): string => colorize(msg, '\x1b[32m');

export {
    magenta,
    green
};
