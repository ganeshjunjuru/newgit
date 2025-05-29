// AddContentPopup.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { usePopupsStore, PopupItem } from '../../store/popupsStore'; // Adjust path if needed

// --- Generic Alert Dialog Component ---
interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    type: 'success' | 'error' | 'info';
}

const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, onClose, message, type }) => {
    if (!isOpen) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`p-6 rounded-lg shadow-xl max-w-sm w-full relative text-white ${bgColor}`}>
                <h3 className="text-xl font-bold mb-4">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-white text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-200"
                    >
                        OK
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white text-2xl"
                    aria-label="Close"
                >&times;</button>
            </div>
        </div>
    );
};

// --- Confirmation Dialog Component ---
interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (confirmed: boolean) => void;
    message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-xl font-bold mb-4">Confirmation</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => { onConfirm(false); onClose(); }}
                        className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(true); onClose(); }}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Select Type Modal Component ---
interface SelectTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectType: (type: PopupItem['type']) => void;
}

const SelectTypeModal: React.FC<SelectTypeModalProps> = ({ isOpen, onClose, onSelectType }) => {
    if (!isOpen) return null;

    const types: PopupItem['type'][] = ['text', 'image', 'video', 'link'];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-xl font-bold mb-4">Select Popup Type</h3>
                <div className="space-y-2">
                    {types.map(type => (
                        <button
                            key={type}
                            onClick={() => { onSelectType(type); onClose(); }}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Add/Edit Popup Modal Component ---
interface AddEditPopupModalProps {
    isOpen: boolean;
    onClose: () => void;
    popupToEdit?: PopupItem | null;
    isViewMode: boolean;
    onSubmit: (formData: Partial<PopupItem>, forceInactive?: boolean) => Promise<boolean>;
    loading: boolean;
    error: string | null;
}

const AddEditPopupModal: React.FC<AddEditPopupModalProps> = ({
    isOpen,
    onClose,
    popupToEdit,
    isViewMode,
    onSubmit,
    loading,
    error,
}) => {
    const initialFormData: Partial<PopupItem> = popupToEdit ? { ...popupToEdit } : {
        type: 'text',
        title_text: '',
        content_text: '',
        image_url: '',
        video_url: '',
        button_text: '',
        button_link: '',
        status: 'inactive', // Default status for new popups, can be overridden by validation
    };

    const [formData, setFormData] = useState<Partial<PopupItem>>(initialFormData);
    const [modalAlert, setModalAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [confirmDeactivatePrompt, setConfirmDeactivatePrompt] = useState<{ message: string; existingPopupId: string } | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({}); // State for field-specific errors

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
            setModalAlert(null);
            setConfirmDeactivatePrompt(null);
            setFieldErrors({}); // Reset errors on modal open/popup change
        }
    }, [isOpen, popupToEdit, initialFormData]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        setFieldErrors(prev => ({ ...prev, [name]: false }));
    }, []);

    const handleConfirmDeactivate = useCallback(async (confirmed: boolean) => {
        if (confirmed && confirmDeactivatePrompt) {
            const success = await onSubmit(formData, false); // Submit with the desired active status
            if (success) {
                onClose();
            }
        } else {
            // User cancelled confirmation, force current popup to inactive
            setFormData(prev => ({ ...prev, status: 'inactive' }));
            setModalAlert({ message: "Action cancelled. Popup status forced to 'inactive'.", type: 'info' });
            // Optionally, resubmit the form with the inactive status immediately
            await onSubmit({ ...formData, status: 'inactive' }, true);
        }
        setConfirmDeactivatePrompt(null);
    }, [confirmDeactivatePrompt, formData, onSubmit, onClose]);

    const handleSubmit = useCallback(async () => {
        setModalAlert(null); // Clear previous alerts
        let isValid = true;
        let validationMessage = "";
        const currentErrors: Record<string, boolean> = {}; // To collect specific errors

        // Frontend validation for mandatory fields based on type
        switch (formData.type) {
            case 'text':
                if (!formData.title_text?.trim()) {
                    isValid = false;
                    currentErrors.title_text = true;
                }
                if (!formData.content_text?.trim()) {
                    isValid = false;
                    currentErrors.content_text = true;
                }
                if (!isValid) validationMessage = "Title Text and Content Text are required for Text type popups.";
                break;
            case 'image':
                if (!formData.image_url?.trim()) {
                    isValid = false;
                    currentErrors.image_url = true;
                }
                if (!formData.title_text?.trim()) {
                    isValid = false;
                    currentErrors.title_text = true;
                }
                if (!isValid) validationMessage = "Image URL and Title Text are required for Image type popups.";
                break;
            case 'video':
                if (!formData.video_url?.trim()) {
                    isValid = false;
                    currentErrors.video_url = true;
                }
                if (!formData.title_text?.trim()) {
                    isValid = false;
                    currentErrors.title_text = true;
                }
                if (!isValid) validationMessage = "Video URL and Title Text are required for Video type popups.";
                break;
            case 'link':
                if (!formData.button_link?.trim()) {
                    isValid = false;
                    currentErrors.button_link = true;
                }
                if (!isValid) validationMessage = "Button Link is required for Link type popups.";
                break;
        }

        setFieldErrors(currentErrors); // Set all collected errors

        if (!isValid) {
            setModalAlert({ message: `Incomplete details: ${validationMessage} Status forced to 'inactive'.`, type: 'error' });
            await onSubmit({ ...formData, status: 'inactive' }, true); // Pass true to forceInactive
            return;
        }

        // Determine the target status for submission
        let targetStatus: 'active' | 'inactive' | 'deleted' = formData.status || 'inactive';
        // For new popups, if all mandatory fields are filled (isValid is true), set status to active by default unless specified otherwise.
        // This initial setting will then be subject to the single-active-popup rule handled by handleModalSubmit.
        if (!popupToEdit && isValid) {
            targetStatus = 'active';
        }

        // Handle the "only one active popup" rule for both new and existing popups trying to become active
        if (targetStatus === 'active') {
            // onSubmit (handleModalSubmit) will internally check for existing active popups
            // and trigger the confirmation dialog via setConfirmDeactivatePrompt if necessary.
            // We just need to call onSubmit with the intended 'active' status.
            const submissionResult = await onSubmit({ ...formData, status: targetStatus });
            if (submissionResult) {
                // If submission was successful and no confirmation was needed, close modal
                // or if confirmation was handled internally and led to success.
                onClose();
            }
            // If submissionResult is false, it means onSubmit returned false, likely due to
            // needing confirmation, so the modal will remain open.
        } else {
            // For inactive or deleted status, no active popup check is needed
            const success = await onSubmit({ ...formData, status: targetStatus });
            if (success) {
                onClose();
            }
        }
    }, [formData, onSubmit, popupToEdit]);

    if (!isOpen) return null;

    const renderFormFields = () => {
        return (
            <>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                        Popup Type:
                    </label>
                    <select
                        name="type"
                        id="type"
                        value={formData.type || 'text'}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        disabled={isViewMode || !!popupToEdit} // Disable type change after creation or in view mode
                    >
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="link">Link</option>
                    </select>
                </div>

                {/* Always show Title Text */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title_text">
                        Title Text:
                    </label>
                    <input
                        type="text"
                        name="title_text"
                        id="title_text"
                        value={formData.title_text || ''}
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${fieldErrors.title_text ? 'border-red-500' : 'border-gray-300'}`}
                        disabled={isViewMode}
                    />
                </div>

                {/* Conditional Fields based on Type */}
                {formData.type === 'text' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content_text">
                            Content Text:
                        </label>
                        <textarea
                            name="content_text"
                            id="content_text"
                            value={formData.content_text || ''}
                            onChange={handleChange}
                            rows={4}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${fieldErrors.content_text ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={isViewMode}
                        ></textarea>
                    </div>
                )}

                {formData.type === 'image' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image_url">
                            Image URL:
                        </label>
                        <input
                            type="text"
                            name="image_url"
                            id="image_url"
                            value={formData.image_url || ''}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${fieldErrors.image_url ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={isViewMode}
                        />
                    </div>
                )}

                {formData.type === 'video' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="video_url">
                            Video URL:
                        </label>
                        <input
                            type="text"
                            name="video_url"
                            id="video_url"
                            value={formData.video_url || ''}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${fieldErrors.video_url ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={isViewMode}
                        />
                    </div>
                )}

                {(formData.type === 'link' || formData.type === 'video' || formData.type === 'image') && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="button_text">
                                Button Text:
                            </label>
                            <input
                                type="text"
                                name="button_text"
                                id="button_text"
                                value={formData.button_text || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                disabled={isViewMode}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="button_link">
                                Button Link:
                            </label>
                            <input
                                type="text"
                                name="button_link"
                                id="button_link"
                                value={formData.button_link || ''}
                                onChange={handleChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${fieldErrors.button_link ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={isViewMode}
                            />
                        </div>
                    </>
                )}

                {/* Status Field (always show, not mandatory in terms of content for status) */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                        Status:
                    </label>
                    <select
                        name="status"
                        id="status"
                        value={formData.status || 'inactive'}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        disabled={isViewMode}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        {popupToEdit && <option value="deleted">Deleted</option>} {/* Only allow delete for existing */}
                    </select>
                </div>
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
                <h3 className="text-2xl font-bold mb-4">
                    {isViewMode ? 'View Popup' : (popupToEdit ? 'Edit Popup' : 'Add New Popup')}
                </h3>
                <form>
                    {renderFormFields()}
                    {modalAlert && (
                        <AlertDialog
                            isOpen={!!modalAlert}
                            onClose={() => setModalAlert(null)}
                            message={modalAlert.message}
                            type={modalAlert.type}
                        />
                    )}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:shadow-outline"
                        >
                            {isViewMode ? 'Close' : 'Cancel'}
                        </button>
                        {!isViewMode && (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Popup'}
                            </button>
                        )}
                    </div>
                </form>

                <ConfirmDialog
                    isOpen={!!confirmDeactivatePrompt}
                    onClose={() => setConfirmDeactivatePrompt(null)}
                    onConfirm={handleConfirmDeactivate}
                    message={confirmDeactivatePrompt?.message || ""}
                />
            </div>
        </div>
    );
};

// --- Main AddContentPopup Component ---
const AddContentPopup: React.FC = () => {
    const { popups, fetchPopups, addPopup, updatePopup, deletePopup, loading, error } = usePopupsStore();
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingPopup, setEditingPopup] = useState<PopupItem | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [showSelectTypeModal, setShowSelectTypeModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'deleted'>('all');
    const [alertMessage, setAlertMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [confirmDeactivatePrompt, setConfirmDeactivatePrompt] = useState<{ message: string; existingPopupId: string } | null>(null);

    useEffect(() => {
        fetchPopups();
    }, [fetchPopups]);

    const handleAddPopupClick = useCallback(() => {
        // Check for existing active popup before allowing direct 'active' add
        const hasActivePopup = popups.some(popup => popup.status === 'active');

        if (filterStatus === 'active' && hasActivePopup) {
            setAlertMessage({ message: "Cannot add new popup directly as active. An active popup already exists. Please deactivate or delete the existing active popup first, or add a new popup from 'All' filter which will be set as inactive.", type: 'info' });
            return;
        }

        setEditingPopup(null);
        setIsViewMode(false);
        // show select type modal for new popups
        setShowSelectTypeModal(true);
    }, [filterStatus, popups]);

    const handleSelectType = useCallback((type: PopupItem['type']) => {
        setEditingPopup({ ...editingPopup, type: type } as PopupItem); // Set the type for the new popup
        setShowAddEditModal(true);
    }, [editingPopup]);


    const handleEditPopupClick = useCallback((popup: PopupItem) => {
        setEditingPopup(popup);
        setIsViewMode(false);
        setShowAddEditModal(true);
    }, []);

    const handleViewPopupClick = useCallback((popup: PopupItem) => {
        setEditingPopup(popup);
        setIsViewMode(true);
        setShowAddEditModal(true);
    }, []);

    const handleStatusChange = useCallback(async (popupId: string, newStatus: PopupItem['status']) => {
        if (newStatus === 'active') {
            const currentActivePopup = popups.find(p => p.status === 'active');
            if (currentActivePopup && currentActivePopup.id !== popupId) {
                setConfirmDeactivatePrompt({
                    message: `There is already an active popup (ID: ${currentActivePopup.id}).\n\nDo you want to deactivate the existing popup and activate this one?`,
                    existingPopupId: currentActivePopup.id
                });
                setEditingPopup(popups.find(p => p.id === popupId) || null); // Set popup to edit to the one we want to activate
                return;
            }
        }
        const success = await updatePopup(popupId, { status: newStatus });
        if (success) {
            setAlertMessage({ message: `Popup status updated to '${newStatus}' successfully!`, type: 'success' });
            fetchPopups();
        } else {
            setAlertMessage({ message: `Failed to update popup status.`, type: 'error' });
        }
    }, [popups, updatePopup, fetchPopups]);


    const handleDeletePopupClick = useCallback(async (popupId: string) => {
        if (window.confirm("Are you sure you want to delete this popup?")) {
            const success = await deletePopup(popupId);
            if (success) {
                setAlertMessage({ message: `Popup deleted successfully!`, type: 'success' });
                fetchPopups();
            } else {
                setAlertMessage({ message: `Failed to delete popup.`, type: 'error' });
            }
        }
    }, [deletePopup, fetchPopups]);


    const handleModalSubmit = useCallback(async (formData: Partial<PopupItem>, forceInactive: boolean = false): Promise<boolean> => {
        let success = false;
        let currentSubmitStatus = formData.status || 'inactive'; // Default to inactive if not provided

        // If forceInactive is true, it means validation failed in AddEditPopupModal, so explicitly set to 'inactive'.
        if (forceInactive) {
            currentSubmitStatus = 'inactive';
        } else if (!editingPopup) { // For NEW popups, if validation passed, set to active.
            currentSubmitStatus = 'active';
        }


        // Logic for handling "only one active popup" rule when updating or adding
        const isTryingToActivate = currentSubmitStatus === 'active';

        if (isTryingToActivate) {
            const activePopups = getPopupsStore().popups.filter(p => p.status === 'active' && p.id !== popupToEdit?.id);

            if (activePopups.length > 0) {
                const existingActivePopup = activePopups[0];
                setConfirmDeactivatePrompt({
                    message: `There is already an active popup (ID: ${existingActivePopup.id}).\n\nDo you want to deactivate the existing popup and make this one active?`,
                    existingPopupId: existingActivePopup.id
                });
                return false; // Stop submission and wait for confirmation
            }
        }

        // Proceed with submission if no special inactive-to-active confirmation is needed or no conflict
        if (editingPopup && editingPopup.id !== undefined && editingPopup.id !== null) {
            success = await updatePopup(editingPopup.id, { ...formData, status: currentSubmitStatus });
            if (success) {
                setAlertMessage({ message: `Popup '${formData.title_text || editingPopup.title_text || 'Item'}' updated successfully! Status: ${currentSubmitStatus}`, type: 'success' });
            } else {
                setAlertMessage({ message: `Failed to update popup.`, type: 'error' });
            }
        } else {
            const newPopupData = formData as Omit<PopupItem, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>;
            const addedPopup = await addPopup({ ...newPopupData, status: currentSubmitStatus });
            success = !!addedPopup;
            if (success) {
                setAlertMessage({ message: `Popup '${newPopupData.title_text}' added successfully! Status: ${addedPopup?.status}`, type: 'success' });
            } else {
                setAlertMessage({ message: `Failed to add popup.`, type: 'error' });
            }
        }

        fetchPopups(); // Re-fetch popups to update the list
        return success;
    }, [addPopup, updatePopup, editingPopup, fetchPopups, error, filterStatus, popups]);


    const handleConfirmInactiveToActive = useCallback(async (confirmed: boolean) => {
        if (confirmed && confirmDeactivatePrompt && editingPopup) {
            // 1. Deactivate existing active popup if it exists
            if (confirmDeactivatePrompt.existingPopupId) {
                const deactivateSuccess = await updatePopup(confirmDeactivatePrompt.existingPopupId, { status: 'inactive' });
                if (!deactivateSuccess) {
                    setAlertMessage({ message: `Failed to deactivate existing active popup. Cannot activate new popup.`, type: 'error' });
                    setConfirmDeactivatePrompt(null);
                    return;
                }
            }
            // 2. Make the current popup active
            const success = await updatePopup(editingPopup.id, { ...editingPopup, status: 'active' });
            if (success) {
                setAlertMessage({ message: `Popup '${editingPopup.title_text}' activated successfully, existing active popup deactivated.`, type: 'success' });
                setShowAddEditModal(false); // Close modal on success
                fetchPopups();
            } else {
                setAlertMessage({ message: `Failed to activate popup.`, type: 'error' });
            }
        } else {
            setAlertMessage({ message: "Activation cancelled. Popup remains inactive.", type: 'info' });
        }
        setConfirmDeactivatePrompt(null); // Clear the confirmation prompt
    }, [confirmDeactivatePrompt, editingPopup, updatePopup, fetchPopups]);


    const getPopupsStore = usePopupsStore; // Get direct access to the store's state and actions

    const filteredPopups = popups.filter(popup => {
        if (filterStatus === 'all') return true;
        return popup.status === filterStatus;
    });

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Popups</h2>

            {alertMessage && (
                <AlertDialog
                    isOpen={!!alertMessage}
                    onClose={() => setAlertMessage(null)}
                    message={alertMessage.message}
                    type={alertMessage.type}
                />
            )}

            {confirmDeactivatePrompt && (
                <ConfirmDialog
                    isOpen={!!confirmDeactivatePrompt}
                    onClose={() => setConfirmDeactivatePrompt(null)}
                    onConfirm={handleConfirmInactiveToActive} // Use the specific handler for this confirmation
                    message={confirmDeactivatePrompt.message}
                />
            )}


            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handleAddPopupClick}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    disabled={loading}
                >
                    Add New Popup
                </button>
                <div className="flex space-x-2">
                    <label htmlFor="filterStatus" className="sr-only">Filter by Status</label>
                    <select
                        id="filterStatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'deleted')}
                        className="border border-gray-300 rounded-md p-2"
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="deleted">Deleted</option>
                    </select>
                </div>
            </div>

            {loading && <p className="text-blue-500">Loading popups...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && filteredPopups.length === 0 && (
                <p className="text-gray-600">No popups found for the selected filter.</p>
            )}

            {!loading && filteredPopups.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Type</th>
                                <th className="py-2 px-4 border-b">Title</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPopups.map((popup) => (
                                <tr key={popup.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-sm">{popup.id}</td>
                                    <td className="py-2 px-4 border-b text-sm">{popup.type}</td>
                                    <td className="py-2 px-4 border-b text-sm">{popup.title_text || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            popup.status === 'active' ? 'bg-green-200 text-green-800' :
                                            popup.status === 'inactive' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-red-200 text-red-800'
                                        }`}>
                                            {popup.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b text-sm space-x-2">
                                        <button
                                            onClick={() => handleViewPopupClick(popup)}
                                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEditPopupClick(popup)}
                                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            Edit
                                        </button>
                                        {popup.status !== 'active' && popup.status !== 'deleted' && (
                                            <button
                                                onClick={() => handleStatusChange(popup.id, 'active')}
                                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Activate
                                            </button>
                                        )}
                                        {popup.status === 'active' && (
                                            <button
                                                onClick={() => handleStatusChange(popup.id, 'inactive')}
                                                className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Deactivate
                                            </button>
                                        )}
                                        {(popup.status === 'active' || popup.status === 'inactive') && (
                                            <button
                                                onClick={() => handleDeletePopupClick(popup.id)}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Popup Modal */}
            <AddEditPopupModal
                isOpen={showAddEditModal}
                onClose={() => setShowAddEditModal(false)}
                popupToEdit={editingPopup}
                isViewMode={isViewMode}
                onSubmit={handleModalSubmit}
                loading={loading}
                error={error}
            />

            {/* Select Type Modal */}
            <SelectTypeModal
                isOpen={showSelectTypeModal}
                onClose={() => setShowSelectTypeModal(false)}
                onSelectType={handleSelectType}
            />
        </div>
    );
};

export default AddContentPopup;