import { USER } from '@/utils/interface';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CallType = 'voice' | 'video';
export type CallStatus = 'idle' | 'ringing' | 'connected' | 'ended';

interface useCallStoreProps {
  // Trạng thái cuộc gọi
  isCallActive: boolean;
  callType: CallType | null;
  callStatus: CallStatus;
  remoteUser: USER | null;
  isIncoming: boolean;
  isMinimized: boolean;
  callDuration: number;
  groupCall: boolean;
  participants: USER[];

  // Cài đặt cuộc gọi
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeakerOn: boolean;

  // Actions
  startCall: (user: USER, type: CallType, group?: boolean, participants?: USER[]) => void;
  receiveCall: (user: USER, type: CallType, group?: boolean, participants?: USER[]) => void;
  acceptCall: () => void;
  endCall: () => void;
  setCallStatus: (status: CallStatus) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleSpeaker: () => void;
  toggleMinimize: () => void;
  incrementCallDuration: () => void;
  reset: () => void;
}

const initialState = {
  isCallActive: false,
  callType: null,
  callStatus: 'idle' as CallStatus,
  remoteUser: null,
  isIncoming: false,
  isMinimized: false,
  callDuration: 0,
  groupCall: false,
  participants: [],
  isMuted: false,
  isVideoOn: true,
  isSpeakerOn: true,
};

export const useCallStore = create<useCallStoreProps>()(
  persist(
    (set) => ({
      ...initialState,

      startCall: (user, type, group = false, participants = []) =>
        set((state) => {
          if (state.isCallActive) {
            console.warn('Không thể bắt đầu cuộc gọi mới khi đang có cuộc gọi');
            return state;
          }

          return {
            isCallActive: true,
            callType: type,
            callStatus: 'ringing',
            remoteUser: user,
            isIncoming: false,
            callDuration: 0,
            groupCall: group,
            participants: participants.length > 0 ? participants : [user],
          };
        }),

      receiveCall: (user, type, group = false, participants = []) =>
        set((state) => {
          if (state.isCallActive) {
            console.warn('Không thể nhận cuộc gọi mới khi đang có cuộc gọi');
            return state;
          }

          return {
            isCallActive: true,
            callType: type,
            callStatus: 'ringing',
            remoteUser: user,
            isIncoming: true,
            callDuration: 0,
            groupCall: group,
            participants: participants.length > 0 ? participants : [user],
          };
        }),

      acceptCall: () =>
        set((state) => {
          if (!state.isCallActive || state.callStatus !== 'ringing') {
            return state;
          }

          return {
            callStatus: 'connected',
          };
        }),

      endCall: () =>
        set((state) => ({
          ...state,
          callStatus: 'ended',
          isCallActive: false,
        })),

      setCallStatus: (status) =>
        set({ callStatus: status }),

      toggleMute: () =>
        set((state) => ({ isMuted: !state.isMuted })),

      toggleVideo: () =>
        set((state) => ({ isVideoOn: !state.isVideoOn })),

      toggleSpeaker: () =>
        set((state) => ({ isSpeakerOn: !state.isSpeakerOn })),

      toggleMinimize: () =>
        set((state) => ({ isMinimized: !state.isMinimized })),

      incrementCallDuration: () =>
        set((state) => ({ callDuration: state.callDuration + 1 })),

      reset: () => { set({ ...initialState }); }
    }),
    {
      name: "call-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
); 