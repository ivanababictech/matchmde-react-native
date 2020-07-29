import axios from "axios";
import base64 from "react-native-base64";

const myEncodedApiKey = "QUl6YVN5QXRELTVkRzhPa1U4MlRJWTAwa1VtUFQtVUtkaHp3SlE0";
// const API_KEY = "AIzaSyAtD-5dG8OkU82TIY00kUmPT-UKdhzwJQ4";
const API_KEY = base64.decode(myEncodedApiKey);

const notificationAPI =
  "https://us-central1-matchmake-9bf7a.cloudfunctions.net/MatchMde/sendPushNotification";

export const NotificationType = {
  privateChat: "chat",
}

export const sendNotification = (body, callback) => {
  const headers = {
    "Content-Type": "application/json"
  };
  console.log("Notification data:", body);
  axios
    .post(notificationAPI, body, { headers })
    .then(res => {
      callback(res.data);
    })
    .catch(error => {
      console.log("Notification Error:", error);
    });
};

/*export const getPlaceDetail = (place) =>{
  return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.placeID}&key=${API_KEY}`).
          then(res=>{
            if(res.data.result.photos && res.data.result.photos.length>0){
              const photoreference = res.data.result.photos[0].photo_reference
              return {...place, photo:`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoreference}&key=${API_KEY}` }
            }else{
              return {...place, photo:null }
            }
          })
}*/

export function thousands_separators(num) {
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

export function getCorrrectName(name) {
  return name ? name.substring(0, 15) : "";
}

export const getPhotoUrl = str_photos => {
  let temp = str_photos + "";
  temp = temp.replace("[", "");
  temp = temp.replace("]", "");
  temp = temp.replace('"', "");
  temp = temp.replace('"', "");
  let temp_array = temp.split(",");
  return temp_array[0];
};

//const API_KEY = "AIzaSyAtD-5dG8OkU82TIY00kUmPT-UKdhzwJQ4";

export async function getPlaceDetail(placeID, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = e => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      callback(JSON.parse(request.responseText).result);
    } else {
      console.warn("error");
    }
  };

  request.open(
    "GET",
    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${API_KEY}`
  );
  request.send();
}

export async function getPlaceDetailWithCoordinates(lat, long, callback) {
  console.log(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${API_KEY}`
  );
  var request = new XMLHttpRequest();
  request.onreadystatechange = e => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      callback(JSON.parse(request.responseText).results);
    } else {
      console.warn("error");
    }
  };

  request.open(
    "GET",
    `https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${long}&key=${API_KEY}`
  );
  request.send();
}

export async function getPlacePhotos(photoReference, callback) {
  callback(
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`
  );
}
