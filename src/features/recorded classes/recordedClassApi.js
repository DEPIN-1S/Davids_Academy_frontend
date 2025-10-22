const baseUrl = process.env.REACT_APP_API_URL;
export async function listRecordedClasses(token, page = 1, limit = 10, searchQuery = "") {
    const response = await fetch(
        baseUrl + `/admin/record/list`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ page, limit, searchQuery })  // 👈 correct param
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch recorded classes");
    }
    return await response.json();
}




//Delete recorded class
// Delete recorded class
export async function DeleteRecordedClass(recording_id) {
    console.log("Inside delete recording api::", recording_id);
    const token = sessionStorage.getItem("accessToken");
    console.log("Token found:", token);

    // Assuming 'baseUrl' is defined (e.g., imported from a config file)
    // CRITICAL FIX: Use standard template literal `${baseUrl}/path`
    const apiUrl = `${baseUrl}/admin/record/delete`;
    console.log("API URL:", apiUrl);

    try {
        const response = await fetch(
            apiUrl, // Pass the correctly constructed URL string
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ recording_id }),
            }
        );

        console.log("API Response Status:", response.status);

        if (!response.ok) {
            // Attempt to read error message if response status is 4xx/5xx
            const errorText = await response.text();
            console.error("Error Response Body:", errorText);

            // Throw a proper error to be caught by the Redux thunk's catch block
            throw new Error(errorText || "Failed to delete recorded class due to server error.");
        }

        const data = await response.json();
        console.log("API Success Response:", data);
        return data;
    } catch (error) {
        console.error("Catch Block Error:", error);
        // Re-throw the error so the Redux thunk can catch it and use rejectWithValue
        throw error;
    }
}



export async function createRecording(token, recordingData) {
    console.log("recording data ::: ", recordingData);

    console.log("Inside add recording API");
    const formData = new FormData();
    Object.entries(recordingData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    // DEBUG: log all formData contents
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            console.log(`FormData key: ${key}, value: FILE -> name: ${value.name}, size: ${value.size}, type: ${value.type}`);
        } else {
            console.log(`FormData key: ${key}, value: ${value}`);
        }
    }

    /*  const response = await fetch({ baseUrl } + ` /admin/record/create`, {
         method: "POST",
         headers: {
             "Authorization": `Bearer ${token}`
         },
         body: formData
     }); */


    const response = await fetch(`${baseUrl}/admin/record/create`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to create recording");
    }

    const data = await response.json();
    console.log("Response from backend::::::::::::::", data);
    return data;
}


export function base64ToFile(base64String, filename) {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
