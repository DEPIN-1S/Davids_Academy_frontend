// hooks/useFileStorage.js
import { useState, useCallback } from 'react';

const useFileStorage = () => {
    const [files, setFiles] = useState(new Map());

    const storeFile = useCallback((key, fileData) => {
        setFiles(prev => new Map(prev).set(key, fileData));
    }, []);

    const getFile = useCallback((key) => {
        return files.get(key);
    }, [files]);

    const removeFile = useCallback((key) => {
        setFiles(prev => {
            const newMap = new Map(prev);
            newMap.delete(key);
            return newMap;
        });
    }, []);

    const createFormData = useCallback((additionalData = {}) => {
        const formData = new FormData();

        // Add files
        files.forEach((fileData, key) => {
            if (fileData?.file) {
                formData.append(key, fileData.file, fileData.name);
            }
        });

        // Add other data
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        });

        return formData;
    }, [files]);

    return {
        storeFile,
        getFile,
        removeFile,
        createFormData,
        hasFiles: files.size > 0
    };
};

export default useFileStorage;
