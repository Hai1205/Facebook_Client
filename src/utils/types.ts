export interface User {
	id: string;
	albums: Album[] | string[];
	songs: Song[] | string[];
	likedSongs: Song[] | string[];
	likedAlbums: Album[] | string[];
	followers: User[] | string[];
	following: User[] | string[];
	username: string;
	email: string;
	fullName: string;
	avatarUrl: string;
	biography: string;
	status: string;
	website: string;
	instagram: string;
	twitter: string;
	facebook: string;
	youtube: string;
	role: string;
	country: string;
	joinDate: string;
}

export interface Album {
	id: string;
	user: User;
	title: string;
	thumbnailUrl: string;
	releaseDate: string;
	songs: Song[];
}

export interface Song {
	id: string;
	title: string;
	user: User;
	album: Album | null;
	thumbnailUrl: string;
	audioUrl: string;
	duration: number;
	releaseDate: string;
	views: number;
	lyrics: string;
	updatedAt: string;
}

export interface ArtistApplication {
	id: string;
	user: User | null;
	songs: Song[];
	biography: string;
	achievements: string;
	reason: string;
	submitDate: string;
	status: string;
}

export interface GeneralStat {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface FileState {
	thumbnail: File | null;
	audio: File | null;
}