import firebase from "react-native-firebase";
import UUIDGenerator from "react-native-uuid-generator";
import { ImageStore } from "react-native";
import { Images } from 'App/Theme'
function getAdminChatRoomRef() {
    return firebase
        .database()
        .ref(`Notices/`)
    //.on("child_added", snapshot => callback(this.parse_admin(snapshot)));
}

const parse_admin = snapshot => {
    const { content, timestamp } = snapshot.val();
    const createdAt = new Date(timestamp);
    const message_list = {
        _id: timestamp,
        text: content,
        createdAt: createdAt,
        user: {
            _id: "admin",
            avatar: Images.Image02
        }
    };
    return message_list;
};

function adminNotifyLastRef() {
    return firebase
        .database()
        .ref(`Notices/`)
        .limitToLast(1)

}

function setUserFCMToken(userID, token, body) {
    if (token !== null) {
        return firebase.database().ref(`PNList/${userID}`)
            .update({
                device_token: token,
            });
    } else {
        return firebase.database().ref(`PNList/${userID}`)
            .update(body);
    }
}

function getIndroductionState(userID, callback) {
    firebase.database().ref(`PNList/${userID}/device_token`)
        .once("value", snapshot => {
            const s = snapshot.val();
            if (s == "") {
                callback(false)
            } else {
                callback(true)
            }

        });
}



function giftNotifyLastRef(userID) {
    return firebase
        .database()
        .ref(`Gifts/${userID}`)
        .limitToLast(1)
}

function giftDateMsgLastRef(userID) {
    return firebase
        .database()
        .ref(`Date/${userID}`)
        .limitToLast(1)
}

function getDateMessageRef(userID) {
    return firebase
        .database()
        .ref(`Date/${userID}`)
}

function getChatRooms(me, other) {
    const firebaseDatabase = firebase.database();
    return firebaseDatabase.ref(`Users/user_${me.id}/friends/user_${other.id}/chatroom`).once('value')
        .then(snapshot => {
            return { ...other, chatRoom: snapshot.val() }
        })
}

function getLastMsg(other) {
    const firebaseDatabase = firebase.database();
    return firebaseDatabase.ref(`Messages/${other.chatRoom}`).limitToLast(1).once("value")
        .then(snapshot2 => {
            let lastMsg = snapshot2.val();
            snapshot2.forEach(function (childSnapshot) {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                lastMsg = childData.message
            });
            return { ...other, lastMsg }
        }).catch(err => {
        })
}

function sendMessage(senderID, receiverID, content, timestamp, sender_avatarUrl, chatroom) {
    UUIDGenerator.getRandomUUID().then(uuid => {
        for (let i = 0; i < content.length; i++) {
            const { text, user } = content[i];
            firebase
                .database()
                .ref(`Messages/${chatroom}`)
                .push({
                    messageId: uuid,
                    senderID: senderID,
                    receiverID: receiverID,
                    message: text,
                    avatarUrl: sender_avatarUrl,
                    timestamp: timestamp
                })
                .then(data => {
                    setLastMessage(senderID, receiverID, text, timestamp, res => { });
                })
                .catch(error => {
                });
        }
    });
}
function setLastMessage(userID, friendID, text, timestamp, callback) {
    firebase
        .database()
        .ref(`Users/user_${userID}/friends/user_${friendID}`).once('value').then(e => {
            firebase
                .database()
                .ref(`Users/user_${userID}/friends/user_${friendID}`).update({
                    last_message: text,
                    last_timestamp: timestamp,
                    isRead: false,
                    count: (e.val().count || 0) + 1,
                    meCount: (e.val().meCount || 0) + 1,
                }).then(data => {
                    callback(true);
                }).catch(error => {
                    callback(false);
                });
            firebase
                .database()
                .ref(`Users/user_${friendID}/friends/user_${userID}`)
                .update({
                    last_message: text,
                    last_timestamp: timestamp,
                    isRead: false,
                    count: (e.val().count || 0) + 1,
                    friendCount: (e.val().meCount || 0) + 1,
                })
                .then(data => {
                    callback(true);
                })
                .catch(error => {
                    callback(false);
                });
        });
}

