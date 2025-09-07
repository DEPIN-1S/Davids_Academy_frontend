// src/api/contactApi.js

const baseUrl = process.env.REACT_APP_API_URL;
const accessToken = sessionStorage.getItem('accessToken');
const refreshToken = sessionStorage.getItem('refreshToken');
// POST: Submit a new contact message
export const postContact = async (contactData) => {
    try {
        const response = await fetch(baseUrl + "/student/contact-us", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });
        if (!response.ok) throw new Error("Failed to submit contact message");
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// GET: List all contact messages
export const listContacts = async () => {
    try {
        const response = await fetch(baseUrl + "/admin/list/contact-us", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`, // Send accessToken as Bearer token
                // If your API requires the refresh token, you may also send it:
                // "x-refresh-token": refreshToken
            }
        });
        console.log('response', response);
        if (!response.ok) throw new Error("Failed to list contacts");
        return await response.json();
    } catch (error) {
        throw error;
    }
};


export async function listRecentEnquiries(token) {
    console.log("inside api function of listing enquiries");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/list/contact-us`, {
        method: "POST", 
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch recent enquiries");
    }

    return await response.json();
}
