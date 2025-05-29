// ImageCarousel.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useCallback
import { useCarouselStore, CarouselImage } from '../../store/webscrollStore'; // Adjust path if needed

// Props interface for the ImageCarousel component
interface ImageCarouselProps {
    interval?: number; // Optional: time in milliseconds for auto-scroll (default: 3000ms)
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ interval = 3000 }) => {
    // --- State management using Zustand ---
    const { images, loading, error, fetchImages } = useCarouselStore();

    // --- Local component states ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showExternalLinkDialog, setShowExternalLinkDialog] = useState(false);
    const [externalLinkUrl, setExternalLinkUrl] = useState<string | null>(null);

    // --- Ref for auto-scrolling interval ---
    const autoScrollRef = useRef<number | null>(null);

    // --- Get current domain for internal/external link check ---
    const currentDomain = window.location.hostname;

    // Helper function to check if a URL is internal
    const isInternalLink = useCallback((url: string): boolean => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname === currentDomain;
        } catch (e) {
            // Invalid URL, treat as external or non-navigable
            return false;
        }
    }, [currentDomain]);

    // --- Effect to fetch images when the component mounts ---
    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    // --- Auto-scrolling logic ---
    useEffect(() => {
        if (images.length > 0 && !loading) {
            startAutoScroll();
        } else {
            stopAutoScroll();
        }
        return () => stopAutoScroll();
    }, [images, interval, loading]);

    // Helper function to start the auto-scrolling timer
    const startAutoScroll = () => {
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
        }
        if (images.length > 0) {
            autoScrollRef.current = window.setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, interval);
        }
    };

    // Helper function to stop the auto-scrolling timer
    const stopAutoScroll = () => {
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
            autoScrollRef.current = null;
        }
    };

    // --- Navigation functions (Previous/Next/Go to Slide) ---
    const goToPrevious = () => {
        stopAutoScroll();
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        startAutoScroll();
    };

    const goToNext = () => {
        stopAutoScroll();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        startAutoScroll();
    };

    const goToSlide = (index: number) => {
        stopAutoScroll();
        setCurrentIndex(index);
        startAutoScroll();
    };

    // --- Handle image click for navigation ---
    const handleImageClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
        // Prevent default navigation if we are handling it
        event.preventDefault();

        const currentImage = images[currentIndex];
        if (!currentImage || !currentImage.linkedTo || currentImage.linkedTo.trim() === '') {
            // No link, do nothing
            return;
        }

        stopAutoScroll(); // Stop auto-scroll on interaction

        const link = currentImage.linkedTo.trim();

        if (isInternalLink(link)) {
            // If it's an internal link, navigate directly in the same tab
            // For a full SPA, you'd use a router's navigate function here (e.g., history.push(link))
            // For this example, simply changing window.location is enough, but be aware it causes a full reload.
            window.location.href = link;
        } else {
            // If it's an external link, show the dialog
            setExternalLinkUrl(link);
            setShowExternalLinkDialog(true);
        }
    };

    // --- Handle dialog confirmation/cancellation ---
    const confirmExternalRedirect = () => {
        if (externalLinkUrl) {
            window.open(externalLinkUrl, '_blank', 'noopener noreferrer'); // Open in new tab
        }
        setShowExternalLinkDialog(false);
        setExternalLinkUrl(null);
        startAutoScroll(); // Restart auto-scroll after interaction
    };

    const cancelExternalRedirect = () => {
        setShowExternalLinkDialog(false);
        setExternalLinkUrl(null);
        startAutoScroll(); // Restart auto-scroll after interaction
    };

    // --- Conditional Rendering based on Zustand store states ---
    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh] w-full text-lg text-gray-700">
                Loading carousel images...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[80vh] w-full text-lg text-red-600">
                Error: {error}
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="flex items-center justify-center h-[80vh] w-full text-lg text-gray-500">
                No images to display in the carousel.
            </div>
        );
    }

    // Determine if the current image has any link (internal or external)
    const currentImage = images[currentIndex];
    const hasAnyLink = currentImage && currentImage.linkedTo && currentImage.linkedTo.trim() !== '';

    return (
        <div
            className="relative w-full overflow-hidden rounded-lg shadow-lg"
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
            style={{ height: '80vh' }}
        >
            {/* Conditionally render clickable wrapper if any link exists */}
            {hasAnyLink ? (
                <a
                    href={isInternalLink(currentImage.linkedTo!) ? currentImage.linkedTo! : '#'} // Set href for internal, '#' for external
                    onClick={handleImageClick}
                    className="block w-full h-full cursor-pointer"
                    aria-label={`Learn more about ${currentImage.altText}`}
                    // For external links, target and rel are handled by window.open in handleImageClick
                    // For internal links, let browser handle normal navigation if href is set
                    target={isInternalLink(currentImage.linkedTo!) ? '_self' : undefined}
                    rel={isInternalLink(currentImage.linkedTo!) ? undefined : 'noopener noreferrer'}
                >
                    <img
                        src={currentImage.imageUrl}
                        alt={currentImage.altText}
                        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                        style={{ opacity: 1 }}
                        onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/1200x600/cccccc/333333?text=Image+Not+Found';
                            e.currentTarget.alt = 'Image failed to load';
                        }}
                    />
                </a>
            ) : (
                // If no link, just display the image
                <img
                    src={currentImage.imageUrl}
                    alt={currentImage.altText}
                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    style={{ opacity: 1 }}
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/1200x600/cccccc/333333?text=Image+Not+Found';
                        e.currentTarget.alt = 'Image failed to load';
                    }}
                />
            )}

            {/* Navigation buttons (Previous/Next) */}
            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
                aria-label="Previous image"
            >
                &#10094; {/* Left arrow character */}
            </button>
            <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors"
                aria-label="Next image"
            >
                &#10095; {/* Right arrow character */}
            </button>

            {/* Dot indicators for manual navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full focus:outline-none transition-colors ${
                            currentIndex === index ? 'bg-white' : 'bg-gray-400 hover:bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            {/* External Link Confirmation Dialog (simple window.confirm for demonstration) */}
            {showExternalLinkDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                        <h2 className="text-xl font-bold mb-4">External Link Warning</h2>
                        <p className="mb-4">
                            You are about to be redirected to an external website:
                            <br />
                            <strong className="text-blue-600 break-all">{externalLinkUrl}</strong>
                        </p>
                        <p className="mb-6">Do you wish to continue?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmExternalRedirect}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Continue
                            </button>
                            <button
                                onClick={cancelExternalRedirect}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCarousel;