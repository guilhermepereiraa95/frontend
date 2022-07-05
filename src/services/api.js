import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smokemeat.herokuapp.com/',
})

export default api;