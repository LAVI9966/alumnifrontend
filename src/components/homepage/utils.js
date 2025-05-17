// utils.js - Utility functions for the application
export const timeAgo = (timestamp) => {
    if (!timestamp) return "Invalid date";

    const now = new Date();
    const past = new Date(timestamp);

    if (isNaN(past.getTime())) return "Invalid date"; // Handle invalid timestamps

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 1) return "Just now"; // If less than 1 second difference

    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const count = Math.floor(diffInSeconds / seconds);
        if (count > 0) {
            return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
        }
    }

    return "Just now";
};

// Generate a unique post URL for sharing that includes the alumni path
export const generatePostUrl = (postId) => {
    if (typeof window === 'undefined') {
        return `/alumni/post/${postId}`;
    }
    return `${window.location.origin}/alumni/post/${postId}`;
};

// Helper function to truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Format number for display (e.g., 1000 -> 1K)
export const formatNumber = (num) => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    return (num / 1000000).toFixed(1) + 'M';
};

// Extract file name from a path
export const getFileNameFromPath = (path) => {
    if (!path) return '';
    return path.split('\\').pop().split('/').pop();
};

// Helper to check if device is mobile
export const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

// Share utilities for different platforms
export const shareUtils = {
    // Create formatted content for sharing
    formatShareContent: (postData) => {
        const text = postData.content || '';
        const truncatedText = truncateText(text, 100);
        return truncatedText;
    },

    // Generate share URLs for different platforms
    generateShareUrl: (platform, postData) => {
        const postUrl = generatePostUrl(postData._id);
        const text = shareUtils.formatShareContent(postData);

        switch (platform) {
            case 'facebook':
                return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
            case 'twitter':
                return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
            case 'linkedin':
                return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
            case 'whatsapp':
                return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${postUrl}`)}`;
            case 'email':
                return `mailto:?subject=Check out this post&body=${encodeURIComponent(`${text} ${postUrl}`)}`;
            default:
                return postUrl;
        }
    },

    // Native share API for mobile devices
    nativeShare: async (postData) => {
        if (typeof navigator.share !== 'function') return false;

        try {
            await navigator.share({
                title: 'Check out this post',
                text: shareUtils.formatShareContent(postData),
                url: generatePostUrl(postData._id),
            });
            return true;
        } catch (error) {
            console.error('Error sharing:', error);
            return false;
        }
    },
};