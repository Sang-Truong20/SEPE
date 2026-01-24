import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axiosClient from "../../../configs/axiosClient";
import useMessage from "../../util/getError";

/**
 * Submission API (documented from OpenAPI):
 *
 * 1) POST /api/Submission/draft
 *    - method: POST
 *    - path: /api/Submission/draft
 *    - request body: SubmissionCreateDto
 *        - teamId: integer
 *        - phaseId: integer
 *        - title: string | null
 *        - filePath: string | null
 *    - response: 200 OK (created draft submission)
 *    - describe: Create a draft submission record for a team/phase
 *    - example request:
 *       { "teamId": 10, "phaseId": 5, "title": "My Project", "filePath": "/files/proj.pdf" }
 *
 * 2) PUT /api/Submission/draft/{submissionId}
 *    - method: PUT
 *    - path: /api/Submission/draft/{submissionId}
 *    - request: path param submissionId: integer
 *    - request body: SubmissionUpdateDto
 *        - title: string | null
 *        - filePath: string | null
 *    - response: 200 OK (updated draft)
 *    - describe: Update an existing draft submission
 *    - example request: { "title": "Updated title", "filePath": "/files/new.pdf" }
 *
 * 3) POST /api/Submission/set-final
 *    - method: POST
 *    - path: /api/Submission/set-final
 *    - request body: SubmissionFinalDto
 *        - submissionId: integer
 *        - teamId: integer
 *    - response: 200 OK (submission marked final)
 *    - describe: Mark a draft submission as final
 *    - example request: { "submissionId": 12, "teamId": 10 }
 *
 * 4) GET /api/Submission/team/{teamId}
 *    - method: GET
 *    - path: /api/Submission/team/{teamId}
 *    - request: path param teamId: integer
 *    - response: 200 OK -> array of Submission objects (inferred)
 *    - describe: List submissions for a team
 *
 * 5) GET /api/Submission/phase/{phaseId}
 *    - method: GET
 *    - path: /api/Submission/phase/{phaseId}
 *    - request: path param phaseId: integer
 *    - response: 200 OK -> array of Submission objects (inferred)
 *    - describe: List submissions for a phase
 *
 * 6) GET /api/Submission/{id}
 *    - method: GET
 *    - path: /api/Submission/{id}
 *    - request: path param id: integer
 *    - response: 200 OK -> single Submission object (inferred)
 *    - describe: Get submission details
 *
 * 7) GET /api/Submission
 *    - method: GET
 *    - path: /api/Submission
 *    - request: none
 *    - response: 200 OK -> array of Submission objects
 *    - describe: List all submissions (admin)
 *
 * Notes on Submission DTOs (OpenAPI components):
 *  - SubmissionCreateDto:
 *      - teamId: integer
 *      - phaseId: integer
 *      - title: string | null
 *      - filePath: string | null
 *  - SubmissionUpdateDto:
 *      - title: string | null
 *      - filePath: string | null
 *  - SubmissionFinalDto:
 *      - submissionId: integer
 *      - teamId: integer
 *
 * This file intentionally contains documentation-only content to make the API surface
 * for submissions explicit for developers. The implementation below provides React
 * Query hooks/mutations wired to the documented endpoints.
 */

/**
 * Query key helpers for Submission-related react-query queries.
 * @namespace submissionQueryKeys
 * @property {Array} all - Root key array for submissions.
 * @property {function():Array} lists - Key for listing submissions.
 * @property {function(Object):Array} list - Key for filtered list.
 * @property {function():Array} details - Root key for submission details.
 * @property {function(string|number):Array} detail - Key for a single submission by id.
 * @property {function(string|number):Array} byTeam - Key for submissions by teamId.
 * @property {function(string|number):Array} byPhase - Key for submissions by phaseId.
 */
export const submissionQueryKeys = {
    all: ['Submissions'],
    lists: () => [...submissionQueryKeys.all, 'list'],
    list: (filters) => [...submissionQueryKeys.lists(), filters],
    details: () => [...submissionQueryKeys.all, 'detail'],
    detail: (id) => [...submissionQueryKeys.details(), id],
    byTeam: (teamId) => [...submissionQueryKeys.all, 'byTeam', teamId],
    byPhase: (phaseId) => [...submissionQueryKeys.all, 'byPhase', phaseId],
};

/**
 * React Query hooks and mutations for Submission operations.
 *
 * Returned object fields:
 *  - fetchSubmissions: UseQueryResult for list of submissions
 *  - fetchSubmission: (id) => UseQueryResult for a single submission
 *  - fetchSubmissionsByTeam: (teamId) => UseQueryResult for submissions by team
 *  - fetchSubmissionsByPhase: (phaseId) => UseQueryResult for submissions by phase
 *  - createDraft: Mutation for creating a draft submission (use .mutate or .mutateAsync)
 *  - updateDraft: Mutation for updating a draft (call with { submissionId, payload })
 *  - setFinal: Mutation for marking a submission final (call with { submissionId, teamId, ... })
 *
 * @returns {object} Collection of react-query hooks and mutations for submissions.
 */
