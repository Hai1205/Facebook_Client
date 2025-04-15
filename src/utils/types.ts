export interface USER {
	id?: string;
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
	createdAt?: string;
	updatedAt?: string;
}

export interface STAT {
	totalPosts: number;
	totalUsers: number;
	totalCelebrities: number;
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
	mediaType: string;
	likes: USER[] | string[];
	comments: COMMENT[] | string[];
	shares: USER[] | string[];
	createdAt?: string;
	updatedAt?: string;
}

export interface STORY {
	id?: string;
	user: USER;
	mediaUrl: string;
	mediaType: string;
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
