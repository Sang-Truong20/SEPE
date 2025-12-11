import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../configs/axiosClient";

export const chapterQueryKeys = {
    origin: ['student', 'chapter'],
    chapters: () => [...chapterQueryKeys.origin, 'list'],
};

export const useGetChapters = () => {
    return useQuery({
        queryKey: chapterQueryKeys.chapters(),
        queryFn: async () => {
            const response = await axiosClient.get('/Chapter');
            return response.data;
        },
    });
};