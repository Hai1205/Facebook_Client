export interface USER {
	id: string;
	username: string;
	email: string;
	gender: string;
	fullName: string;
	dateOfBirth: string;
	avatarPhotoUrl: string;
	coverPhotoUrl: string;
	followers: USER[] | string[];
	following: USER[] | string[];
	bio: BIO;
	role: string;
	createdAt: string;
	updatedAt: string;
}

export interface STAT {
	totalPosts: number;
	totalUsers: number;
	totalCelebrities: number;
}

export interface BIO {
	id: string;
	user: USER;
	bioText: string;
	liveIn: string;
	relationship: string;
	workplace: string;
	education: string;
	phone: string;
	hometown: string;
	createdAt: string;
	updatedAt: string;
}

export interface POST {
	id: string;
	user: USER;
	content: string;
	mediaUrl: string;
	mediaType: string;
	likes: USER[] | string[];
	comments: Comment[] | string[];
	share: USER[] | string[];
	createdAt: string;
	updatedAt: string;
}

export interface STORY {
	id: string;
	user: USER;
	mediaUrl: string;
	mediaType: string;
	createdAt: string;
	updatedAt: string;
}

export interface COMMENT {
	id: string;
	user: USER;
	text: string;
	createdAt: string;
	updatedAt: string;
}

export interface MESSAGE {
	id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}