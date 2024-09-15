export type SessionPayload = {
  id: string;
}

export type FirebaseUser = {
  uid: string;
  fullname: string;
  email: string;
  phone: string;
  avatarUrl: string;
  points: number;
}