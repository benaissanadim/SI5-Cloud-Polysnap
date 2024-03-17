import axios from "axios";
import toast from "react-hot-toast";

const POLYSNAP_API = process.env.REACT_APP_POLYSNAP_API_URL;

axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers["Access-Control-Allow-Headers"] =
  "Origin, X-Requested-With, Content-Type, Accept";

const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
  },
};

export const login = async (data, verify) => {
  try {
    const res = await axios.get(`${POLYSNAP_API}/users/lookup?${data}`, config);
    !verify &&
      toast.success(`Logging successful: Welcome ${res.data.username}!`);
    console.log(res.data);
    window.localStorage.setItem("userdata", JSON.stringify(res.data));
    window.localStorage.setItem("user", res.data.username);
    return res.data;
  } catch (err) {
    toast.error(`Logging unsuccessful: ${err.message}`);
    window.localStorage.removeItem("user");
    return null;
  }
};

export const lookup = async (id) => {
  try{
    const res = await axios.get(`${POLYSNAP_API}/users/lookup?id=${id}`, config);
    return res.data;
  }catch(err){
    toast.error(`Lookup unsuccessful: ${err.message}`);
    return null;
  }
}

export const register = async (data) => {
  try {
    const res = await axios.post(`${POLYSNAP_API}/users/signup`, data,config);
    toast.success(`Registration successful: Welcome ${res.data.username}!`);
    window.localStorage.setItem("userdata", JSON.stringify(res.data));
    window.localStorage.setItem("user", res.data.username);
    return res.data;
  } catch (err) {
    toast.error(`Registration unsuccessful: ${err.message}`);
    window.localStorage.removeItem("user");
    return null;
  }
};

export const addContact = async (data) => {
  try {
    const res = await axios.patch(`${POLYSNAP_API}/users/contacts`, data, config);
    toast.success(`Adding contact successful: ${res.data.username}!`);
    return res.data;
  } catch (err) {
    toast.error(`Adding contact unsuccessful: ${err.message}`);
    return null;
  }
};

export const fetchContactStories = async (data) => {
  try {
    const res = await axios.get(
      `${POLYSNAP_API}/story/contact/${data}`,
      config
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const uploadStoryToService = async (data) => {
  try {
    const res = await axios.post(
      `${POLYSNAP_API}/story/save`,
      data,
      config
    );
    return res.data;
  } catch (err) {}
};

export const getUploadUrl = async (data) => {
  try {
    const res = await axios.post(`${POLYSNAP_API}/story`, data, config);
    return res.data;
  } catch (err) {
    toast.error(`Upload unsuccessful: ${err.message}`);
    return null;
  }
};

export const uploadStory = async (url, type, file) => {
  try {
    const res = await axios.put(url, file, {
      headers: {
        ...config.headers,
        "Content-Type": type,
        "Process-Data": false,
      },
    });
    return res;
  } catch (err) {
    toast.error(`Upload unsuccessful: ${err.message}`);
    return null;
  }
};

export const getUserChats = async (userId) => {
  try{
    const res = await axios.get(`${POLYSNAP_API}/chats?userId=${userId}`, config);
    return res.data;
  }catch(err){
    toast.error(`Getting chats unsuccessful: ${err.message}`);
    return null;
  }
}

export const createChat = async (data) => {
  try{
    const res = await axios.post(`${POLYSNAP_API}/chats`, data, config);
    return res.data;
  }catch(err){
    toast.error(`Creating chat unsuccessful: ${err.message}`);
    return null;
  }
}

export const getLastNMessages = async (chatId,userId, number) => {
  try{
   // console.log(`${MESSAGES_SERVICE_URL}?chatId=${chatId}&userId=${userId}&number=${number}`);  
    const res = await axios.get(`${POLYSNAP_API}/messagereader/messages?chatId=${chatId}&userId=${userId}&number=${number}`, config);
    return res.data;
  }catch(err){
    toast.error(`Getting messages unsuccessful: ${err.message}`);
    return null;
  }
}

export const sendMessage = async (data) => {
  try{
    const res = await axios.post(`${POLYSNAP_API}/messagesender/messages`, data, config);
    return res.data;
  }catch(err){
    toast.error(`Sending message unsuccessful: ${err.message}`);
    return null;
  }
}

// export const uploadAttachement = async (data) => {
//   try{
//     const res = await axios.post(`${MEDIA_SERVICE_URL}/generate-upload-url`, data.upload, config).then((res) => {
      
//     });
//   }catch(err){
//     toast.error(`Uploading attachment unsuccessful: ${err.message}`);
//     return null;
//   }
// }