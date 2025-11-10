// TypeScript interfaces for frontend/backend data contracts

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'business';
  skills?: string[];
  bio?: string;
  companyName?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  postedBy: string;
  applicants: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
