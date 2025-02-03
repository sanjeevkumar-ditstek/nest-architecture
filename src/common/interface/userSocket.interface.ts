// Define interfaces for the request and response types

export interface SaveUserSocketRequest {
  userId: string;
  socketId: string;
}

export interface DeleteUserSocketRequest {
  socketId: string;
}

export interface FindSocketByUserIdResponse {
  socketId: string | null;
}
