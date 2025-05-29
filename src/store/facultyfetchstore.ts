// facultyfetchstore.ts

// Define the interface for faculty data
export interface FacultyData {
    id: number;
    image_url: string | null;
    name: string;
    qualification: string;
    designation: string;
    experience_years: number;
    status: 'active' | 'inactive'; // Assuming status can only be 'active' or 'inactive'
}

const FACULTY_API_ENDPOINT = 'https://localhost/api/public/faculty.php'; // <<< IMPORTANT: Update this with your actual PHP API URL!

/**
 * Fetches only active faculty details from the backend API.
 * @returns A promise that resolves with an array of active FacultyData, or rejects with an error.
 */
export const getActiveFaculty = async (): Promise<FacultyData[]> => {
    try {
        const response = await fetch(FACULTY_API_ENDPOINT, {
            method: 'GET', // Explicitly a GET request
            headers: {
                'Accept': 'application/json', // Indicate that we expect JSON response
            },
            // No 'body' for GET requests
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error ${response.status}: ${response.statusText}`);
        }

        const facultyList: FacultyData[] = await response.json();
        return facultyList;
    } catch (error: any) {
        console.error('Failed to fetch active faculty details in FacultyFetchStore:', error.message);
        throw error; // Re-throw to be handled by the calling component
    }
};
