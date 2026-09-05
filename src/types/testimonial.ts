export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company_name: string | null;
  description: string;
  image: string | null;
  status: number;
}

export interface TestimonialsResponse {
  status: boolean;
  data: Testimonial[];
  meta: unknown[];
  message: string;
}
