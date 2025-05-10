/**
 * Cấu hình Socket cho ứng dụng
 * File này được sử dụng để vô hiệu hóa các kết nối Socket.IO không mong muốn
 * và đảm bảo chỉ sử dụng SockJS/STOMP
 */

/**
 * Giả lập Socket.IO client để tránh lỗi khi code cố gắng sử dụng Socket.IO
 */
export class MockSocketIO {
    private callbacks: Record<string, Function[]> = {};

    constructor() {
        console.warn('Socket.IO đã bị vô hiệu hóa. Đang sử dụng SockJS/STOMP thay thế.');
    }

    // Mock các phương thức Socket.IO phổ biến
    connect() {
        console.warn('Socket.IO connect() đã bị vô hiệu hóa.');
        return this;
    }

    on(event: string, callback: Function) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
        console.warn(`Socket.IO on('${event}') đã bị vô hiệu hóa.`);
        return this;
    }

    emit(event: string, ...args: any[]) {
        console.warn(`Socket.IO emit('${event}') đã bị vô hiệu hóa.`);
        return this;
    }

    disconnect() {
        console.warn('Socket.IO disconnect() đã bị vô hiệu hóa.');
        return this;
    }
}

/**
 * Hàm tạo socket mock để thay thế Socket.IO
 */
export const io = (url?: string) => {
    console.warn(`Cố gắng kết nối Socket.IO đến ${url} đã bị ngăn chặn.`);
    return new MockSocketIO();
};

/**
 * Export singleton instance của mock socket
 */
export const mockSocket = new MockSocketIO();

// Thêm vào window global để ghi đè các import động
if (typeof window !== 'undefined') {
    (window as any).io = io;
    (window as any).socket = mockSocket;
} 