import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../configs/axiosClient";

export const criterionQueryKeys = {
    all: ['student', 'criterion'],
    list: (phaseId) => [...criterionQueryKeys.all, 'list', phaseId],
    detail: (id) => [...criterionQueryKeys.all, 'detail', id],
};

export const useGetCriteriaByPhase = (phaseId) => {
    return useQuery({
        queryKey: criterionQueryKeys.list(phaseId),
        queryFn: async () => {
            const response = await axiosClient.get('/Criterion', {
                params: { phaseId },
            });
            return response.data;
        },
        enabled: !!phaseId,
    });
};

export const useGetCriterion = (id) => {
    return useQuery({
        queryKey: criterionQueryKeys.detail(id),
        queryFn: async () => {
            const response = await axiosClient.get(`/Criterion/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};