import React, { useState, useEffect, useRef } from "react";
import { formatInTimeZone } from 'date-fns-tz'; // Import for timezone formatting

interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface Circular {
  id: string;
  title: string; // This is now the 'title' - UPDATED
  link: string; // Either link OR attachment, not both
  date: string; // This will now represent a full timestamp string (e.g., ISO 8601 with timezone or just a date string that backend handles)
  attachment?: Attachment | null; // Either link OR attachment, not both
  isDeleted: boolean; // New property for soft delete / inactive - **Consider replacing with `status` field below for clarity**
  content?: string | null; // NEW: Optional content column
  status: 'active' | 'draft' | 'inactive'; // NEW: Status field
}

// Dummy media library for demonstration. In a real app, this would also come from an API
const dummyMediaLibrary: Attachment[] = [
  {
    name: "example1.jpg",
    url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Image1",
    type: "image/jpeg",
    size: 123456,
  },
  {
    name: "video1.mp4",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    type: "video/mp4",
    size: 234567,
  },
  {
    name: "doc1.pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "application/pdf",
    size: 345678,
  },
  {
    name: "another-image.png",
    url: "https://via.placeholder.com/150/00FF00/000000?text=Image2",
    type: "image/png",
    size: 98765,
  },
  {
    name: "presentation.pptx",
    url: "https://docs.google.com/presentation/d/1_y-D4-0-0-0/edit?usp=sharing", // Example public link
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 500000,
  },
  {
    name: "audio.mp3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Example public link
    type: "audio/mpeg",
    size: 50000,
  },
];

// --- Floating Attachment Preview Component ---
interface FloatingAttachmentPreviewProps {
  attachment: Attachment | null;
  position: { x: number; y: number } | null;
}

const FloatingAttachmentPreview: React.FC<FloatingAttachmentPreviewProps> = ({ attachment, position }) => {
  if (!attachment || !position) return null;

  const renderPreviewContent = (att: Attachment) => {
    if (att.type.startsWith("image/")) {
      return <img src={att.url} alt={att.name} className="max-h-24 object-contain rounded-md" />;
    }
    if (att.type.startsWith("video/")) {
      return (
        <video src={att.url} className="max-h-24 w-full object-contain rounded-md" muted preload="metadata" />
      );
    }
    if (att.type === "application/pdf") {
      return (
        <div className="flex flex-col items-center justify-center text-sm text-gray-600 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-500 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="truncate max-w-[8rem]">{att.name}</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center text-sm text-gray-600 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400 mb-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <p className="truncate max-w-[8rem]">{att.name}</p>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x + 10, // Offset from cursor
        top: position.y + 10,
        zIndex: 1000,
        pointerEvents: 'none', // Allow clicks/hovers to pass through
      }}
      className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 max-w-xs transition-opacity duration-200"
    >
      {renderPreviewContent(attachment)}
      <p className="text-center text-xs text-gray-700 mt-1 truncate">{attachment.name}</p>
    </div>
  );
};
// --- End Floating Attachment Preview Component ---

