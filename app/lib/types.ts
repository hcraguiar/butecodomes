
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

export interface FormReviewType extends Omit<Review, 'rating'> {
  user: {
    id: string
    name: string
  }
  createdAt: string
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
  totalVisited: number
  topUsers: any[]
  nextSchedule: any[]
}

// ------------------
// USER
// ------------------


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
    participants: {
      hasEvaluated: boolean
    }[]
  }[]; // check-in do usuário atual
  reviews?: Review[] // review do usuário atual
  _count: {
    reviews: number
  }
}

// ------------------
// CHECK-IN
// ------------------
export interface User {
  id: string
  name: string
}

export interface CheckInParticipant {
  user: User
  hasEvaluated: boolean
}

export interface CheckIn {
  id: string
  createdAt: string
  participants: CheckInParticipant[]
  review: FormReviewType[]
}

export interface ButecoWithCheckIns extends Buteco {
  checkIn: CheckIn[]
}

// ------------------
// CALENDAR
// ------------------
export interface Suggested extends Pick<Buteco, 'id' | 'name' | 'logo_url' | 'image_url'> {

}

export interface Scheduled extends BaseEntity {
  date: string
  buteco: Suggested
}


export interface Visited extends Pick<Buteco, 'id' | 'name' | 'logo_url'> {
  checkIn: {
    createdAt: string
    participants: {
      user: {
        id: string
        name: string
        image: string
      }
    }[]
  }[] 
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

