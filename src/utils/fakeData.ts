import { USER, POST, COMMENT, MESSAGE, NOTIFICATION, FRIEND_REQUEST } from "./types";

export const mockUsers: USER[] = [
    {
        id: "undefined",
        email: "john.doe@example.com",
        gender: "male",
        fullName: "John Doe",
        dateOfBirth: "1990-01-01",
        avatarPhotoUrl: "/placeholder.svg",
        coverPhotoUrl: "/cover-placeholder.svg",
        followers: [],
        following: [],
        bio: {
            id: "1",
            user: {} as USER,
            bioText: "Software Engineer",
            liveIn: "New York",
            relationship: "Single",
            workplace: "Tech Company",
            education: "University of Technology",
            phone: "123-456-7890",
            hometown: "Los Angeles",
            createdAt: "2023-01-01T00:00:00Z",
            updatedAt: "2023-01-01T00:00:00Z",
        },
        role: "user",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
    },
    {
        id: "2",
        email: "jane.smith@example.com",
        gender: "female",
        fullName: "Jane Smith",
        dateOfBirth: "1992-02-02",
        avatarPhotoUrl: "/placeholder.svg",
        coverPhotoUrl: "/cover-placeholder.svg",
        followers: [],
        following: [],
        bio: {
            id: "2",
            user: {} as USER,
            bioText: "Graphic Designer",
            liveIn: "San Francisco",
            relationship: "In a relationship",
            workplace: "Design Studio",
            education: "Art School",
            phone: "987-654-3210",
            hometown: "Chicago",
            createdAt: "2023-01-01T00:00:00Z",
            updatedAt: "2023-01-01T00:00:00Z",
        },
        role: "user",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
    },
];

export const mockPosts: POST[] = [
    {
        id: "1",
        user: mockUsers[0],
        content: "Hello, world!",
        mediaUrl: "/media-placeholder.jpg",
        mediaType: "image",
        likes: [],
        comments: [],
        shares: [],
        createdAt: "2023-01-02T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
    },
];

export const mockComments: COMMENT[] = [
    {
        id: "1",
        user: mockUsers[1],
        text: "Nice post!",
        createdAt: "2023-01-02T01:00:00Z",
        updatedAt: "2023-01-02T01:00:00Z",
    },
];

export const mockMessages: MESSAGE[] = [
    {
        id: "1",
        sender: mockUsers[0],
        receiver: mockUsers[1],
        content: "Hey, how are you?",
        createdAt: "2023-01-03T00:00:00Z",
        updatedAt: "2023-01-03T00:00:00Z",
    },
];

export const mockNotifications: NOTIFICATION[] = [
    {
        id: "1",
        from: mockUsers[1],
        to: mockUsers[0],
        type: "friend_request",
        read: false,
        createdAt: "2023-01-04T00:00:00Z",
        updatedAt: "2023-01-04T00:00:00Z",
    },
];

export const mockFriendRequests: FRIEND_REQUEST[] = [
    {
        id: "1",
        from: mockUsers[1],
        to: mockUsers[0],
        status: "pending",
        createdAt: "2023-01-05T00:00:00Z",
        updatedAt: "2023-01-05T00:00:00Z",
    },
];
