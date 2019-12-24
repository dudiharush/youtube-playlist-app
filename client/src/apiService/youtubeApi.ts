import axios from "axios";
import { YOUTUBE_API_KEY } from "../keys";

//@ts-ignore
if(YOUTUBE_API_KEY ===  "ENTER KEY HERE"){
  alert("please provide a YOUTUBE_API_KEY first!")
}


export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  params: {
    part: "snippet,contentDetails",
    maxResults: 1,
    key: YOUTUBE_API_KEY
  }
});
