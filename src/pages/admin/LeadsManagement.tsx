// src/pages/admin/LeadsManagement.tsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Search, PlusCircle, PhoneCall, MessageSquareText, Edit, Trash2, CheckCircle,
  XCircle, User, Mail, ClipboardList, ArrowUp, ArrowDown, Download, Upload,
  // Source & Status Icons (re-used from previous version)
  MessageSquare, Phone, Globe, Briefcase, CalendarDays
} from 'lucide-react';
import Button from '../../components/ui/Button'; // Assuming your Button component
import Input from '../../components/ui/Input';   // Assuming your Input component

// Define the Lead interface
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'Social Media' | 'Call' | 'Website' | 'Referral' | 'Event';
  status: 'New' | 'Contacted' | 'Qualified' | 'Disqualified' | 'Converted' | 'Follow Up';
  dateReceived: string; // ISO string or 'YYYY-MM-DD'
  notes: string;
}

// Define the Lead Statuses for the dropdown
const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Disqualified',
  'Converted',
  'Follow Up'
];

// Mock Data for Leads
const mockLeads: Lead[] = [
  {
    id: 'L001',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '9876543210',
    source: 'Social Media',
    status: 'New',
    dateReceived: '2025-05-20',
    notes: 'Interested in Computer Science program. Sent introductory brochure via email.'
  },
  {
    id: 'L002',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    phone: '8765432109',
    source: 'Website',
    status: 'Contacted',
    dateReceived: '2025-05-19',
    notes: 'Downloaded prospectus for MBA. Followed up with a call, left voicemail.'
  },
  {
    id: 'L003',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    phone: '7654321098',
    source: 'Call',
    status: 'Qualified',
    dateReceived: '2025-05-18',
    notes: 'Asked about scholarships for Arts. Seems highly interested in Fine Arts.'
  },
  {
    id: 'L004',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    phone: '6543210987',
    source: 'Referral',
    status: 'New',
    dateReceived: '2025-05-22',
    notes: 'Referred by alumni John Doe. Needs information on STEM courses.'
  },
  {
    id: 'L005',
    name: 'Eve Adams',
    email: 'eve.a@example.com',
    phone: '5432109876',
    source: 'Social Media',
    status: 'Disqualified',
    dateReceived: '2025-05-17',
    notes: 'Not eligible due to age restrictions (below 18). Informed parent.'
  },
  {
    id: 'L006',
    name: 'Frank White',
    email: 'frank.w@example.com',
    phone: '4321098765',
    source: 'Event',
    status: 'Converted',
    dateReceived: '2025-05-15',
    notes: 'Enrolled in Electrical Engineering program. Application complete.'
  },
  {
    id: 'L007',
    name: 'Grace Taylor',
    email: 'grace.t@example.com',
    phone: '3210987654',
    source: 'Website',
    status: 'New',
    dateReceived: '2025-05-21',
    notes: 'Submitted inquiry for Law program. Waiting for academic advisor contact.'
  },
  {
    id: 'L008',
    name: 'Henry King',
    email: 'henry.k@example.com',
    phone: '2109876543',
    source: 'Call',
    status: 'Follow Up',
    dateReceived: '2025-05-16',
    notes: 'Follow-up call scheduled for next week, 28th May. Interested in campus tour.'
  },
  {
    id: 'L009',
    name: 'Ivy Scott',
    email: 'ivy.s@example.com',
    phone: '1098765432',
    source: 'Social Media',
    status: 'New',
    dateReceived: '2025-05-23',
    notes: 'Replied to Facebook ad about scholarships. Sent application link.'
  },
  {
    id: 'L010',
    name: 'Jack Green',
    email: 'jack.g@example.com',
    phone: '0987654321',
    source: 'Referral',
    status: 'Qualified',
    dateReceived: '2025-05-14',
    notes: 'Friend of current student Sarah Davies. High potential for enrollment.'
  },
];

// Reusable Modal Component (can be moved to components/ui/Modal.tsx)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'screen-lg' | 'screen-xl' | 'full'; // Added screen-lg, screen-xl, full
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size = 'md' }) => {
  if (!isOpen) return null;

  const maxWidthClass = useMemo(() => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case 'screen-lg': return 'max-w-[1000px]'; // Adjusted for better horizontal fit
      case 'screen-xl': return 'max-w-screen-xl';
      case 'full': return 'max-w-full mx-4';
      default: return 'max-w-md';
    }
  }, [size]);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);


  return (
    <div
      // Changed dimming color to black with opacity
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Allows clicking outside to close
    >
      <div
        // Added mx-auto for centering, and adjusted padding for modal content
        className={`bg-white rounded-lg shadow-xl p-5 w-full overflow-y-auto max-h-[90vh] mx-auto ${maxWidthClass}`} // Changed p-6 to p-5
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <Button onClick={onClose} variant="ghost" className="text-gray-500 hover:text-gray-700 p-1">
            <XCircle size={20} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};


const LeadsManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead; direction: 'asc' | 'desc' } | null>(null);

  const [isLeadDetailsModalOpen, setIsLeadDetailsModalOpen] = useState(false);
  const [currentSelectedLead, setCurrentSelectedLead] = useState<Lead | null>(null);

  const csvFileInputRef = useRef<HTMLInputElement>(null); // Ref for CSV file input

  const updateLeadStatus = useCallback((id: string, newStatus: Lead['status']) => {
    setLeads(prevLeads =>
      prevLeads.map(lead => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
    // If the modal is open and we update status from outside (e.g., table dropdown),
    // we need to make sure the modal's internal state also reflects this.
    if (currentSelectedLead && currentSelectedLead.id === id) {
      setCurrentSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
  }, [currentSelectedLead]);


  const handleCallLead = useCallback((leadToCall: Lead) => {
    window.location.href = `tel:+91${leadToCall.phone}`;
    console.log(`Calling lead: ${leadToCall.name} (+91${leadToCall.phone})`);
    // Update status to 'Contacted' or 'Follow Up' if it's 'New'
    if (leadToCall.status === 'New') {
      updateLeadStatus(leadToCall.id, 'Contacted');
    } else if (leadToCall.status !== 'Contacted' && leadToCall.status !== 'Converted' && leadToCall.status !== 'Follow Up') {
      updateLeadStatus(leadToCall.id, 'Follow Up');
    }
  }, [updateLeadStatus]);

  const handleChatLead = useCallback((leadToChat: Lead) => {
    window.open(`https://wa.me/91${leadToChat.phone}`, '_blank');
    console.log(`Chatting with lead: ${leadToChat.name} (+91${leadToChat.phone})`);
    // Update status to 'Contacted' or 'Follow Up' if it's 'New'
    if (leadToChat.status === 'New') {
      updateLeadStatus(leadToChat.id, 'Contacted');
    } else if (leadToChat.status !== 'Contacted' && leadToChat.status !== 'Converted' && leadToChat.status !== 'Follow Up') {
      updateLeadStatus(leadToChat.id, 'Follow Up');
    }
  }, [updateLeadStatus]);

  const handleAddNewLead = () => {
    // In a real application, this would open a modal or navigate to a form
    console.log('Initiate "Add New Lead" process...');
    alert('Simulating adding a new lead. In a real app, a form would appear here.');
  };

  const handleOpenLeadDetails = (lead: Lead) => {
    setCurrentSelectedLead(lead);
    setIsLeadDetailsModalOpen(true);
  };

  const handleSaveLeadDetails = (updatedLead: Lead) => {
    setLeads(prevLeads =>
      prevLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead))
    );
    setIsLeadDetailsModalOpen(false);
    setCurrentSelectedLead(null);
    alert('Lead details updated successfully!');
  };

  const handleDeleteLead = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click from opening modal
    if (window.confirm(`Are you sure you want to delete lead ${id}?`)) {
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
      alert(`Lead ${id} deleted.`);
      // If the deleted lead was in the modal, close it
      if (currentSelectedLead && currentSelectedLead.id === id) {
        setIsLeadDetailsModalOpen(false);
        setCurrentSelectedLead(null);
      }
    }
  };

  const handleImportCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        alert('Please select a CSV file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        console.log('CSV Content:', text);
        alert('Simulating CSV import. In a real app, this would parse the CSV and add leads.');
        // Here you would parse the CSV and update the 'leads' state
        // Example: parseCsv(text).then(newLeads => setLeads(prev => [...prev, ...newLeads]));
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = "id,name,email,phone,source,status,dateReceived,notes\n" +
                       "L_NEW_001,John Doe,john.doe@example.com,9876543210,Website,New,2025-05-25,Inquiry about admissions\n" +
                       "L_NEW_002,Jane Smith,jane.smith@example.com,8765432109,Social Media,New,2025-05-24,Interested in scholarships";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection for download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sample_leads.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('Sample CSV file downloaded!');
    } else {
      alert('Your browser does not support downloading files directly. Please copy the content manually.');
    }
  };


  const sortedAndFilteredLeads = useMemo(() => {
    let actionableLeads = [...leads];

    if (filterSource !== 'All') {
      actionableLeads = actionableLeads.filter(lead => lead.source === filterSource);
    }

    if (filterStatus !== 'All') {
      actionableLeads = actionableLeads.filter(lead => lead.status === filterStatus);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      actionableLeads = actionableLeads.filter(
        lead =>
          lead.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          lead.email.toLowerCase().includes(lowerCaseSearchTerm) ||
          lead.phone.includes(lowerCaseSearchTerm) ||
          lead.notes.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (sortConfig !== null) {
      actionableLeads.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (sortConfig.key === 'dateReceived') {
            const dateA = new Date(aValue);
            const dateB = new Date(bValue);
            if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
          }

          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    }

    return actionableLeads;
  }, [leads, searchTerm, filterSource, filterStatus, sortConfig]);

  const requestSort = (key: keyof Lead) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Lead) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp size={14} className="ml-1" />
    ) : (
      <ArrowDown size={14} className="ml-1" />
    );
  };

  const getSourceIcon = (source: Lead['source']) => {
    switch (source) {
      case 'Social Media': return <MessageSquare size={16} className="text-blue-500 mr-1" />;
      case 'Call': return <Phone size={16} className="text-green-500 mr-1" />;
      case 'Website': return <Globe size={16} className="text-purple-500 mr-1" />;
      case 'Referral': return <Briefcase size={16} className="text-yellow-500 mr-1" />;
      case 'Event': return <CalendarDays size={16} className="text-red-500 mr-1" />;
      default: return null;
    }
  };

  const getStatusClass = (status: Lead['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Disqualified': return 'bg-red-100 text-red-800';
      case 'Converted': return 'bg-purple-100 text-purple-800';
      case 'Follow Up': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    // Reduced padding on the main container
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6"> {/* Reduced margin-bottom */}
        <div className="flex items-center">
          <ClipboardList className="h-10 w-10 mr-4 text-primary-600" />
          <h1 className="font-serif text-3xl font-bold text-gray-900">Leads Management</h1>
        </div>
        <div className="flex space-x-3"> {/* Group buttons */}
          <Button onClick={handleAddNewLead} className="flex items-center px-4 py-2">
            <PlusCircle size={18} className="mr-2" />
            Add New Lead
          </Button>
          {/* Hidden file input for CSV import */}
          <input
            type="file"
            ref={csvFileInputRef}
            onChange={handleImportCsv}
            accept=".csv"
            className="hidden"
          />
          <Button onClick={() => csvFileInputRef.current?.click()} className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700">
            <Upload size={18} className="mr-2" />
            Import Leads (CSV)
          </Button>
          <Button onClick={handleDownloadSample} className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700">
            <Download size={18} className="mr-2" />
            Download Sample
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Filters and Search */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Input
            label="Search Leads"
            placeholder="Search by name, email, phone, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} className="text-gray-400" />}
          />

          <div>
            <label htmlFor="filterSource" className="block text-gray-700 font-medium mb-1">Filter by Source</label>
            <select
              id="filterSource"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-gray-300"
            >
              <option value="All">All Sources</option>
              <option value="Social Media">Social Media</option>
              <option value="Call">Call</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Event">Event</option>
            </select>
          </div>

          <div>
            <label htmlFor="filterStatus" className="block text-gray-700 font-medium mb-1">Filter by Status</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-gray-300"
            >
              <option value="All">All Statuses</option>
              {LEAD_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Leads Table - Fixed layout, no horizontal scrolling */}
        <div className="overflow-x-hidden"> {/* Ensures no horizontal scrollbar */}
          <table className="min-w-full bg-white border border-gray-200 table-fixed"> {/* table-fixed for fixed column widths */}
            <thead>
              <tr>
                <th
                  className="w-[15%] px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    <User size={16} className="mr-1" /> Name {getSortIcon('name')}
                  </div>
                </th>
                <th
                  className="w-[20%] px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('email')}
                >
                  <div className="flex items-center">
                    <Mail size={16} className="mr-1" /> Email {getSortIcon('email')}
                  </div>
                </th>
                <th className="w-[10%] px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th
                  className="w-[12%] px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('source')}
                >
                  <div className="flex items-center">
                    Source {getSortIcon('source')}
                  </div>
                </th>
                <th
                  className="w-[12%] px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center">
                    Status {getSortIcon('status')}
                  </div>
                </th>
                <th
                  className="w-[10%] px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('dateReceived')}
                >
                  <div className="flex items-center">
                    Date {getSortIcon('dateReceived')}
                  </div>
                </th>
                <th className="w-[10%] px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Notes
                </th>
                <th className="w-[11%] px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredLeads.length > 0 ? (
                sortedAndFilteredLeads.map(lead => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOpenLeadDetails(lead)} // Open modal on row click
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 truncate">
                      {lead.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 truncate">
                      {lead.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      <span className="font-semibold text-primary-700">+91{lead.phone}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        {getSourceIcon(lead.source)} {lead.source}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {/* Removed dropdown from here */}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {lead.dateReceived}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[100px] truncate">
                      {lead.notes ? 'View Notes' : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
                      <Button
                        onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id, e); }}
                        variant="ghost"
                        size="sm"
                        title="Delete Lead"
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-center text-gray-500">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details & Edit Modal */}
      {currentSelectedLead && (
        <Modal isOpen={isLeadDetailsModalOpen} onClose={() => setIsLeadDetailsModalOpen(false)} title={`Lead Details: ${currentSelectedLead.name}`} size="screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3"> {/* Reduced gap-x and gap-y to 3 */}
            <Input
              label="Lead ID"
              value={currentSelectedLead.id}
              disabled
            />
            <Input
              label="Name"
              value={currentSelectedLead.name}
              onChange={(e) => setCurrentSelectedLead(prev => prev ? {...prev, name: e.target.value} : null)}
            />
            <Input
              label="Email"
              type="email"
              value={currentSelectedLead.email}
              onChange={(e) => setCurrentSelectedLead(prev => prev ? {...prev, email: e.target.value} : null)}
            />
            <Input
              label="Phone"
              value={currentSelectedLead.phone}
              onChange={(e) => setCurrentSelectedLead(prev => prev ? {...prev, phone: e.target.value.replace(/\D/g, '')} : null)}
              helperText="Enter 10-digit number. +91 will be added automatically."
            />
            <Input
              label="Date Received"
              type="date"
              value={currentSelectedLead.dateReceived}
              onChange={(e) => setCurrentSelectedLead(prev => prev ? {...prev, dateReceived: e.target.value} : null)}
            />
            <div>
              <label htmlFor="leadSourceModal" className="block text-gray-700 font-medium mb-1">Source</label>
              <select
                id="leadSourceModal"
                value={currentSelectedLead.source}
                onChange={(e) => setCurrentSelectedLead(prev => prev ? {...prev, source: e.target.value as Lead['source']} : null)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-gray-300"
              >
                <option value="Social Media">Social Media</option>
                <option value="Call">Call</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Event">Event</option>
              </select>
            </div>
            {/* Status dropdown now only in modal */}
            <div>
              <label htmlFor="leadStatusModal" className="block text-gray-700 font-medium mb-1">Status</label>
              <select
                id="leadStatusModal"
                value={currentSelectedLead.status}
                onChange={(e) => setCurrentSelectedLead(prev => prev ? {...prev, status: e.target.value as Lead['status']} : null)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-gray-300"
              >
                {LEAD_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            {/* Notes textarea spans full width */}
            <div className="md:col-span-2">
              <label htmlFor="leadNotesModal" className="block text-gray-700 font-medium mb-1">Notes</label>
              <textarea
                id="leadNotesModal"
                value={currentSelectedLead.notes}
                onChange={(e) => setCurrentSelectedLead(prev => prev ? {...prev, notes: e.target.value} : null)}
                rows={5}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-gray-300"
              />
            </div>

            {/* Actions within Modal - Separated into two groups */}
            <div className="md:col-span-2 flex justify-between items-center pt-4 border-t mt-6">
                {/* Call & Chat Buttons */}
                <div className="flex space-x-2">
                    <Button
                        onClick={() => currentSelectedLead && handleCallLead(currentSelectedLead)}
                        variant="secondary"
                        className="flex items-center"
                    >
                        <PhoneCall size={18} className="mr-2" /> Call Lead
                    </Button>
                    <Button
                        onClick={() => currentSelectedLead && handleChatLead(currentSelectedLead)}
                        variant="secondary"
                        className="flex items-center"
                    >
                        <MessageSquareText size={18} className="mr-2" /> Chat on WhatsApp
                    </Button>
                </div>
                {/* Save & Cancel Buttons */}
                <div className="flex space-x-3">
                    <Button onClick={() => setIsLeadDetailsModalOpen(false)} variant="secondary">Cancel</Button>
                    <Button onClick={() => currentSelectedLead && handleSaveLeadDetails(currentSelectedLead)}>
                        <CheckCircle size={16} className="mr-2"/> Save Changes
                    </Button>
                </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeadsManagement;
