import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";
import { useChatStore } from "@/stores/useChatStore";
// import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { NoConversationPlaceholder } from "./components/NoConversationPlaceholder";
import { Message } from "@/utils/types";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user: userAuth } = useAuthStore();
  // const { user, getAllUser } = useUserStore();
  const { selectedUser, getMessages, initSocket } = useChatStore();

  // useEffect(() => {
  //   if (user) getAllUser();
  // }, [getAllUser, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userAuth?.id) {
        throw new Error("User ID is undefined");
      }
      initSocket(userAuth?.id);

      if (selectedUser) {
        const data = await getMessages(userAuth?.id, selectedUser.id);
        console.log(data);
       
        setMessages(data);
      }
    };

    fetchMessages();
  }, [getMessages, userAuth, selectedUser]);

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UsersList />

        {/* chat message */}
        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader />

              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.senderId === userAuth?.id
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={
                            message.senderId === userAuth?.id
                              ? userAuth.avatarUrl
                              : selectedUser.avatarUrl
                          }
                        />
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 max-w-[70%]
													${message.senderId === userAuth?.id ? "bg-green-500" : "bg-zinc-800"}
												`}
                      >
                        <p className="text-sm">{message.content}</p>

                        <span className="text-xs text-zinc-300 mt-1 block">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};
export default ChatPage;
