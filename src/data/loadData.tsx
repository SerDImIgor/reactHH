export class ErrorNet extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'CustomerError';
    }
}

export const loadData = async (url:string) =>
{
    try {
    const res = await fetch(url);
    if (!res.ok) {
        throw new ErrorNet('Could not get json');
    }
    const data = await res.json();
    return data
    } catch{
        throw new ErrorNet('Could not featch the data for that resource');
    }
} 