// --- Custom Error Dialog Component ---
interface ErrorDialogProps {
  message: string;
  onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center border-t-4 border-red-500">
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.332 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Error!</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
// --- End Custom Error Dialog Component ---

// --- Confirmation Dialog Component ---
interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center border-t-4 border-yellow-500">
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.332 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Confirm Action</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors flex-1"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex-1"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
// --- End Confirmation Dialog Component ---

// --- Success Dialog Component ---
interface SuccessDialogProps {
  message: string;
  onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center border-t-4 border-green-500">
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Success!</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};
// --- End Success Dialog Component ---


const CircularsAdminPage: React.FC = () => {
  const [circulars, setCirculars] = useState<Circular[]>([]);

  const [editingCircular, setEditingCircular] = useState<Circular | null>(null);

  const [editTitle, setEditTitle] = useState(""); // RENAMED: from editText to editTitle
  const [editContent, setEditContent] = useState(""); // NEW: State for content
  const [editLink, _setEditLink] = useState(""); // Internal setter for link
  const [currentAttachment, _setCurrentAttachment] = useState<Attachment | null>(null); // Internal setter

  // State to manage whether link, attachment, or neither is selected
  const [selectedOption, setSelectedOption] = useState<'none' | 'link' | 'attachment'>('none');

  // States for custom error dialog
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // States for confirmation dialog
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  // States for success dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  // Loading state for API calls. This will be true when any API call is in progress.
  const [loading, setLoading] = useState(false);

  // --- PHP/MySQL API Endpoints ---
  // IMPORTANT: You MUST implement these PHP files on your server at the specified paths.
  // The React component will make fetch requests to these URLs.

  const API_BASE_URL = "https://web.sreepaadadegreecollege.org/api/Circulars/"; 

  // Endpoint for adding a new circular (POST request)
  const addCircularEndpoint = `${API_BASE_URL}/add_circular.php`;

  // Endpoint for getting ALL circulars (GET request).
  // The PHP script get_circulars.php, without a parameter, returns all circulars.
  const getAllCircularsEndpoint = `${API_BASE_URL}/get_circulars.php`;


  // Endpoint for updating a circular (PUT or POST request).
  // Assumes it takes the circular 'id' as a query parameter or in the request body,
  // and expects the updated fields in JSON format.
  const updateCircularEndpoint = (id: string) => `${API_BASE_URL}/update_circular.php?id=${id}`;

  // Endpoint for permanently deleting a circular (POST request)
  // This PHP file should delete the record from the database.
  const deleteCircularPermanentlyEndpoint = `${API_BASE_URL}/delete_circular_permanently.php`;


  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorDialog(true);
  };

  const closeErrorDialog = () => {
    setShowErrorDialog(false);
    setErrorMessage("");
  };

  const showConfirmation = (message: string, onConfirm: () => void) => {
    setConfirmationMessage(message);
    setConfirmAction(() => onConfirm); // Use a functional update to store the callback
    setShowConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setShowConfirmationDialog(false);
    setConfirmationMessage("");
    setConfirmAction(null);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessDialog(true);
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessMessage("");
  };


  // Exposed setter for link with exclusivity logic
  const setEditLink = (link: string) => {
    if (link.trim() !== '') {
      _setCurrentAttachment(null); // Clear attachment if link is set
    }
    _setEditLink(link);
  };

  // Exposed setter for attachment with exclusivity logic
  const setCurrentAttachment = (att: Attachment | null) => {
    if (att) {
      _setEditLink(""); // Clear link if attachment is set
    }
    _setCurrentAttachment(att);
  };


  const [dialogView, setDialogView] = useState<'edit' | 'attachment_selection'>('edit');
  const [mediaLibrary, setMediaLibrary] = useState<Attachment[]>([]);
  const [activeAttachmentTab, setActiveAttachmentTab] = useState<'upload' | 'library'>('library');

  // NEW: State for current filter (Active, Draft, Inactive)
  const [currentFilter, setCurrentFilter] = useState<'active' | 'draft' | 'inactive'>('active');

  // States for floating preview
  const [hoveredAttachment, setHoveredAttachment] = useState<Attachment | null>(null);
  const [hoverPreviewPosition, setHoverPreviewPosition] = useState<{ x: number; y: number } | null>(null);

  // --- Fetch Circulars from PHP/MySQL API ---
  const fetchCirculars = async () => {
    // Only set loading true if no dialog is open, to avoid conflicting with dialog's loading state
    // and to prevent the main page loading spinner from showing during active user interaction.
    if (!editingCircular && !showConfirmationDialog && !showErrorDialog && !showSuccessDialog) {
      setLoading(true);
    }
    try {
      // Fetch ALL circulars without any status filter from the API
      const response = await fetch(getAllCircularsEndpoint);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data: Circular[] = await response.json();

      // Ensure data is an array
      if (Array.isArray(data)) {
        setCirculars(data); // Set all circulars here
      } else {
        throw new Error("API did not return an array of circulars.");
      }

    } catch (error: any) {
      console.error("Error fetching circulars:", error);
      setCirculars([]); // Clear circulars on error to prevent displaying stale/bad data
    } finally {
      // Always set loading to false when the fetch operation completes
      if (!editingCircular && !showConfirmationDialog && !showErrorDialog && !showSuccessDialog) {
        setLoading(false);
      }
    }
  };

  // Initial fetch on component mount.
  useEffect(() => {
    fetchCirculars();
  }, []); // Empty dependency array means it runs only once on mount


