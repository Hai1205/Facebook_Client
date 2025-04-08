const normalizeUrl = (url: string) => {
    if (!url) return ""; 
    return url.startsWith("http") ? url : `https://${url}`;
};

export default normalizeUrl;