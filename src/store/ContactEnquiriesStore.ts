// ContactEnquiriesStore.ts

// Define the interface for the data expected by your PHP API
export interface EnquiryData {
    name: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
    enquiry_date: string;
    whatsapp_status?: boolean;
    status?: string;
    source: string;
}

const API_ENDPOINT = 'https://localhost/api/public/enquiries.php'; // <<< IMPORTANT: Update this with your actual PHP API URL!

/**
 * Posts contact enquiry data to the backend API.
 * @param enquiry The enquiry data object.
 * @returns A promise that resolves with the API response data, or rejects with an error.
 */
export const postEnquiry = async (enquiry: EnquiryData): Promise<any> => {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(enquiry),
        });

        if (!response.ok) {
            // Attempt to parse error message from response body
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error ${response.status}: ${response.statusText}`);
        }

        // Parse the JSON response from the PHP API (e.g., { message: "...", enquiry_id: "..." })
        const responseData = await response.json();
        return responseData;
    } catch (error: any) {
        console.error('Failed to post enquiry in store:', error.message);
        throw error; // Re-throw to be handled by the calling component
    }
};
