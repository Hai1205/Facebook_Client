import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, parseISO } from 'date-fns'
import { USER } from "@/utils/interface";

export const serverUrl = import.meta.env.VITE_SERVER_URL as string;

export const socketUrl = import.meta.env.VITE_SOCKET_URL as string;

export const clientUrl = import.meta.env.VITE_CLIENT_URL as string;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizeUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formateDateAgo = (date: string) => {
  if (!date) return "Unknown time";
  const createdDate = parseISO(date);
  return formatDistanceToNow(createdDate, { addSuffix: true })
}

export const formatDateInDDMMYYY = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB')
}

export const countMutualFriends = (userA: USER, userB: USER): number => {
  const mutualFriends: USER[] = getMutualFriends(userA, userB);

  return mutualFriends.length;
}

export const getMutualFriends = (userA: USER, userB: USER): USER[] => {
  const idsOfUserAFriends = new Set(userA.friends.map(friend => friend.id));
  const mutualFriends: USER[] = userB.friends.filter(friend => idsOfUserAFriends.has(friend.id));

  return mutualFriends;
}

export const getUsersWithBirthdayToday = (users: USER[]): USER[] => {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  return users.filter(user => {
    const dob = new Date(user.dateOfBirth);
    const dobMonth = dob.getMonth() + 1;
    const dobDate = dob.getDate();
    return dobMonth === todayMonth && dobDate === todayDate;
  });
}

export const formatNumberStyle = (value: number): string => {
  if (value < 1_000) {
    return value.toString();
  } else if (value < 1_000_000) {
    return (value / 1_000).toFixed(value >= 10_000 ? 0 : 1).replace('.', ',') + 'K';
  } else if (value < 1_000_000_000) {
    return (value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1).replace('.', ',') + 'M';
  } else {
    return (value / 1_000_000_000).toFixed(value >= 10_000_000_000 ? 0 : 1).replace('.', ',') + 'B';
  }
}

export const capitalizeEachWord = (input: string): string => {
  if (!input) return '';

  return input
    .toLowerCase()
    .split(' ')
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
}

export const logTestFormData = (formData: FormData) => {
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
}

