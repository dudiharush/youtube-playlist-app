import axios from 'axios';
const KEY = 'AIzaSyBjvnxGPUPE7wV0seQZTF8GO17pAyCcaLU';

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    params: {
        part: 'snippet,contentDetails',
        maxResults: 1,
        key: KEY
    }
})