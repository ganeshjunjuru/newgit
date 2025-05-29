import React from 'react';

// Define the props for the Spacer component
interface SpacerProps {
  height?: string; // Tailwind CSS height class (e.g., 'h-8', 'py-16')
}

const Spacer: React.FC<SpacerProps> = ({ height = 'h-16' }) => {
  return (
    // A simple div that acts as a vertical spacer
    // The height prop will determine the amount of space
    <div className={height}>
      {/* This component intentionally renders nothing visible, only creates space */}
    </div>
  );
};

export default Spacer;
