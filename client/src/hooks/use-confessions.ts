import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertConfession } from "@shared/schema";

export function useConfession(id: string) {
  return useQuery({
    queryKey: [api.confessions.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.confessions.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch confession");
      return api.confessions.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateConfession() {
  return useMutation({
    mutationFn: async (data: InsertConfession) => {
      const res = await fetch(api.confessions.create.path, {
        method: api.confessions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Validation failed");
        }
        throw new Error("Failed to create confession");
      }
      return api.confessions.create.responses[201].parse(await res.json());
    },
  });
}

export function useUpdateConfessionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, response }: { id: string; response: "yes" | "no" }) => {
      const url = buildUrl(api.confessions.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.confessions.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      return api.confessions.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.confessions.get.path, data.id] });
    },
  });
}

export function useGifts() {
  return useQuery({
    queryKey: [api.gifts.list.path],
    queryFn: async () => {
      const res = await fetch(api.gifts.list.path);
      if (!res.ok) throw new Error("Failed to fetch gifts");
      return api.gifts.list.responses[200].parse(await res.json());
    },
  });
}