export const useSubmission = () => {
    const queryClient = useQueryClient();
    const { getMessage } = useMessage();

    /**
     * Fetch all submissions.
     * @type {import('@tanstack/react-query').UseQueryResult}
     * DEPRECATED: Use fetchSubmissionsByPhase instead for better performance
     */
    // const fetchSubmissions = useQuery({
    //     queryKey: submissionQueryKeys.lists(),
    //     queryFn: async () => {
    //         const response = await axiosClient.get('/Submission');
    //         return response.data;
    //     },
    // });

    /**
     * Fetch a single submission by id.
     * @param {string|number} id - Submission identifier
     * @returns {import('@tanstack/react-query').UseQueryResult} Query result for the submission
     */
    const fetchSubmission = (id) => useQuery({
        queryKey: submissionQueryKeys.detail(id),
        queryFn: async () => {
            const response = await axiosClient.get(`/Submission/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    /**
     * Fetch submissions belonging to a team.
     * @param {string|number} teamId
     * @returns {import('@tanstack/react-query').UseQueryResult}
     */
    const fetchSubmissionsByTeam = (teamId) => useQuery({
        queryKey: submissionQueryKeys.byTeam(teamId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Submission/team/${teamId}`);
            return response.data;
        },
        enabled: !!teamId,
    });

    /**
     * Fetch submissions for a specific phase.
     * @param {string|number} phaseId
     * @returns {import('@tanstack/react-query').UseQueryResult}
     */
    const fetchSubmissionsByPhase = (phaseId) => useQuery({
        queryKey: submissionQueryKeys.byPhase(phaseId),
        queryFn: async () => {
            const response = await axiosClient.get(`/Submission/phase/${phaseId}`);
            return response.data;
        },
        enabled: !!phaseId,
    });

    /**
     * Create a draft submission.
     * @type {import('@tanstack/react-query').UseMutationResult}
     * @example
     * createDraft.mutate({ teamId, phaseId, title: 'My Project', filePath: '/files/proj.pdf' });
     * @param {Object} payload - SubmissionCreateDto
     * @param {number} payload.teamId
     * @param {number} payload.phaseId
     * @param {string|null} payload.title
     * @param {string|null} payload.filePath
     */
    const createDraft = useMutation({
        mutationFn: (payload) => axiosClient.post('/Submission/draft', payload),
        onSuccess: (_data, variables) => {
            // variables should contain teamId and phaseId
            const { teamId, phaseId } = variables || {};
            // Invalidate relevant lists
            queryClient.invalidateQueries({ queryKey: submissionQueryKeys.lists() });
            if (teamId) queryClient.invalidateQueries({ queryKey: submissionQueryKeys.byTeam(teamId) });
            if (phaseId) queryClient.invalidateQueries({ queryKey: submissionQueryKeys.byPhase(phaseId) });
            message.success('Tạo bản nháp bài nộp thành công!');
        },
        onError: (error) => {
            console.error('Error creating draft submission:', error);
            message.error(getMessage(error));
        },
    });

    /**
     * Update a draft submission.
     * Call with an object: { submissionId, payload }
     * @type {import('@tanstack/react-query').UseMutationResult}
     * @param {number} submissionId - id of submission to update
     * @param {Object} payload - SubmissionUpdateDto
     * @param {string|null} payload.title
     * @param {string|null} payload.filePath
     */
    const updateDraft = useMutation({
        mutationFn: ({ submissionId, payload }) => axiosClient.put(`/Submission/draft/${submissionId}`, payload),
        onSuccess: (_data, variables) => {
            const submissionId = variables?.submissionId;
            // Invalidate detail and lists
            if (submissionId) queryClient.invalidateQueries({ queryKey: submissionQueryKeys.detail(submissionId) });
            queryClient.invalidateQueries({ queryKey: submissionQueryKeys.lists() });
            // It's possible the caller provided teamId/phaseId inside payload; try to invalidate if present
            const teamId = variables?.payload?.teamId || variables?.payload?.team?.id;
            const phaseId = variables?.payload?.phaseId || variables?.payload?.phase?.id;
            if (teamId) queryClient.invalidateQueries({ queryKey: submissionQueryKeys.byTeam(teamId) });
            if (phaseId) queryClient.invalidateQueries({ queryKey: submissionQueryKeys.byPhase(phaseId) });
            message.success('Cập nhật bản nháp bài nộp thành công!');
        },
        onError: (error) => {
            console.error('Error updating draft submission:', error);
            message.error(getMessage(error));
        },
    });

    /**
     * Mark a submission as final.
     * Call with payload object, e.g. { submissionId, teamId }
     * @type {import('@tanstack/react-query').UseMutationResult}
     * @param {Object} payload - SubmissionFinalDto
     * @param {number} payload.submissionId
     * @param {number} payload.teamId
     */
    const setFinal = useMutation({
        mutationFn: (payload) => axiosClient.post('/Submission/set-final', payload),
        onSuccess: (_data, variables) => {
            const { submissionId, teamId } = variables || {};
            // Invalidate relevant caches
            if (submissionId) queryClient.invalidateQueries({ queryKey: submissionQueryKeys.detail(submissionId) });
            queryClient.invalidateQueries({ queryKey: submissionQueryKeys.lists() });
            if (teamId) queryClient.invalidateQueries({ queryKey: submissionQueryKeys.byTeam(teamId) });
            message.success('Đánh dấu bài nộp cuối cùng thành công!');
        },
        onError: (error) => {
            console.error('Error setting submission final:', error);
            message.error(getMessage(error));
        },
    });

    return {
        fetchSubmission,
        fetchSubmissionsByTeam,
        fetchSubmissionsByPhase,
        createDraft,
        updateDraft,
        setFinal,
    };
};
