import Builder from "./builder";

const BASE_URL = 'https://api.igdb.com/v4/'
const CLIENT_ID = process.env['API_CLIENT_ID']
const ACCESS_TOKEN = process.env['API_ACCESS_TOKEN']

class Api extends Builder {
    private static instance: Api | null = null;

    constructor() {
        super();
    }

    async get<T>(endpoint: string, callback?: (data: T) => Promise<T>): Promise<T> {
        const { body } = this.build()
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Client-ID': CLIENT_ID!,
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body,
        })
        const data = await response.json()
        return callback ? await callback(data) : data
    }
}

const api = () => new Api();

export default api;