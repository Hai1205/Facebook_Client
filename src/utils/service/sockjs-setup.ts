// Cấu hình cho sockjs-client
if (typeof window !== 'undefined') {
    // Thiết lập biến global
    (window as any).global = window;

    // Thiết lập các thuộc tính khác có thể cần thiết
    if (typeof (window as any).global.process === 'undefined') {
        (window as any).global.process = {
            env: { DEBUG: undefined }
        };
    }
}

export default {}; 