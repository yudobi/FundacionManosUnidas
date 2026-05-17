import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchProjects, fetchProject } from "../api/projects";
import { fetchTestimonials } from "../api/testimonials";
import {
  submitDonation,
  submitRegistration,
  submitContact,
} from "../api/forms";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => fetchProject(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDonationMutation() {
  return useMutation({ mutationFn: submitDonation });
}

export function useRegistrationMutation() {
  return useMutation({ mutationFn: submitRegistration });
}

export function useContactMutation() {
  return useMutation({ mutationFn: submitContact });
}
