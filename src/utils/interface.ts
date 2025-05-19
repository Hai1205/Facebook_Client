import {
	FRIEND_STATUS,
	MEDIA_TYPE,
	NOTI_TYPE,
	PRIVACY,
	REPORT_STATUS,
	REPORT_TYPE,
	USER_GENDER,
	USER_ROLE,
	USER_STATUS
} from "./types";

export interface USER {
	id?: string;
	email: string;
	gender: USER_GENDER;
	fullName: string;
	dateOfBirth: string;
	avatarPhotoUrl: string;
	coverPhotoUrl: string;
	followers: USER[];
	following: USER[];
	friends: USER[];
	posts: POST[];
	bio: BIO;
	role: USER_ROLE;
	status: USER_STATUS;
	celebrity: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface GENERAL_STAT {
	totalPosts: number;
	totalUsers: number;
	totalStories: number;
	totalReports: number;
}

export interface BIO {
	id?: string;
	user: USER;
	bioText: string;
	liveIn: string;
	relationship: string;
	workplace: string;
	education: string;
	phone: string;
	hometown: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface POST {
	id?: string;
	user: USER;
	content: string;
	mediaUrls: string[];
	mediaTypes: MEDIA_TYPE[];
	likes: USER[];
	comments: COMMENT[];
	share: USER[];
	privacy: PRIVACY;
	status: USER_STATUS;
	createdAt?: string;
	updatedAt?: string;
}

export interface STORY {
	id?: string;
	user: USER;
	mediaUrl: string;
	mediaType: MEDIA_TYPE;
	privacy: PRIVACY;
	createdAt?: string;
	updatedAt?: string;
}

export interface COMMENT {
	id?: string;
	user: USER;
	text: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface MESSAGE {
	id?: string;
	conversation: CONVERSATION;
	sender: USER;
	content: string;
	isRead: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface CONVERSATION {
	id?: string;
	name: string;
	isGroupChat: boolean;
	participants: PARTICIPANT[];
	unreadCount: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface PARTICIPANT {
	id?: string;
	conversation: CONVERSATION;
	user: USER;
	leftAt?: string;
	joinedAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface NOTIFICATION {
	id?: string;
	from: USER;
	to: USER;
	post?: POST;
	type: NOTI_TYPE;
	read: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface FRIEND_REQUEST {
	id?: string;
	from: USER;
	to: USER;
	status: FRIEND_STATUS;
	createdAt?: string;
	updatedAt?: string;
}

export interface REPORT {
	id?: string;
	sender: USER;
	content: POST | STORY | COMMENT | USER;
	contentType: REPORT_TYPE;
	reason: string;
	additionalInfo: string;
	status: REPORT_STATUS;
	createdAt?: string;
	updatedAt?: string;
}

export interface STATS {
	totalUsers: number;
	totalPosts: number;
	totalComments: number;
	totalReports: number;
}

export interface GROUP_CONVERSATION {
	id: string;
	name: string;
	participants: number;
	avatarPhotoUrl: string;
	active: boolean;
}

export interface CHAT {
	id: string;
	user: USER;
	lastMessage: string;
	time: string;
	unread: boolean;
	online: boolean;
}

export interface FILTER {
	status: string[];
	contentType?: string[];
	privacy?: string[];
	role?: string[];
	gender?: string[];
}