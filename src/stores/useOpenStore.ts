import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface useOpenStoreProps {
	isSidebarOpen : boolean;
	activeTab: string;
	
    toggleSidebar: () => void;
	setActiveTab: (tab: string) => void;
	reset: () => void;
}

const initialState = {
	isSidebarOpen: false,
	activeTab: "home",
}

export const useOpenStore = create<useOpenStoreProps>()(
	persist(
		(set, get) => ({
			...initialState,
			
            toggleSidebar: ()=>{
				set({ isSidebarOpen: !get().isSidebarOpen });
            },

			setActiveTab: (tab) => set({ activeTab: tab }),

			reset: () => { set({ ...initialState }); },
		}),

		{
			name: "sidebar-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);