  // Load dummy media library when dialog opens for attachment selection
  useEffect(() => {
    if (editingCircular && dialogView === 'attachment_selection') {
      // In a real app, you'd fetch your actual media library from an API here
      setMediaLibrary(dummyMediaLibrary);
      setActiveAttachmentTab('library');
    }
  }, [editingCircular, dialogView]);

  const handleEditCircular = (id: string) => {
    const circ = circulars.find((c) => c.id === id);
    if (!circ) return;
    setEditingCircular(circ);
    setEditTitle(circ.title); // UPDATED: circ.text to circ.title
    setEditContent(circ.content || ""); // NEW: Initialize content
    _setEditLink(circ.link); // Use internal setter for initial load
    _setCurrentAttachment(circ.attachment || null); // Use internal setter for initial load

    // Set initial selected option based on existing data
    if (circ.link) {
        setSelectedOption('link');
    } else if (circ.attachment) {
        setSelectedOption('attachment');
    } else {
        setSelectedOption('none');
    }

    setDialogView('edit'); // Always start in edit view
  };

  const cancelEdit = () => {
    setEditingCircular(null);
    setEditTitle(""); // UPDATED: setEditText to setEditTitle
    setEditContent(""); // NEW: Clear content
    _setEditLink(""); // Use internal setter to clear
    _setCurrentAttachment(null); // Use internal setter to clear
    setMediaLibrary([]);
    setDialogView('edit');
    setHoveredAttachment(null);
    setSelectedOption('none'); // Reset selected option
  };

