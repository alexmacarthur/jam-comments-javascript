interface IFetchData {
  path: string, 
  domain: string, 
  apiKey: string, 
  platform: string,
  embedScript?: boolean
}

const isProduction = (): boolean => {
    if(typeof process === 'undefined') {
        return false;
    }

    return process.env?.NODE_ENV === 'production' || process.env?.JAM_COMMENTS_ENV == 'production';
}

const getBaseUrl = () => {
    if(typeof process !== 'undefined' && process.env?.JAM_COMMENTS_BASE_URL) {
        return process.env['JAM_COMMENTS_BASE_URL'];
    }
    
    return "https://go.jamcomments.com";
}

export const markupFetcher = (platform: string, fetchImplementation = fetch): Function => {
    return async ({
        path, 
        domain, 
        apiKey
    }: IFetchData) => {
        const params = new URLSearchParams({
            path: path || "/",
            domain
        });

        if(!isProduction()) {
            params.set('stub', 'true');
        }

        const requestUrl = `${getBaseUrl()}/api/markup?${params}`;
        const response = await fetchImplementation(requestUrl, {
            method: 'GET', 
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
                'X-Platform': platform
            }
        });

        if(response.status === 401) {
            throw `JamComments: Unauthorized! Are your domain and API key set correctly?`;
        }

        if(!response.ok) {
            throw `JamComments request failed! Status code: ${response.status}, message: ${response.statusText}, request URL: ${requestUrl}`;
        }

        return await response.text();
    }
}
