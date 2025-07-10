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

export interface ButecoCardData {
  id: string;
  name: string;
  address: string;
  image_url: string;
  logo_url: string;
  rating: number;
  categories: {
  };
  checkIn: {
    id: string;
  }[];
}

// ------------------
// BASE ENTITY
// ------------------

interface BaseEntity {
  id: string
}

// ------------------
// REVIEW
// ------------------

export interface Ratings {
  food: number
  drink: number
  service: number
  ambiance: number
  price: number
  rating: number
} 

export interface Review extends BaseEntity, Ratings {
  checkInId?: string | null
}

// ------------------
// MAIN DASHBOARD 
// ------------------

export interface DashboardData {
  userId: string
  topButecos: any[]
  recentReviews: any[]
  pendingReviews: any[]
  totalReviews: number
  totalCheckIns: number
  topUsers: any[]
}

// ------------------
// BUTECO
// ------------------

export interface Buteco extends BaseEntity, Ratings {
  name: string;
  address: string;
  image_url: string;
  logo_url: string;
}

export interface ButecoListType extends Buteco {
  checkIn: {
    id: string;
  }[]; // check-in do usuário atual
  reviews?: Review[] // review do usuário atual
}

// ------------------
// MODAL
// ------------------
export interface ModalComponent {
  title: string;
  content: React.ReactNode
}

// ------------------
// ACTIONS
// ------------------

// Check-in ou desfazer
export interface CheckInAction {
  butecoId: string
  checkInId?: string
  participants: string[] 
}

// Open review form
export interface OpenReviewFormAction {
  buteco: ButecoListType
}

// Open buteco details
export interface OpenButecoDetailsAction {
  buteco: ButecoListType
}

