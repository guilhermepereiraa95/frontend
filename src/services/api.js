import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smokemeat.herokuapp.com/',
})

// api.interceptors.request.use(async (config) => {
  
//   console.log(config);
  // if(config.method !== 'get' && config.url !== 'produtos'){
  //   try {
  //       const token = await localStorage.getItem('token');
  //       if (token) {
  //         config.header.Authorization = `${token}`;
  //       }
  //       return config;
      
  //   } catch (err) {
  //     alert(JSON.stringify(err))
  //   }
//   }
//    return config;
// })

export default api;