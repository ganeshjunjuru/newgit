import React, { useState } from 'react';
// import { Phone, Mail, MapPin } from 'lucide-react'; // These icons are not used directly in ContactForm, so you can remove this import
import { postEnquiry, EnquiryData } from '../../store/ContactEnquiriesStore'; // Import from your store file!

// Define the interface for the form data managed by React state
// Note: EnquiryData is now imported from ContactEnquiriesStore
interface FormData {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
    subject: string;
    message: string;
    hasWhatsApp: boolean; // Field for WhatsApp status
}

// Remove the API_ENDPOINT constant from here

const ContactForm: React.FC = () => {
    // State for form fields
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        subject: '',
        message: '',
        hasWhatsApp: false, // Default to false
    });

    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [submissionMessage, setSubmissionMessage] = useState<string>('');

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Remove the postEnquiry function from here; it now lives in ContactEnquiriesStore.ts

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus('loading');
        setSubmissionMessage('');

        // Basic client-side validation for 10 digits
        const cleanedMobileNumber = formData.mobileNumber.replace(/[^0-9]/g, '');
        if (cleanedMobileNumber.length !== 10) {
            setSubmissionStatus('error');
            setSubmissionMessage('Mobile number must be exactly 10 digits.');
            return;
        }

        // Map frontend form data to backend API's expected EnquiryData structure
        const enquiryToSend: EnquiryData = {
            name: `${formData.firstName} ${formData.lastName}`,
            phone: cleanedMobileNumber,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            enquiry_date: new Date().toISOString(),
            whatsapp_status: formData.hasWhatsApp,
            source: "Website Form",
        };

        try {
            // Call the postEnquiry function from the ContactEnquiriesStore
            const result = await postEnquiry(enquiryToSend);
            setSubmissionStatus('success');
            setSubmissionMessage(`Thank you for your message! Your enquiry ID is: ${result.enquiry_id}`);
            // Clear form after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                mobileNumber: '',
                email: '',
                subject: '',
                message: '',
                hasWhatsApp: false,
            });
        } catch (error: any) {
            setSubmissionStatus('error');
            setSubmissionMessage(`Error submitting enquiry: ${error.message}`);
        }
    };

    return (
        <div className="lg:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Your First Name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Your Last Name"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number (10 digits)
                    </label>
                    <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., 9876543210"
                        maxLength={10}
                        pattern="\d{10}"
                        title="Please enter a 10-digit mobile number"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Regarding Admissions / Inquiry"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Type your message here..."
                        required
                    ></textarea>
                </div>

                {/* WhatsApp Status Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="hasWhatsApp"
                        name="hasWhatsApp"
                        checked={formData.hasWhatsApp}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasWhatsApp" className="ml-2 block text-sm text-gray-900">
                        Do you have WhatsApp on this number?
                    </label>
                </div>

                {/* Submission Status Message */}
                {submissionStatus !== 'idle' && (
                    <div className={`p-3 rounded-md text-sm font-medium ${
                        submissionStatus === 'success' ? 'bg-green-100 text-green-800' :
                        submissionStatus === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {submissionMessage}
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submissionStatus === 'loading'}
                    >
                        {submissionStatus === 'loading' ? 'Submitting...' : 'Submit Form'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;