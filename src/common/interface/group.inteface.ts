export interface CreateGroupRequest {
  name: string;
  userIds: string[];
  creatorId: string;
}

export interface CreateGroupResponse {
  id: string;
  name: string;
  creatorId: string;
  members: string[];
  createdAt: number | Date;
  updatedAt: number | Date;
}

export interface getGroupResponse {
  id: string;
  name: string;
  creatorId: string;
  createdAt: number | Date;
  updatedAt: number | Date;
}
export interface AddGroupMemberRequest {
  groupId: string;
  userId: string;
  addedBy: string;
}

export interface GetGroupMembersResponse {
  userId: string;
}

export interface SoftDeleteGroupResponse {
  success: boolean;
  message: string;
}

export interface RemoveUserFromGroupRequest {
  userId: string;
  groupId: string;
  removerId: string;
}

export interface GetActiveGroupMembersResponse {
  userId: string;
}
