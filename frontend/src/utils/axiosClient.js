import axios from 'axios';

const axiosClient = axios.create({
    baseUrl:import.meta.env.VITE_API_BASE_URL|| 'http://localhost:5000',
    headers:{
        'Content-Type':'application/json',
    },
    withCredentials:true,
})


export default axiosClient;