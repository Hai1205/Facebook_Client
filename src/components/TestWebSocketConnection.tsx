import React, { useState } from "react";
import { testWebSocketConnection } from "@/utils/service/testWebSocketConnection";
import {
  connectToWebSocket,
  disconnectWebSocket,
} from "@/utils/service/webSocketService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const TestWebSocketConnection: React.FC = () => {
  const [serverUrl, setServerUrl] = useState<string>(
    import.meta.env.VITE_API_URL || "http://localhost:8080"
  );
  const [userId, setUserId] = useState<string>("test-user-1");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleTestSockJS = () => {
    setIsLoading(true);
    setTestResult(null);

    testWebSocketConnection(
      serverUrl,
      (frame) => {
        setTestResult({
          success: true,
          message: `Kiểm tra SockJS thành công! Frame: ${JSON.stringify(
            frame
          )}`,
        });
        setIsLoading(false);
      },
      (error) => {
        setTestResult({
          success: false,
          message: `Lỗi kết nối SockJS: ${JSON.stringify(error)}`,
        });
        setIsLoading(false);
      }
    );
  };

  const handleTestStompService = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Kiểm tra kết nối và đăng ký các service
      const connected = await connectToWebSocket(userId, serverUrl);

      if (connected) {
        setTestResult({
          success: true,
          message: "Kết nối và đăng ký WebSocket service thành công!",
        });

        // Ngắt kết nối sau 3 giây
        setTimeout(async () => {
          await disconnectWebSocket(userId);
        }, 3000);
      } else {
        setTestResult({
          success: false,
          message: "Không thể kết nối đến WebSocket service.",
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Lỗi khi sử dụng WebSocket service: ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg max-w-screen-md mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">Kiểm tra Kết nối WebSocket</h2>

      <div className="mb-4">
        <label className="block mb-2">URL Server:</label>
        <Input
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">User ID (để kiểm tra service):</label>
        <Input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={handleTestSockJS} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Kiểm tra SockJS
        </Button>

        <Button
          onClick={handleTestStompService}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Kiểm tra WebSocket Service
        </Button>
      </div>

      {testResult && (
        <div
          className={`p-4 border rounded-lg mt-4 ${
            testResult.success
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          }`}
        >
          <div className="flex items-center">
            {testResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <h3 className="font-semibold">
              {testResult.success ? "Thành công" : "Lỗi"}
            </h3>
          </div>
          <p className="mt-2">{testResult.message}</p>
        </div>
      )}
    </div>
  );
};

export default TestWebSocketConnection;
