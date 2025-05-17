// ShareService.js - Client-side service for sharing posts
import gettoken from "@/app/function/gettoken";

const url = process.env.NEXT_PUBLIC_URL;

class ShareService {
    /**
     * Share a post via the API
     * @param {string} postId - The ID of the post to share
     * @returns {Promise<{success: boolean, shares: number, message: string}>}
     */
    static async sharePost(postId) {
        try {
            const token = await gettoken();
            const response = await fetch(`${url}/api/posts/${postId}/share`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    shares: data.shares,
                    message: data.message || "Post shared successfully!"
                };
            } else {
                return {
                    success: false,
                    message: data.message || "Failed to share post."
                };
            }
        } catch (error) {
            console.error("Error sharing post:", error);
            return {
                success: false,
                message: "An error occurred while sharing the post."
            };
        }
    }

    /**
     * Share post to social media platforms
     * @param {Object} postData - The post data to share
     * @param {string} platform - The platform to share to (facebook, twitter, linkedin, whatsapp)
     * @returns {boolean} - Whether the share action was initiated
     */
    static shareToSocialMedia(postData, platform) {
        // Create the share URL based on the platform
        const postUrl = `${window.location.origin}/post/${postData._id}`;
        const text = `Check out this post: ${postData.content.substring(0, 50)}${postData.content.length > 50 ? '...' : ''}`;

        let shareUrl;

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + postUrl)}`;
                break;
            default:
                return false;
        }

        // Open the share dialog in a new window
        window.open(shareUrl, '_blank', 'width=600,height=400');
        return true;
    }

    /**
     * Copy the post link to clipboard
     * @param {string} postId - The ID of the post
     * @returns {Promise<boolean>} - Whether the copy was successful
     */
    static async copyPostLink(postId) {
        try {
            const postUrl = `${window.location.origin}/post/${postId}`;
            await navigator.clipboard.writeText(postUrl);
            return true;
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            return false;
        }
    }
}

export default ShareService;