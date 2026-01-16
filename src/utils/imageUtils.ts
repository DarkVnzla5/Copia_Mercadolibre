import { BASE_URL } from "../services/Api";

export const getImageUrl = (path: string | undefined): string => {
    if (!path) return "";
    const stringPath = String(path);
    if (stringPath.startsWith("http") || stringPath.startsWith("data:")) {
        return stringPath;
    }
    return `${BASE_URL}${stringPath}`;
};
