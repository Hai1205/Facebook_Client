// Polyfill for global
if (typeof window !== 'undefined') {
    (window as any).global = window;
    (window as any).process = {
        env: { DEBUG: undefined },
        version: '',
        nextTick: require('next-tick')
    };
    (window as any).Buffer = require('buffer').Buffer;
}

// Polyfill for crypto
if (typeof window !== 'undefined' && !window.crypto) {
    (window as any).crypto = {
        getRandomValues: function (buffer: any) {
            return require('crypto').randomFillSync(buffer);
        }
    };
} 