  const saveEdit = async () => {
    if (!editingCircular) return;
    if (!editTitle.trim()) { // UPDATED: editText to editTitle
      showError("Circular title is required."); // UPDATED: text to title
      return;
    }

    // Validation based on selectedOption
    if (selectedOption === 'link' && !editLink.trim()) {
        showError("Please provide a link URL or select 'No Link/Attachment'.");
        return;
    }
    if (selectedOption === 'attachment' && !currentAttachment) {
        showError("Please select an attachment or choose 'No Link/Attachment'.");
        return;
    }

    let newStatus: 'active' | 'draft' | 'inactive' = editingCircular.status; // Default to existing status

    // Determine status based on mandatory fields for 'active'
    const hasTitle = editTitle.trim() !== ''; // UPDATED: hasText to hasTitle
    const hasLink = selectedOption === 'link' && editLink.trim() !== '';
    const hasAttachment = selectedOption === 'attachment' && currentAttachment !== null;

    if (hasTitle && (hasLink || hasAttachment)) { // UPDATED: hasText to hasTitle
        newStatus = 'active'; // All mandatory fields filled, set to active
    } else {
        newStatus = 'draft'; // Not all mandatory fields filled, set to draft
    }

    // If the circular was inactive and is being edited, we might want to keep it inactive
    // unless explicitly set to active or draft based on content.
    // For this logic, we'll respect the existing status if it was inactive
    // unless the new status becomes active.
    if (editingCircular.status === 'inactive' && newStatus !== 'active') {
        newStatus = 'inactive';
    }

    setLoading(true); // Start loading for this specific action
    try {
      const currentISTDateTime = formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');

      let dataToSave: Partial<Circular> = {
        id: editingCircular.id, // Ensure ID is sent for update
        title: editTitle.trim(), // RENAMED: text to title - IMPORTANT for API payload
        content: editContent.trim() || null, // NEW: Include content, send null if empty
        date: currentISTDateTime,
        status: newStatus, // Set the determined status
      };

      if (selectedOption === 'link') {
        dataToSave.link = editLink.trim();
        dataToSave.attachment = null;
      } else if (selectedOption === 'attachment') {
        dataToSave.link = "";
        dataToSave.attachment = currentAttachment;
      } else { // 'none'
        dataToSave.link = "";
        dataToSave.attachment = null;
      }

      const response = await fetch(updateCircularEndpoint(editingCircular.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchCirculars(); // Trigger fetch after successful update
      cancelEdit();
      showSuccess(`Circular "${editTitle.trim()}" saved as ${newStatus}.`); // Show success message - UPDATED: editText to editTitle
    } catch (error: any) {
      console.error("Error saving circular:", error);
      showError(`Failed to save circular: ${error.message}`);
    } finally {
      setLoading(false); // End loading for this specific action
    }
  };

  const handleAddCircular = async () => {
    setLoading(true); // Start loading for this specific action
    try {
      const currentISTDateTime = formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');

      const newCircularData: Omit<Circular, 'id'> = {
        title: "New Circular Title", // Default title for new circular - UPDATED: text to title
        content: null,
        link: "",
        date: currentISTDateTime,
        attachment: null,
        isDeleted: false, // For backend compatibility, though status is primary now
        status: 'draft', // NEW: Initially set to 'draft'
      };

      const response = await fetch(addCircularEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCircularData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const addedCircular = await response.json();
      
      await fetchCirculars(); // Trigger fetch after successful add

      // Immediately set editingCircular to the newly created one for editing
      setEditingCircular({ ...newCircularData, id: addedCircular.id, title: newCircularData.title }); // Set initial title - UPDATED
      setEditTitle(newCircularData.title); // Set edit title to the default title - UPDATED
      setEditContent("");
      _setEditLink("");
      _setCurrentAttachment(null);
      setSelectedOption('none');
      setDialogView('edit');
      showSuccess("New circular added successfully and opened for editing."); // Show success message

    } catch (error: any) {
      console.error("Error adding new circular:", error);
      showError(`Failed to add new circular: ${error.message}`);
    } finally {
      setLoading(false); // End loading for this specific action
    }
  };

  // NEW: Function to change circular status (active, draft, inactive)
  const handleSetCircularStatus = async (id: string, newStatus: 'active' | 'draft' | 'inactive') => {
    // Find the circular being updated
    const circToUpdate = circulars.find(c => c.id === id);
    if (!circToUpdate) {
        showError("Circular not found for status update.");
        return;
    }

    // Frontend validation for setting to 'active'
    if (newStatus === 'active') {
        const hasTitle = circToUpdate.title.trim() !== ''; // UPDATED: circToUpdate.text to circToUpdate.title
        const hasLink = circToUpdate.link.trim() !== '';
        const hasAttachment = circToUpdate.attachment !== null;

        if (!hasTitle || (!hasLink && !hasAttachment)) { // UPDATED: !hasText to !hasTitle
            showError("To set a circular to 'active', it must have a title and either a link or an attachment. Please edit the circular first."); // UPDATED: text to title
            return; // Prevent API call if criteria not met for 'active'
        }
    }

    setLoading(true);
    try {
      // Send the full circular data to the backend. This is important because
      // the backend's update script likely validates on these fields when status is set to active.
      const dataToSend = {
          id: circToUpdate.id,
          title: circToUpdate.title, // RENAMED: text to title - IMPORTANT for API payload
          content: circToUpdate.content,
          link: circToUpdate.link,
          attachment: circToUpdate.attachment,
          status: newStatus,
      };

      const response = await fetch(updateCircularEndpoint(id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      await fetchCirculars();
      showSuccess(`Circular status updated to '${newStatus}'.`); // Show success message
    } catch (error: any) {
      console.error(`Error setting circular status to ${newStatus}:`, error);
      showError(`Failed to set circular status to ${newStatus}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle permanent deletion
  const handlePermanentDeleteCircular = async (id: string) => {
    showConfirmation(
      "Are you sure you want to permanently delete this circular? This action cannot be undone.",
      async () => {
        setLoading(true); // Start loading for this specific action
        try {
          const response = await fetch(deleteCircularPermanentlyEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }

          // After successful permanent deletion, refetch the list
          await fetchCirculars(); // Trigger fetch after successful permanent delete
          closeConfirmationDialog(); // Close dialog on success
          showSuccess("Circular successfully deleted permanently."); // Show success message
        } catch (error: any) {
          console.error("Error permanently deleting circular:", error);
          showError(`Failed to permanently delete circular: ${error.message}`);
          closeConfirmationDialog(); // Close dialog even on error
        } finally {
          setLoading(false); // End loading for this specific action
        }
      }
    );
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      showError("File size must be 5 MB or less.");
      e.target.value = '';
      return;
    }

    const url = URL.createObjectURL(file);
    const newAttachment: Attachment = {
      name: file.name,
      url,
      type: file.type,
      size: file.size,
    };

    setCurrentAttachment(newAttachment);
    setMediaLibrary((prev) => {
      if (!prev.some(att => att.name === newAttachment.name && att.size === newAttachment.size)) {
        return [newAttachment, ...prev];
      }
      return prev;
    });

    setDialogView('edit');
    e.target.value = ''; // Clear file input
  };

  // Event handlers for floating preview
  const handleAttachmentMouseEnter = (attachment: Attachment, e: React.MouseEvent) => {
    setHoveredAttachment(attachment);
    setHoverPreviewPosition({ x: e.clientX, y: e.clientY });
  };

  const handleAttachmentMouseLeave = () => {
    setHoveredAttachment(null);
    setHoverPreviewPosition(null);
  };

  // Filter circulars based on currentFilter state
  const displayedCirculars = circulars.filter(circ => circ.status === currentFilter);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Circulars</h1>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1002]">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-700 text-lg">Loading...</p>
          </div>
        </div>
      )}

      {/* NEW: Filter Buttons and Add New Circular Button */}
      <div className="mb-6 flex space-x-3">
        <button
          onClick={handleAddCircular}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
          disabled={loading}
        >
          Add New Circular
        </button>

        <button
          onClick={() => setCurrentFilter('active')}
          className={`px-4 py-2 rounded-md font-semibold shadow-md transition-colors
            ${currentFilter === 'active' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
          disabled={loading}
        >
          Active
        </button>

        <button
          onClick={() => setCurrentFilter('draft')}
          className={`px-4 py-2 rounded-md font-semibold shadow-md transition-colors
            ${currentFilter === 'draft' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
          disabled={loading}
        >
          Draft
        </button>

        <button
          onClick={() => setCurrentFilter('inactive')}
          className={`px-4 py-2 rounded-md font-semibold shadow-md transition-colors
            ${currentFilter === 'inactive' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
          disabled={loading}
        >
          Deleted/Inactive
        </button>
      </div>

      {/* Circulars list */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 capitalize">
            {currentFilter} Circulars
        </h2>
        {displayedCirculars.length === 0 ? (
          <p className="text-gray-500">
            No {currentFilter} circulars found.
          </p>
        ) : (
          <ul className="space-y-3">
            {displayedCirculars.map((circ) => (
              <li
                key={circ.id}
                className={`flex items-center justify-between p-4 rounded-md shadow-sm border
                ${circ.status === 'inactive' ? 'bg-red-50 border-red-200 opacity-80' : 
                  circ.status === 'draft' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{circ.title}</p> {/* UPDATED: circ.text to circ.title */}
                  {circ.content && ( // NEW: Display content if available
                    <p className="text-sm text-gray-600 mt-1 truncate max-w-full">
                      Content: {circ.content}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Date: {circ.date}</p>

                  {/* Display link or attachment in list */}
                  {circ.link && (
                    <p className="text-sm text-gray-500 truncate mt-1">
                      Link:{" "}
                      <a
                        href={circ.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-600 hover:text-blue-800"
                      >
                        {circ.link}
                      </a>
                    </p>
                  )}
                  {circ.attachment && !circ.link && (
                    <div className="mt-1 text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Attached:{" "}
                      <a
                        href={circ.attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 font-medium text-blue-600 hover:underline truncate max-w-[150px]"
                        onMouseEnter={(e) => handleAttachmentMouseEnter(circ.attachment!, e)}
                        onMouseLeave={handleAttachmentMouseLeave}
                      >
                        {circ.attachment.name}
                      </a>
                    </div>
                  )}
                  {!circ.link && !circ.attachment && (
                      <p className="text-sm text-gray-500 italic mt-1">No link or attachment</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEditCircular(circ.id)}
                    className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    disabled={loading}
                  >
                    Edit
                  </button>

                  {circ.status === 'inactive' ? (
                      <button
                          onClick={() => handleSetCircularStatus(circ.id, 'active')}
                          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          disabled={loading}
                      >
                          Restore
                      </button>
                  ) : (
                      <>
                          <button
                              onClick={() => handleSetCircularStatus(circ.id, 'inactive')}
                              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                              disabled={loading}
                          >
                              Delete/Inactive
                          </button>
                          {circ.status === 'draft' ? (
                            <button
                                onClick={() => handleSetCircularStatus(circ.id, 'active')}
                                className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                                disabled={loading}
                            >
                                Publish
                            </button>
                          ) : (
                            <button
                                onClick={() => handleSetCircularStatus(circ.id, 'draft')}
                                className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                disabled={loading}
                            >
                                Draft
                            </button>
                          )}
                      </>
                  )}

                  {/* Permanent Delete Button (only visible for inactive circulars) */}
                  {circ.status === 'inactive' && (
                    <button
                      onClick={() => handlePermanentDeleteCircular(circ.id)}
                      className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                      disabled={loading}
                    >
                      Perm. Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit/Selection dialog */}
      {editingCircular && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">

            {/* Main content area based on dialogView */}
            {dialogView === 'edit' && (
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Circular</h2>

                <label className="block mb-3">
                  <span className="block font-medium mb-1">Title *</span> {/* UPDATED: Text to Title */}
                  <textarea
                    rows={3}
                    value={editTitle} // UPDATED: editText to editTitle
                    onChange={(e) => setEditTitle(e.target.value)} // UPDATED: setEditText to setEditTitle
                    className="w-full border border-gray-300 rounded-md p-2 resize-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter circular title" // UPDATED: text to title
                  />
                </label>

                {/* Optional Content Input */}
                <label className="block mb-3">
                  <span className="block font-medium mb-1">Content (Optional)</span>
                  <textarea
                    rows={5}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 resize-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter additional content for the circular"
                  />
                </label>

                {/* Option Buttons */}
                <div className="flex space-x-3 mb-4 mt-2">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedOption('none');
                            setEditLink(""); // Clear link using exposed setter
                            setCurrentAttachment(null); // Clear attachment using exposed setter
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors
                            ${selectedOption === 'none' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                        disabled={loading}
                    >
                        No Link/Attachment
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedOption('link');
                            setCurrentAttachment(null); // This will clear attachment via exposed setter
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors
                            ${selectedOption === 'link' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                        disabled={loading}
                    >
                        Add Link
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedOption('attachment');
                            setEditLink(""); // This will clear link via exposed setter
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors
                            ${selectedOption === 'attachment' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                        disabled={loading}
                    >
                        Add Attachment
                    </button>
                </div>


                {/* Link Input Box (Conditionally displayed) */}
                {selectedOption === 'link' && (
                    <label className="block mb-3 p-4 border border-gray-200 rounded-md bg-gray-50">
                        <span className="block font-medium mb-1">Link *</span>
                        <div className="relative">
                            <input
                                type="text"
                                value={editLink}
                                onChange={(e) => {
                                    setEditLink(e.target.value); // Use exposed setter
                                }}
                                placeholder="Enter URL (e.g., https://example.com/document)"
                                className="w-full border border-gray-300 rounded-md p-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            />
                            {editLink && (
                                <button
                                    type="button"
                                    onClick={() => { setEditLink(''); setSelectedOption('none'); }} // Use exposed setter, revert to none
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    title="Clear link"
                                    disabled={loading}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </label>
                )}

                {/* Attachment Input Box (Conditionally displayed) */}
                {selectedOption === 'attachment' && (
                    <div className="mt-4 mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">Attachment *</span>
                            {currentAttachment && (
                                <button
                                    title="Remove current attachment"
                                    onClick={() => {setCurrentAttachment(null); setSelectedOption('none');}} // Use exposed setter, revert to none
                                    className="text-red-500 hover:text-red-700 text-sm py-1 px-2 rounded-md transition-colors"
                                    disabled={loading}
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        {currentAttachment ? (
                            <div className="flex items-center space-x-2 text-blue-600 hover:underline cursor-pointer mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <a
                                    href={currentAttachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate max-w-[200px]"
                                    onMouseEnter={(e) => handleAttachmentMouseEnter(currentAttachment, e)}
                                    onMouseLeave={handleAttachmentMouseLeave}
                                >
                                    {currentAttachment.name}
                                </a>
                            </div>
                        ) : (
                            <p className="italic text-gray-500 text-sm mb-4">No attachment selected.</p>
                        )}

                        <button
                            type="button"
                            onClick={() => { setDialogView('attachment_selection'); }}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
                            disabled={loading}
                        >
                            Select or Upload Attachment
                        </button>
                    </div>
                )}


                <div className="mt-6 space-x-3">
                  <button
                    onClick={saveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-semibold shadow-md"
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md shadow-md"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {dialogView === 'attachment_selection' && (
              <div className="flex-1 w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold ">Select or Upload Attachment</h2>
                    <button
                        onClick={() => setDialogView('edit')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center text-sm"
                        disabled={loading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Edit
                    </button>
                </div>


                {/* Tab Navigation for Attachment Selection */}
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    onClick={() => setActiveAttachmentTab('upload')}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeAttachmentTab === 'upload'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    disabled={loading}
                  >
                    Upload New
                  </button>
                  <button
                    onClick={() => setActiveAttachmentTab('library')}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeAttachmentTab === 'library'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-800'}`}
                    disabled={loading}
                  >
                    Media Library
                  </button>
                </div>

                {/* Tab Content */}
                {activeAttachmentTab === 'upload' && (
                  <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50 text-center py-8">
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                      Drag & Drop a file here, or
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*,video/*,.pdf"
                      className="hidden"
                      disabled={loading}
                    />
                    <button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        Browse Files
                    </button>
                    <p className="text-gray-500 text-xs mt-2">Max file size: 5MB. Allowed types: images, videos, PDFs.</p>
                  </div>
                )}

                {activeAttachmentTab === 'library' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto border border-gray-200 rounded p-2 bg-white">
                    {mediaLibrary.length === 0 ? (
                      <p className="col-span-full text-center text-gray-500 text-sm py-4">No media files available in library.</p>
                    ) : (
                      mediaLibrary.map((media) => (
                        <div
                          key={media.url}
                          onClick={() => setCurrentAttachment(media)}
                          className={`cursor-pointer border rounded-md p-1 flex flex-col items-center justify-center text-center
                            ${
                              currentAttachment?.url === media.url
                                ? "border-blue-600 bg-blue-100 ring-2 ring-blue-500"
                                : "border-gray-300 hover:border-blue-400"
                            } transition-all duration-150`}
                          onMouseEnter={(e) => handleAttachmentMouseEnter(media, e)}
                          onMouseLeave={handleAttachmentMouseLeave}
                        >
                          {/* Small icon or representation for the grid item */}
                          {media.type.startsWith("image/") ? (
                            <img src={media.url} alt={media.name} className="max-h-16 object-contain rounded" />
                          ) : media.type.startsWith("video/") ? (
                            <video src={media.url} className="max-h-16 w-full object-contain rounded" muted />
                          ) : media.type === "application/pdf" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                           <p className="text-xs text-gray-600 mt-1 max-w-[90%] truncate">{media.name}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                        // When canceling from attachment selection, revert to the attachment that was originally there
                        // and set selected option based on original circular's state
                        _setEditLink(editingCircular?.link || "");
                        _setCurrentAttachment(editingCircular?.attachment || null);
                        if (editingCircular?.link) {
                            setSelectedOption('link');
                        } else if (editingCircular?.attachment) {
                            setSelectedOption('attachment');
                        } else {
                            setSelectedOption('none');
                        }
                        setDialogView('edit');
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!currentAttachment || loading} // Only enabled if an attachment is selected AND not loading
                    onClick={() => setDialogView('edit')}
                    className={`px-5 py-2 rounded font-semibold text-white ${
                      currentAttachment && !loading ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Select and Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Preview is rendered outside modals to ensure it's on top */}
      <FloatingAttachmentPreview attachment={hoveredAttachment} position={hoverPreviewPosition} />

      {/* Custom Error Dialog */}
      {showErrorDialog && (
        <ErrorDialog message={errorMessage} onClose={closeErrorDialog} />
      )}

      {/* Confirmation Dialog */}
      {showConfirmationDialog && confirmAction && (
        <ConfirmationDialog
          message={confirmationMessage}
          onConfirm={() => {
            confirmAction(); // Execute the stored action
            closeConfirmationDialog();
          }}
          onCancel={closeConfirmationDialog}
          confirmButtonText="Yes, Delete Permanently"
          cancelButtonText="No, Keep It"
        />
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <SuccessDialog message={successMessage} onClose={closeSuccessDialog} />
      )}
    </div>
  );
};

export default CircularsAdminPage;