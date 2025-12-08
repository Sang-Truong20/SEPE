import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";

export const adminChallengeQueryKeys = {
    origin:['admin','challenge'] ,
    create: ()=>[...adminChallengeQueryKeys.origin,'create'] ,  
}

export const useCreateChallenge = () => {
    return useMutation({
        mutationKey: adminChallengeQueryKeys.create,
        mutationFn: (formValues) => {
            // Create FormData for multipart/form-data submission
            const formData = new FormData();
            
            // Append text fields
            formData.append('Title', formValues.Title);
            formData.append('Description', formValues.Description);
            formData.append('SeasonId', formValues.SeasonId);
            formData.append('FilePath', formValues.FilePath);
            
            // Append file if exists
            if (formValues.file && formValues.file[0]) {
                formData.append('file', formValues.file[0].originFileObj);
            }

            console.log('Submitting challenge data:', formValues);
            console.log('FormData contents:', formData);

            return axiosClient.post('/Challenge/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: (response) => {
            console.log('Challenge created successfully:', response.data);
            message.success('Challenge created successfully!');
        },
        onError: (error) => {
            console.error('Error creating challenge:', error);
            message.error('Failed to create challenge. Please try again.');
        },
    });
};
