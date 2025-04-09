import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {formatDistanceToNow, parseISO} from 'date-fns'

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

export const formateDate  =(date: string) =>{
  return formatDistanceToNow(parseISO(date),{addSuffix:true})
}


export const  formatDateInDDMMYYY = (date: string) =>{
  return new Date(date).toLocaleDateString('en-GB')
}

export const serverUrl = import.meta.env.VITE_SERVER_URL as string;

export const clientUrl = import.meta.env.VITE_CLIENT_URL as string;