import axios from 'axios';

const api = axios.create({
    baseURL: 'https://loli-type-racing-backend.herokuapp.com',
});

export default api;
