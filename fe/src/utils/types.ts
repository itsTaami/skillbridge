export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "both" | "admin";
  profileImg: string;
  bio: string;
  saved: string[];
}

export interface Category {
  _id: string;
  name: string;
  type: "subject" | "skill";
  icon: string;
}

export interface Tutor {
  _id: string;
  user: { _id: string; name: string; profileImg: string; bio: string; email?: string };
  subjects: string[];
  level: "beginner" | "intermediate" | "advanced" | "all";
  hourlyRate: number;
  format: "online" | "in-person" | "both";
  availability: string;
  description: string;
  imgs: { src: string }[];
  rating: number;
  reviewCount: number;
  category: Category;
  createdAt: string;
}

export interface Service {
  _id: string;
  user: { _id: string; name: string; profileImg: string; bio: string; email?: string };
  title: string;
  description: string;
  category: Category;
  price: number;
  deliveryDays: number;
  imgs: { src: string }[];
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  description: string;
  imgList: string[];
  publishedBy: { _id: string; name: string; profileImg: string };
  blogCategory: { _id: string; name: string };
  createdAt: string;
}

export interface Review {
  _id: string;
  reviewer: { _id: string; name: string; profileImg: string };
  listingId: string;
  listingType: "tutor" | "service";
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  client: string;
  listingId: string;
  listingType: "tutor" | "service";
  message: string;
  status: "pending" | "accepted" | "declined" | "completed";
  scheduledAt: string;
  createdAt: string;
}

export interface AIMatchResult {
  recommendation: string;
  bestType: "tutor" | "service";
  matchedIds: string[];
  traits: string[];
}
