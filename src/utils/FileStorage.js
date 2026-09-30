// utils/fileStorage.js
export const storeFileInSession = (file, key) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
            const fileData = {
                name: file.name,
                size: file.size,
                type: file.type,
                base64: reader.result,
                uploadedAt: new Date().toISOString()
            };
            sessionStorage.setItem(key, JSON.stringify(fileData));
            resolve(fileData);
        };
        reader.readAsDataURL(file);
    });
};

export const getFileFromSession = (key) => {
    const stored = sessionStorage.getItem(key);
    if (stored) {
        const fileData = JSON.parse(stored);
        // Convert base64 back to File object
        return fetch(fileData.base64)
            .then(res => res.blob())
            .then(blob => new File([blob], fileData.name, { type: fileData.type }));
    }
    return null;
};

export const clearFileFromSession = (key) => {
    sessionStorage.removeItem(key);
};
