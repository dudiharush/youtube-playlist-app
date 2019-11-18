import axios from 'axios';
import youtubeApi from './youtubeApi';
const instance =  axios.create({
    baseURL: 'http://www.localhost:8081'
})

export const addVideoId = (videoId: string) => instance.patch('/playlist', {op: 'add'},
    {
        params: {
            videoId
        } 
    }
)

export const removeVideoId = (videoId: string) => instance.patch('/playlist', {op: 'remove'},
    {
        params: {
            videoId
        } 
    }
)



export const getVideoIds = () => instance.get('/playlist')

export const getVideosDataByIds = async (videoIds: string[]) => {
    const response = await youtubeApi.get('/videos', {
        params: {
        id: videoIds.join()
        }
    });
    return response.data;
}

export const getPlaylistVideosData = async () => {
    const {data: videoIds} = await getVideoIds();
    const data = await getVideosDataByIds(videoIds);
    return data;
}