import {
	MEDIA_TYPE,
	PRIVACY,
	REPORT_STATUS,
	REPORT_TYPE,
	USER_ROLE,
	USER_STATUS
} from "./types";

export interface USER {
	id?: string;
	email: string;
	gender: string;
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
	mediaUrl: string;
	mediaType: MEDIA_TYPE;
	likes: USER[];
	comments: COMMENT[];
	shares: USER[];
	privacy: PRIVACY;
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
	sender: USER;
	receiver: USER;
	content: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface NOTIFICATION {
	id?: string;
	from: USER;
	to: USER;
	type: string;
	read: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface FRIEND_REQUEST {
	id?: string;
	from: USER;
	to: USER;
	status: string;
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