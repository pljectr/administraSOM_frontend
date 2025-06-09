import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACK_SERVER_LOCATION,
  withCredentials: true
});

export default api;