// EventShareService.js - Client-side service for handling event sharing
import gettoken from "@/app/function/gettoken";

const url = process.env.NEXT_PUBLIC_URL;

class EventShareService {
    /**
     * Share an event via social media or other methods
     * @param {Object} eventData - The event data to share
     * @param {string} platform - The platform to share to (facebook, twitter, linkedin, whatsapp)
     * @returns {boolean} - Whether the share action was initiated
     */
    static shareToSocialMedia(eventData, platform) {
        // Create the share URL based on the platform
        const eventUrl = EventShareService.getEventUrl(eventData._id);
        const title = eventData.title || 'Event';
        const description = eventData.description || '';
        const date = eventData.date ? new Date(eventData.date).toLocaleDateString() : '';

        const text = `Check out this event: "${title}" on ${date}${description ? ` - ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}` : ''}`;

        let shareUrl;

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + eventUrl)}`;
                break;
            default:
                return false;
        }

        // Open the share dialog in a new window
        window.open(shareUrl, '_blank', 'width=600,height=400');
        return true;
    }

    /**
     * Get the correct URL for an event
     * @param {string} eventId - The ID of the event
     * @returns {string} - The complete URL to the event
     */
    static getEventUrl(eventId) {
        if (typeof window === 'undefined') {
            return `/alumni/events/${eventId}`;
        }

        // URL for events inside alumni folder
        return `${window.location.origin}/alumni/events/${eventId}`;
    }

    /**
     * Copy the event link to clipboard
     * @param {string} eventId - The ID of the event
     * @returns {Promise<boolean>} - Whether the copy was successful
     */
    static async copyEventLink(eventId) {
        try {
            const eventUrl = EventShareService.getEventUrl(eventId);
            await navigator.clipboard.writeText(eventUrl);
            return true;
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            return false;
        }
    }

    /**
     * Use the Web Share API if available (mobile devices)
     * @param {Object} eventData - The event data to share
     * @returns {Promise<boolean>} - Whether the share was successful
     */
    static async nativeShare(eventData) {
        if (typeof navigator === 'undefined' || !navigator.share) {
            return false;
        }

        try {
            const title = eventData.title || 'Event';
            const date = eventData.date ? new Date(eventData.date).toLocaleDateString() : '';
            const text = `Check out this event: "${title}" on ${date}`;

            await navigator.share({
                title: title,
                text: text,
                url: EventShareService.getEventUrl(eventData._id),
            });
            return true;
        } catch (error) {
            console.error('Error using native share:', error);
            return false;
        }
    }

    /**
     * Generate calendar file (iCal) for the event
     * @param {Object} eventData - The event data
     * @returns {string} - Base64 encoded iCal file
     */
    static generateCalendarFile(eventData) {
        // Format the event data for iCal
        const title = eventData.title || 'Event';
        const description = eventData.description || '';
        const dateObj = eventData.date ? new Date(eventData.date) : new Date();

        // Format dates for iCal (YYYYMMDDTHHmmssZ)
        const formatDate = (date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, '');
        };

        const startDate = formatDate(dateObj);

        // End date (assuming 2 hours duration)
        const endDate = formatDate(new Date(dateObj.getTime() + 2 * 60 * 60 * 1000));

        // Create the iCal content
        const icalContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//hacksw/handcal//NONSGML v1.0//EN',
            'BEGIN:VEVENT',
            `UID:${eventData._id}@alumni.app`,
            `DTSTAMP:${formatDate(new Date())}`,
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        // Convert to Base64 for data URI
        const base64 = btoa(icalContent);
        return `data:text/calendar;charset=utf-8;base64,${base64}`;
    }

    /**
     * Download calendar event
     * @param {Object} eventData - The event data
     */
    static downloadCalendarEvent(eventData) {
        const calendarData = this.generateCalendarFile(eventData);
        const link = document.createElement('a');
        link.href = calendarData;
        link.download = `${eventData.title || 'event'}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default EventShareService;