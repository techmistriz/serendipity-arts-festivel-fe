import API, { METHODS } from "@/network/API";
import type {
  Testimonial,
  TestimonialsResponse,
} from "@/types/testimonial";

export async function getTestimonials(
  limit?: number,
): Promise<Testimonial[]> {
  const response = await API<TestimonialsResponse>(
    "/testimonials",
    METHODS.GET,
    limit ? { limit } : undefined,
  );

  if (!response.status) {
    throw new Error(
      response.message || "Failed to fetch testimonials",
    );
  }

  return response.data || [];
}