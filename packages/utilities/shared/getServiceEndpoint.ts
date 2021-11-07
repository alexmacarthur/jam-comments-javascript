const DEFAULT_SERVICE_ENDPOINT = "https://service.jamcomments.com";
const DEVELOPMENT_SERVICE_ENDPOINT = "http://localhost:4000";

const getServiceEndpoint = (): string => {
    if(typeof window !== 'undefined' && window['jcForceLocal']) {
        return DEVELOPMENT_SERVICE_ENDPOINT;
    }
    
    return process.env.NODE_ENV === "production" ? DEFAULT_SERVICE_ENDPOINT : DEVELOPMENT_SERVICE_ENDPOINT;
};

export default getServiceEndpoint;
