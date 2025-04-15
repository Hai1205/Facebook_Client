// import { User, Search } from "lucide-react"
// import { Avatar } from "@/components/ui/avatar"
// import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { MESSAGE, USER } from "@/utils/types"
// import { useMemo, useState } from "react"
// // import { useAuthStore } from "@/stores/useAuthStore"

// const messagesdata = [
//   {
//     id: "1",
//     user: {
//       id: "user1",
//       name: "John Doe",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     lastMessage: "Hey, how are you doing?",
//     time: "2m",
//     unread: true,
//     online: true,
//   },
//   {
//     id: "2",
//     user: {
//       id: "user2",
//       name: "Jane Smith",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     lastMessage: "Can we meet tomorrow?",
//     time: "1h",
//     unread: true,
//     online: true,
//   },
//   {
//     id: "3",
//     user: {
//       id: "user3",
//       name: "Mike Johnson",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     lastMessage: "Thanks for your help!",
//     time: "3h",
//     unread: false,
//     online: false,
//   },
//   {
//     id: "4",
//     user: {
//       id: "user4",
//       name: "Sarah Williams",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     lastMessage: "I'll send you the files later",
//     time: "1d",
//     unread: false,
//     online: true,
//   },
//   {
//     id: "5",
//     user: {
//       id: "user5",
//       name: "David Brown",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     lastMessage: "See you at the meeting",
//     time: "2d",
//     unread: false,
//     online: false,
//   },
// ]

// interface MessagesDropdownProps {
//   onChatStart: (user: USER) => void
// }

// export function MessagesDropdown({ onChatStart }: MessagesDropdownProps) {
//   const [messages, setMessages] = useState<MESSAGE[]>([]);
//   setMessages(messagesdata);
//   // const { getUserMessages } = useNotiStore();
//   // const { userAuth } = useAuthStore();

//   // useEffect(() => {
//   //   const fetchNotifications = async () => {
//   //     if (userAuth) {
//   //       const messages = await getUserMessages(userAuth.id || "");
//   //       setMessages(messages);
//   //     }
//   //   };

//   //   fetchNotifications();
//   // }, [getUserMessages, userAuth]);

//   const hasMessages = useMemo(
//     () => messages.length > 0,
//     [messages]
//   );

//   return (
//     <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
//       <div className="p-4 border-b border-gray-700">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold">Messages</h3>
          
//           <button className="text-blue-500 text-sm hover:underline">See all in Messenger</button>
//         </div>
//       </div>

//       <div className="p-3 border-b border-gray-700">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

//           <input
//             type="text"
//             placeholder="Search messages"
//             className="bg-gray-700 rounded-full pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       <div className="max-h-96 overflow-y-auto">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`p-3 hover:bg-gray-700 cursor-pointer flex items-center ${
//               message.unread ? "bg-gray-700/50" : ""
//             }`}
//             onClick={() => onChatStart(message.user)}
//           >
//             <div className="mr-3 relative">
//               <Avatar className="h-10 w-10">
//                 <AvatarImage src={message.user.avatar} />

//                 <AvatarFallback className="bg-gray-600">
//                   <User className="h-5 w-5" />
//                 </AvatarFallback>
//               </Avatar>

//               {message.online && (
//                 <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
//               )}
//             </div>

//             <div className="flex-1 min-w-0">
//               <div className="flex justify-between items-center">
//                 <p className="font-semibold truncate">{message.user.name}</p>

//                 <p className="text-xs text-gray-400">{message.time}</p>
//               </div>
//               <p className="text-sm text-gray-400 truncate">{message.lastMessage}</p>
//             </div>
//             {message.unread && <div className="h-2 w-2 rounded-full bg-blue-500 ml-2"></div>}
//           </div>
//         ))}
//       </div>

//       {hasMessages && (
//         <div className="p-3 text-center border-t border-gray-700">
//           <button className="text-blue-500 text-sm hover:underline">
//             See all notifications
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }



import { User, Search } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const messages = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Hey, how are you doing?",
    time: "2m",
    unread: true,
    online: true,
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Can we meet tomorrow?",
    time: "1h",
    unread: true,
    online: true,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Thanks for your help!",
    time: "3h",
    unread: false,
    online: false,
  },
  {
    id: "4",
    user: {
      id: "user4",
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "I'll send you the files later",
    time: "1d",
    unread: false,
    online: true,
  },
  {
    id: "5",
    user: {
      id: "user5",
      name: "David Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "See you at the meeting",
    time: "2d",
    unread: false,
    online: false,
  },
]

interface MessagesDropdownProps {
  onChatStart: (user: { id: string; name: string; avatar: string }) => void
}

export function MessagesDropdown({ onChatStart }: MessagesDropdownProps) {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Messages</h3>
          <button className="text-blue-500 text-sm hover:underline">See all in Messenger</button>
        </div>
      </div>

      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search messages"
            className="bg-gray-700 rounded-full pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 hover:bg-gray-700 cursor-pointer flex items-center ${
              message.unread ? "bg-gray-700/50" : ""
            }`}
            onClick={() => onChatStart(message.user)}
          >
            <div className="mr-3 relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={message.user.avatar} />
                <AvatarFallback className="bg-gray-600">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              {message.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-semibold truncate">{message.user.name}</p>
                <p className="text-xs text-gray-400">{message.time}</p>
              </div>
              <p className="text-sm text-gray-400 truncate">{message.lastMessage}</p>
            </div>
            {message.unread && <div className="h-2 w-2 rounded-full bg-blue-500 ml-2"></div>}
          </div>
        ))}
      </div>

      <div className="p-3 text-center border-t border-gray-700">
        <button className="text-blue-500 text-sm hover:underline">New message</button>
      </div>
    </div>
  )
}
