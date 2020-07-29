import Realm from "realm";

const userDetails = new Realm({
  schema: [
    {
      name: "userDetails",
      properties: {
        image: "string"
      }
    }
  ]
});

const DBServices = {
  saveUserInfo(data) {
    console.warn(data);
    userDetails.write(() => {
      userDetails.create("userDetails", data, true);
    });
  },

  fetchUserDB() {
    const query = userDetails.objects("userDetails");
    const array = Array.from(query);
    return array;
  }
};

export { DBServices, userDetails };
