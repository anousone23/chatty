import { Socket } from "socket.io-client";

export interface IAuthStore {
  onlineUsers: string[];
  authUser: IUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: SignUpFormType) => Promise<void>;
  login: (data: LoginFormType) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { profilePic: string | ArrayBuffer }) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  socket: Socket | null;
}

export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  profilePic: string;
  createdAt: string;
}

export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
}

export interface IChatStore {
  selectedUser: IUser | null;
  setSelectedUser: (selectedUser: IUser | null) => void;
  users: IUser[];
  getUsers: () => Promise<void>;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  messages: IMessage[];
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: any) => Promise<any>;
  subscribeToMessages: () => void;
  unSubscribeToMessages: () => void;
}

export interface IThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export type SignUpFormType = {
  fullname: string;
  email: string;
  password: string;
};

export type LoginFormType = {
  email: string;
  password: string;
};

export type AuthImagePatternType = {
  title: string;
  subtitle: string;
};
