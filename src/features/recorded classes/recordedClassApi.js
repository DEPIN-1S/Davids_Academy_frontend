export async function listRecordedClasses(token) {
    const response = await fetch(`https://lunarsenterprises.com:6040/davidsacademy/admin/record/list`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch recorded classes");
    }
    return await response.json();
}


//For deleting recorded class
export async function DeleteRecordedClass(recording_id) {
    console.log("Inside delete recording api::");
    
    try {
        const response = await fetch(
            `https://lunarsenterprises.com:6040/davidsacademy/admin/record/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({ recording_id }),
            }
        );

        if (!response.ok) {
            console.log(response);
            throw new Error("Failed to delete recorded class");
        }

        return await response.json();
    } catch (error) {
        console.log("Response from delete recorded class ::: ", error);
        throw error;
    }
}


export async function createRecording(token, recordingData) {
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

    const response = await fetch(`https://lunarsenterprises.com:6040/davidsacademy/admin/record/create`, {
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
