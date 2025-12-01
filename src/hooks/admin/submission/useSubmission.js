// filepath: /Users/thong.dnguyen/Code/Local/SEPE/src/hooks/admin/submission/useSubmission.js
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
 * for submissions explicit for developers. If you want actual hook implementations
 * (useQuery/useMutation), I can add them using the documented endpoints.
 */

// Export a no-op placeholder to avoid unused-file warnings when imported elsewhere.
export const useSubmission = () => null;

