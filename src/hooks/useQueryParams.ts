export const parseQueryParam = () => {
    const search = window.location.search;
    const urlParams = new URLSearchParams(search);
    return {
        redirectUrl: urlParams.get('redirectUrl') || '',
    }
}

const useQueryParam = () => {
    return parseQueryParam();
}


export default useQueryParam;
