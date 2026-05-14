import { Tutor, Service, Blog, Review } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformTutor = (row: any): Tutor => ({
  _id: row.id,
  user: {
    _id: row.profiles?.id || "",
    name: row.profiles?.name || "",
    profileImg: row.profiles?.profile_img || "",
    bio: row.profiles?.bio || "",
    email: row.profiles?.email || "",
  },
  subjects: row.subjects || [],
  level: row.level,
  hourlyRate: row.hourly_rate,
  format: row.format,
  availability: row.availability,
  description: row.description,
  imgs: row.imgs || [],
  rating: row.rating || 0,
  reviewCount: row.review_count || 0,
  category: row.categories
    ? { _id: row.categories.id, name: row.categories.name, type: row.categories.type, icon: row.categories.icon || "" }
    : null as unknown as Tutor["category"],
  createdAt: row.created_at,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformService = (row: any): Service => ({
  _id: row.id,
  user: {
    _id: row.profiles?.id || "",
    name: row.profiles?.name || "",
    profileImg: row.profiles?.profile_img || "",
    bio: row.profiles?.bio || "",
    email: row.profiles?.email || "",
  },
  title: row.title,
  description: row.description,
  category: row.categories
    ? { _id: row.categories.id, name: row.categories.name, type: row.categories.type, icon: row.categories.icon || "" }
    : null as unknown as Service["category"],
  price: row.price,
  deliveryDays: row.delivery_days,
  imgs: row.imgs || [],
  tags: row.tags || [],
  rating: row.rating || 0,
  reviewCount: row.review_count || 0,
  createdAt: row.created_at,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformBlog = (row: any): Blog => ({
  _id: row.id,
  title: row.title,
  description: row.description,
  imgList: row.img_list || [],
  publishedBy: {
    _id: row.profiles?.id || "",
    name: row.profiles?.name || "",
    profileImg: row.profiles?.profile_img || "",
  },
  blogCategory: row.blog_categories
    ? { _id: row.blog_categories.id, name: row.blog_categories.name }
    : null as unknown as Blog["blogCategory"],
  createdAt: row.created_at,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformReview = (row: any): Review => ({
  _id: row.id,
  reviewer: {
    _id: row.profiles?.id || "",
    name: row.profiles?.name || "",
    profileImg: row.profiles?.profile_img || "",
  },
  listingId: row.listing_id,
  listingType: row.listing_type,
  rating: row.rating,
  comment: row.comment || "",
  createdAt: row.created_at,
});
