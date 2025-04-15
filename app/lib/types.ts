export type InviteWithUser = {
  id: string;
  token: string;
  expiresAt: Date;
  acceptedBy: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  createdAt: Date;
};