function setReceivedMatchFeedback(userID, friendID, callback) {
    firebase
        .database()
        .ref(`Users/user_${userID}/friends/user_${friendID}`).update({
            isGivenMatchFeedback: true,
        }).then(data => {
            callback(true);
        }).catch(error => {
            callback(false);
        });
}

function setAskedMatch(userID, friendID, callback) {
    firebase
        .database()
        .ref(`Users/user_${userID}/friends/user_${friendID}`).update({
            isAskedDate: true,
        }).then(data => {
            callback(true);
        }).catch(error => {
            callback(false);
        });
}

const refOn = (chatroom, limitCount) => {
    return firebase
        .database()
        .ref(`Messages/${chatroom}`)
        .limitToLast(limitCount)
};

function getLastMessage(userID, friendID) {
    return firebase
        .database()
        .ref(`Users/user_${userID}/friends/user_${friendID}`)
        .once('value')
}
function getServerTime() {
    firebase.database().ref('time-ref').update({ time: firebase.database.ServerValue.TIMESTAMP });
    return firebase.database().ref('time-ref').once('value')
}

const parse = snapshot => {
    const { messageId, receiverID, message, avatarUrl, timestamp, messageType, giftUrl } = snapshot.val();
    const createdAt = new Date(timestamp);
    const message_list = {
        _id: messageId,
        text: message,
        messageType: messageType,
        createdAt: createdAt,
        giftUrl: giftUrl,
        user: {
            _id: receiverID,
            avatar: avatarUrl
        }
    };
    return message_list;
};

const getGiftMessageRef = (userID) => {
    return firebase
        .database()
        .ref(`Gifts/${userID}`)
};

const setFriends = (userID, friendID, callback) => {
    getChatroom(userID, friendID, res => {
        if (res) {
            callback(res);
        } else {
            firebase
                .database()
                .ref(`Users/user_${userID}/friends/user_${friendID}`)
                .set({
                    friendID: friendID,
                    chatroom: userID + "_" + friendID,
                    last_message: "",
                    last_timestamp: "",
                    isRead: true,
                    isGivenMatchFeedback: false,
                    count: 0,
                    meCount: 0,
                    friendCount: 0,
                    isAskedDate: false
                })
                .then(data => {
                    firebase
                        .database()
                        .ref(`Users/user_${friendID}/friends/user_${userID}`)
                        .set({
                            friendID: userID,
                            chatroom: userID + "_" + friendID,
                            last_message: "",
                            last_timestamp: "",
                            isRead: true,
                            isGivenMatchFeedback: false,
                            count: 0,
                            meCount: 0,
                            friendCount: 0,
                            isAskedDate: false
                        })
                        .then(data => {
                            getChatroom(userID, friendID, res => {
                                callback(res);
                            });
                        })
                        .catch(error => { });
                })
                .catch(error => { });
        }
    });
};

const getFriendList = (userID) => {
    return firebase.database().ref(`Users/user_${userID}/friends`)
    /*.on("child_added", snapshot => {
      const friends = snapshot.val();
      callback(friends);
    });*/
};

export const getChatroom = (userID, friendID, callback) => {
    firebase
        .database()
        .ref(`Users/user_${userID}/friends/user_${friendID}`)
        .on("value", snapshot => {
            const friend = snapshot.val();
            if (friend) {
                callback(friend.chatroom);
            } else {
                callback(false);
            }

        });
};

function updateGift(userID, giftKey, callback) {
    firebase
        .database()
        .ref(`Gifts/${userID}/${giftKey}`)
        .update({
            isRead: true,
        })
        .then(data => {
            callback(true);
        })
        .catch(error => {
            callback(false);
        });
}



export const fbService = {
    adminNotifyLastRef,
    getAdminChatRoomRef,
    parse_admin,

    getGiftMessageRef,
    giftNotifyLastRef,
    getLastMessage,
    getLastMsg,
    getChatRooms,
    refOn,
    sendMessage,
    setLastMessage,
    setAskedMatch,
    getServerTime,
    setReceivedMatchFeedback,
    setFriends,
    getFriendList,
    setUserFCMToken,
    giftDateMsgLastRef,
    getDateMessageRef,
    updateGift,
    parse,
    getIndroductionState
};

/*.then(snapshot2=>{
		const lastMsg = snapshot2.val();
		//Promise.resolve({other, lastMsg})
		return {other, lastMsg}
	})*/
