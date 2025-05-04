import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import { socketUrl } from "@/lib/utils";
import { useOnlineUsersStore } from "@/stores/useOnlineUsersStore";

let socketInstance: Socket | null = null;

export function useWebSocket() {
  const { userAuth } = useAuthStore();
  const { setOnlineUsers, addOnlineUser, removeOnlineUser } = useOnlineUsersStore();

  const socketRef = useRef<Socket | null>(null);
  const [me, setMe] = useState("");
  const [caller, setCaller] = useState("");
  const [name, setName] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [peer, setPeer] = useState<any>(null);

  const leaveCall = useCallback(() => {
    try {
      if (socketRef.current) {
        socketRef.current.emit("endCall", { to: caller });
      }

      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          stream.removeTrack(track);
        });
        setStream(null);
      }

      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => {
          track.stop();
          remoteStream.removeTrack(track);
        });
        setRemoteStream(null);
      }

      if (peer) {
        peer.destroy();
        setPeer(null);
      }

      // Reset các state
      setIsVideoCallActive(false);
      setCallAccepted(false);
      setReceivingCall(false);
      setCaller("");
      setCallerSignal(null);
    } catch (error) {
      console.error("Error in leaveCall:", error);
    }
  }, [caller, peer, remoteStream, stream]);

  useEffect(() => {
    if (!socketInstance) {
      const socketBase = socketUrl || "http://localhost:4041";
      socketInstance = io(socketBase, {
        transports: ["websocket"],
        withCredentials: true,
        query: { userId: userAuth?.id },
      });

      console.log(
        "Creating new WebSocket connection with userId:",
        userAuth?.id
      );
    }

    socketRef.current = socketInstance;

    if (socketRef.current) {
      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");

        // Lấy danh sách người dùng đang online khi kết nối
        socketRef.current?.emit("getOnlineUsers");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketRef.current.on("me", (id: string) => {
        if (id) {
          localStorage.setItem("userId", id);
          setMe(id);
        }
      });

      // Xử lý sự kiện nhận danh sách người dùng đang online
      socketRef.current.on("onlineUsers", (data: any) => {
        console.log("📋 Nhận danh sách người dùng đang online:", data.onlineUsers);
        setOnlineUsers(data.onlineUsers);
      });

      // Xử lý sự kiện khi một người dùng kết nối
      socketRef.current.on("userConnected", (data: any) => {
        console.log("👤 Người dùng kết nối:", data.userId);
        addOnlineUser(data.userId);
      });

      // Xử lý sự kiện khi một người dùng ngắt kết nối
      socketRef.current.on("userDisconnected", (data: any) => {
        console.log("👤 Người dùng ngắt kết nối:", data.userId);
        removeOnlineUser(data.userId);
      });

      socketRef.current.on("callUser", async (data: any) => {
        console.log("📞 Nhận cuộc gọi từ:", data);
        setReceivingCall(true);
        setCaller(data.from);
        setName(data.name);
        setCallerSignal(data.signal);
      });

      socketRef.current.on("callAccepted", (signal: any) => {
        console.log("✅ Cuộc gọi được chấp nhận, signal:", signal);
        setCallAccepted(true);
        setIsVideoCallActive(true);
        if (peer) {
          peer.signal(signal);
        }
      });

      socketRef.current.on("callEnded", () => {
        console.log("❌ Cuộc gọi kết thúc");
        leaveCall();
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, [leaveCall, peer, stream, userAuth, setOnlineUsers, addOnlineUser, removeOnlineUser]);

  const setupMediaStream = async () => {
    try {
      console.log("Setting up media stream...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log("Media stream obtained:", mediaStream.id);
      setStream(mediaStream);
      return mediaStream;
    } catch (error) {
      console.error("Error setting up media stream:", error);
      throw error;
    }
  };

  const callUser = async (userToCall: any) => {
    try {
      console.log("Initiating call to:", userToCall);
      const mediaStream = await setupMediaStream();

      const newPeer = new Peer({
        initiator: true,
        trickle: false,
        stream: mediaStream,
      });

      newPeer.on("signal", (data) => {
        if (socketRef.current) {
          socketRef.current.emit("callUser", {
            userToCall,
            signalData: data,
            from: userAuth?.id,
            name: userAuth?.fullName,
          });
        }
      });

      newPeer.on("stream", (remoteMediaStream) => {
        console.log("Received remote stream in caller");
        setRemoteStream(remoteMediaStream);
      });

      if (socketRef.current) {
        socketRef.current.on("callAccepted", (signal) => {
          setCallAccepted(true);
          setIsVideoCallActive(true);
          newPeer.signal(signal);
        });
      }

      setPeer(newPeer);
    } catch (error) {
      console.error("Error in callUser:", error);
    }
  };

  const answerCall = async () => {
    try {
      console.log("Answering call from:", caller);
      const mediaStream = await setupMediaStream();

      const newPeer = new Peer({
        initiator: false,
        trickle: false,
        stream: mediaStream,
      });

      newPeer.on("signal", (data) => {
        if (socketRef.current) {
          socketRef.current.emit("answerCall", { signal: data, to: caller });
        }
      });

      newPeer.on("stream", (remoteMediaStream) => {
        console.log("Received remote stream in answerer");
        setRemoteStream(remoteMediaStream);
      });

      newPeer.signal(callerSignal);
      setCallAccepted(true);
      setIsVideoCallActive(true);
      setPeer(newPeer);
    } catch (error) {
      console.error("Error in answerCall:", error);
    }
  };

  const sendFollowNotification = ({ toUserId }: { toUserId: string }) => {
    const payload = {
      fromUserId: userAuth?.id,
      fromUserName: userAuth?.fullName,
      toUserId,
      message: `${userAuth?.fullName} just followed you.`,
      sentAt: new Date().toISOString(),
    };

    if (socketRef.current) {
      socketRef.current.emit("followNotification", payload);
    }
  };

  return {
    me,
    caller,
    name,
    callerSignal,
    receivingCall,
    callAccepted,
    isVideoCallActive,
    stream,
    remoteStream,
    socketRef,
    callUser,
    answerCall,
    leaveCall,
    sendFollowNotification,
  };
}
