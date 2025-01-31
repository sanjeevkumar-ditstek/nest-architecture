export interface SaveMessageRequest {
  senderId: string;
  receiverId: string;
  content: string;
}

export interface SaveGroupMessageRequest {
  groupId: string;
  senderId: string;
  content: string;
}

export interface UpdateMessageRequest {
  messageId: string;
  updatedContent: string;
  senderId: string;
}

export interface DeleteMessageResponse {
  message: string;
}

export interface GetMessagesBetweenUsersResponse {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: number | Date;
  updatedAt: number | Date;
}

export interface GetMessagesByGroupIdResponse {
  id: string;
  groupId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: number | Date;
  updatedAt: number | Date;
  // sender: User;
  // receiver: User;
  // group: Group;
}

export interface MarkMessageAsReadResponse {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: number | Date;
  updatedAt: number | Date;
}

export interface SaveResponseMessage {
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: number | Date;
}
