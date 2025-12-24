import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../configs/axiosClient';

export const verifyStudentQueryKeys = {
    origin: ['student', 'verification'],
    me: () => [...verifyStudentQueryKeys.origin, 'me'],
    submit: () => [...verifyStudentQueryKeys.origin, 'submit'],
    approve: (id) => [...verifyStudentQueryKeys.origin, 'approve', id],
    reject: (id) => [...verifyStudentQueryKeys.origin, 'reject', id],
    
};


export const useGetMyVerification = () => {
    return useQuery({
        queryKey: verifyStudentQueryKeys.me(),
        queryFn: async () => {
            const response = await axiosClient.get('/StudentVerification/me');
            return response.data;
        },
    });
};

// Submit student verification
export const useSubmitVerification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: verifyStudentQueryKeys.submit(),
        mutationFn: async (verificationData) => {
            // Check if user is already verified - prevent submission
            if (verificationData.isVerified === true) {
                throw new Error('Bạn đã được xác minh rồi, không thể gửi đơn xác minh mới.');
            }

            const formData = new FormData();

            // Add all fields to FormData
            formData.append('UniversityName', verificationData.universityName);
            formData.append('StudentCode', verificationData.studentCode);
            formData.append('FullName', verificationData.fullName);
            formData.append('Major', verificationData.major);
            formData.append('YearOfAdmission', verificationData.yearOfAdmission.toString());

            // Add images if provided
            if (verificationData.frontCardImage) {
                formData.append('FrontCardImage', verificationData.frontCardImage);
            }
            if (verificationData.backCardImage) {
                formData.append('BackCardImage', verificationData.backCardImage);
            }

            const response = await axiosClient.post('/StudentVerification/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch verification related queries
            queryClient.invalidateQueries({ queryKey: verifyStudentQueryKeys.origin });
        },
    });
};

// Approve student verification
export const useApproveVerification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: verifyStudentQueryKeys.approve(),
        mutationFn: async (verificationId) => {
            const response = await axiosClient.put(`/api/StudentVerification/approve/${verificationId}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch verification related queries
            queryClient.invalidateQueries({ queryKey: verifyStudentQueryKeys.origin });
        },
    });
};

// Reject student verification
export const useRejectVerification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: verifyStudentQueryKeys.reject(),
        mutationFn: async (verificationId) => {
            const response = await axiosClient.put(`/api/StudentVerification/reject/${verificationId}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch verification related queries
            queryClient.invalidateQueries({ queryKey: verifyStudentQueryKeys.origin });
        },
    });
};

