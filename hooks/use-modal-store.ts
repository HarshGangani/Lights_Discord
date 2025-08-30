// import { Server } from "@prisma/client";
// import { create } from "zustand";

// export type ModalType = "createServer" | "invite";

// interface ModalData{
//     server?: Server;
// }

// interface ModalStore{
//     type: ModalType | null;
//     data: ModalData;
//     isOpen: boolean;
//     onOpen: (type: ModalType, data?: ModalData) => void;
//     onClose: () => void;
// }

// export const useModal = create<ModalStore>((set) => ({
//     type: null,
//     data: {},
//     isOpen: false,
//     onOpen: (type, data={}) => set({isOpen: true, type, data }),
//     onClose: () => set({type: null, isOpen: false})
// }))


import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

// Modal types you support
export type ModalType = "createServer" | "invite" | 
"editServer" | "members" | 
"createChannel" | "leaveServer" | "deleteServer"| 
"deleteChannel" | "editChannel" | "messageFile" | "deleteMessage";

// Optional data passed to modals
interface ModalData {
  server?: Server;
  channel?:Channel;
  channelType?: ChannelType;
  apiUrl? : string
  query?: Record<string, any>;
}

// Modal store interface
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => {
    set({ isOpen: true, type, data });
    // Ensure proper focus management when modal opens
    document.body.style.pointerEvents = 'auto';
  },
  onClose: () => {
    set({ type: null, isOpen: false, data: {} });
    // Ensure body is focusable after modal closes
    document.body.style.pointerEvents = 'auto';
  },
}));
