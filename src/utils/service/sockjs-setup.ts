if (typeof window !== 'undefined') {
    (window as any).global = window;

    if (typeof (window as any).global.process === 'undefined') {
        (window as any).global.process = {
            env: { DEBUG: undefined }
        };
    }
}

export default {}; 