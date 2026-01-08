
export enum SubscriptionType {
  FREE = 'FREE',
  ONE_MONTH = 'ONE_MONTH',
  TWO_MONTHS = 'TWO_MONTHS',
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  ONE_YEAR = 'ONE_YEAR'
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN', // سەرۆک
  EDITOR = 'EDITOR',           // ئەندامی ڕێگەپێدراو (نووسەر)
  USER = 'USER'                // بەکارهێنەر
}

export interface Bookmark {
  manhuaId: string;
  chapterId: string;
  pageIndex: number;
  manhuaTitle: string;
  chapterTitle: string;
  addedAt: string;
}

export interface SupportContact {
  id: string;
  name: string;
  whatsapp?: string;
  telegram?: string;
  messenger?: string;
  viber?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatar: string;
  deviceId: string;
  role: UserRole;
  isPremium: boolean;
  subscriptionEnd?: string;
  subscriptionType: SubscriptionType;
  isApproved: boolean;
  bookmarks: Bookmark[];
  favoriteIds: string[]; // List of favorited manhua IDs
}

export interface Manhua {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  rating: number;
  chapters: Chapter[];
  views: number;      // Number of views
  favorites: number;  // Total global favorites
  showInSlider?: boolean; // Visibility in the home carousel
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  isPremium: boolean;
  pages: string[]; // URLs of images
}

export interface AppState {
  user: User | null;
  manhuas: Manhua[];
  currentManhua: Manhua | null;
  currentChapter: Chapter | null;
}
