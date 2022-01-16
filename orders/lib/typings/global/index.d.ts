declare global {
    var getCookie: () => Promise<string[]>;
}