import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  deleteProjectImage,
  getAdminProject,
  listAdminProjects,
  setProjectCover,
  updateProject,
  uploadProjectImage,
  type AdminProjectInput,
  type AdminProjectKind,
} from "../api/admin/projects";
import {
  approveTestimonial,
  deleteTestimonial,
  listAdminTestimonials,
  rejectTestimonial,
  updateTestimonial,
  type TestimonialStatus,
} from "../api/admin/testimonials";
import { submitTestimonial } from "../api/testimonials";
import {
  getSiteContent,
  listSiteContent,
  updateSiteContent,
} from "../api/admin/siteinfo";
import {
  activateUser,
  deactivateUser,
  deleteUser,
  listUsers,
  setUserRole,
  type ListUsersParams,
} from "../api/admin/users";
import type { Role } from "../api/auth";

// ---------- Projects (admin) ----------

export function useAdminProjects() {
  return useQuery({
    queryKey: ["admin", "projects"],
    queryFn: listAdminProjects,
    staleTime: 1000 * 30,
  });
}

export function useAdminProject(slug: string | undefined) {
  return useQuery({
    queryKey: ["admin", "projects", slug],
    queryFn: () => getAdminProject(slug!),
    enabled: Boolean(slug) && slug !== "nuevo",
  });
}

function invalidateProjects(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["projects"] });
  qc.invalidateQueries({ queryKey: ["admin", "projects"] });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminProjectInput) => createProject(data),
    onSuccess: () => invalidateProjects(qc),
  });
}

export function useUpdateProject(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminProjectInput>) =>
      updateProject(slug, data),
    onSuccess: () => invalidateProjects(qc),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deleteProject(slug),
    onSuccess: () => invalidateProjects(qc),
  });
}

export function useUploadProjectImage(
  kind: AdminProjectKind,
  slug: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { file: File; alt?: string; sort_order?: number }) =>
      uploadProjectImage(kind, slug, params.file, params),
    onSuccess: () => invalidateProjects(qc),
  });
}

export function useDeleteProjectImage(
  kind: AdminProjectKind,
  slug: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: number) => deleteProjectImage(kind, slug, imageId),
    onSuccess: () => invalidateProjects(qc),
  });
}

export function useSetProjectCover(
  kind: AdminProjectKind,
  slug: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageUrl: string) => setProjectCover(kind, slug, imageUrl),
    onSuccess: () => invalidateProjects(qc),
  });
}

// ---------- Testimonials (admin + public submit) ----------

export function useAdminTestimonials(status?: TestimonialStatus) {
  return useQuery({
    queryKey: ["admin", "testimonials", status ?? "all"],
    queryFn: () => listAdminTestimonials(status),
    staleTime: 1000 * 15,
  });
}

function invalidateTestimonials(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["testimonials"] });
  qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
}

export function useApproveTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveTestimonial(id),
    onSuccess: () => invalidateTestimonials(qc),
  });
}

export function useRejectTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rejectTestimonial(id),
    onSuccess: () => invalidateTestimonials(qc),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTestimonial(id),
    onSuccess: () => invalidateTestimonials(qc),
  });
}

export function useUpdateTestimonial(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Parameters<typeof updateTestimonial>[1],
    ) => updateTestimonial(id, data),
    onSuccess: () => invalidateTestimonials(qc),
  });
}

export function useSubmitTestimonial() {
  return useMutation({
    mutationFn: submitTestimonial,
  });
}

// ---------- Site content (admin) ----------

export function useSiteContent() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: listSiteContent,
    staleTime: 1000 * 60,
  });
}

export function useSiteKey(key: string | undefined) {
  return useQuery({
    queryKey: ["site-content", key],
    queryFn: () => getSiteContent(key!),
    enabled: Boolean(key),
  });
}

export function useUpdateSiteKey(key: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { value: Record<string, unknown>; label?: string }) =>
      updateSiteContent(key, params.value, params.label),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-content"] });
    },
  });
}

// ---------- Users (admin) ----------

export function useAdminUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => listUsers(params),
    staleTime: 1000 * 15,
  });
}

function invalidateUsers(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["admin", "users"] });
}

export function useSetUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: number; role: Role }) =>
      setUserRole(params.id, params.role),
    onSuccess: () => invalidateUsers(qc),
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deactivateUser(id),
    onSuccess: () => invalidateUsers(qc),
  });
}

export function useActivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activateUser(id),
    onSuccess: () => invalidateUsers(qc),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => invalidateUsers(qc),
  });
}
