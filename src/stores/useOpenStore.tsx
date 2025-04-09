import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface OpenStore {
	isSidebarOpen : boolean;
	
    toggleSidebar: () => void;
	reset: () => void;
}

export const useOpenStore = create<OpenStore>()(
	persist(
		(set, get) => ({
			isSidebarOpen: false,
			
            toggleSidebar: ()=>{
				set({ isSidebarOpen: !get().isSidebarOpen });
            },

			reset: () => {
				set({
					isSidebarOpen: false,
				});
			}
		}),

		{
			name: "sidebar-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);


