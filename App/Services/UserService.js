import axios from "axios";
import { Config } from "App/Config";
import { awsConfig } from "App/Config/awsConfig";
import { RNS3 } from "react-native-aws3";
import UUIDGenerator from "react-native-uuid-generator";

const userApiClient = axios.create({
  baseURL: Config.API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  timeout: 30000
});

function fetchUser() {}

function userExist(body) {
  return userApiClient.post("/auth/login", body);
}

function registerUser(body) {
  console.log(body);
  return userApiClient.post("/auth/register", body);
}

function loginWithFacebookInfo(body) {
  return userApiClient.post("/auth/login", body);
}

function dateCoach(body) {
  return userApiClient.post("/date-coach", body);
}

function uploadImageToAWS3(uri) {
  return UUIDGenerator.getRandomUUID().then(uuid => {
    const file = {
      uri: uri,
      name: uuid + ".png",
      type: "image/png"
    };
    return RNS3.put(file, awsConfig).then(response => {
      if (response.status === 201) {
        uploadThumbToAWS3(uri, uuid);
        return Promise.resolve(response.body.postResponse.location);
      } else {
        return Promise.reject(response);
      }
    });
  });
}
const uploadThumbToAWS3 = (uri, uuid) => {
  const file = {
    uri: uri,
    name: uuid + "_thumb.png",
    type: "image/png"
  };
  RNS3.put(file, awsConfig).then(response => {
    if (response.status === 201) {
    } else {
    }
  });
};

function accountGetProfile(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/account/profile");
}

function accountGetSetting(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/account/settings");
}

function accountGetFilter(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/filter");
}

function accountGetPhotos(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/photos");
}

function accountPremium(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/subscriptions");
}

function accountBoost(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/boosts");
}

function accountLuxe(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/purchase_items");
}

function accountTransferSend(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/transfers");
}

function accountTransferReceive(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/transfers");
}

function accountGifts(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/gifts");
}

function accountHangouts(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/hangouts");
}

function accountTask(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/account/rewards");
}

function discover(access_token, page) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get(`/discover?page=${page}`);
}

function matches(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/matches?is_new=true");
}

function nextPage(access_token, nextPageUrl) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get(nextPageUrl);
}

function likeUnlike(access_token, body) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.post("/likes", body);
}

function listAllLikers(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/likes");
}

function listAllMatchers(access_token) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/matches");
}

function fetchMostDesired(access_token, params) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get("/stars", { params: params });
}

function uploadOnePhoto(access_token, params) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.post("/photos", params);
}

function updatePhotos(access_token, params) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.put("/photos", params);
}

function deletePhotoItem(access_token, photoId) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.delete(`/photos/${photoId}`);
}

function post(access_token, endpoint, body) {
  // console.log('Post Log:', access_token, endpoint, body);
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.post(endpoint, body);
}

function put(access_token, endpoint, body) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.put(endpoint, body);
}

function delete_request(access_token, endpoint) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.delete(endpoint);
}

function get_request(access_token, endpoint) {
  userApiClient.defaults.headers.common["Authorization"] =
    "Bearer " + access_token;
  return userApiClient.get(endpoint);
}

function getServerTimestamp() {
  return userApiClient.get("/get_server_timestamp");
}

function calcAge(dobStr) {
  let dob = toDate(dobStr);
  const diff_ms = Date.now() - dob.getTime();
  const age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function toDate(dateStr) {
  var parts = (dateStr || "").split("-");
  //return new Date(parts[2], parts[1] - 1, parts[0])
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export const userService = {
  fetchUser,

  uploadImageToAWS3,
  userExist,
  registerUser,
  loginWithFacebookInfo,
  accountGetProfile,
  accountGetSetting,
  accountGetFilter,
  accountGetPhotos,
  accountPremium,
  accountBoost,
  accountLuxe,
  accountTransferSend,
  accountTransferReceive,
  accountGifts,
  accountHangouts,
  accountTask,
  discover,
  matches,
  calcAge,

  likeUnlike,
  listAllLikers,
  listAllMatchers,
  fetchMostDesired,
  uploadOnePhoto,
  updatePhotos,
  deletePhotoItem,
  getServerTimestamp,
  post,
  put,
  delete_request,
  get_request,
  dateCoach
};
