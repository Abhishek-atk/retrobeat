const { usersSchema, songdataSchema } = require("../db/schema");
const usersDB = usersSchema;
const songdataDB = songdataSchema;

module.exports = {
  getallUsers: () => {
    return new Promise(async (reslove, reject) => {
      const allUsers = await usersDB.find().lean().exec();
      reslove(allUsers);
    });
  },
  addNewSong: (data) => {
      return new Promise(async (reslove, reject) => {
          console.log("admincontrollers");
          songdataDB.create(data);
          reslove({msg: "New Song Added"});
      })
  },
  getallSongs: () => {
    return new Promise(async (reslove, reject) => {
      const allSongs = await songdataDB.find().sort({ _id: 'desc' }).lean().exec();  
        reslove(allSongs);
        reject({ msg: "Something went wrong" });
    });
  },
  deleteSong: (id) => {
    return new Promise(async (reslove, reject) => {
      const deleteSong = await songdataDB.deleteOne({ _id: id }).lean().exec();
      reslove(deleteSong);
    });
  },
  getuserNumber: () => {
    return new Promise(async (reslove, reject) => {
      const userNumber = await usersDB.countDocuments().lean().exec();
      reslove(userNumber);
    });
  },
  getsongNumber: () => {
    return new Promise(async (reslove, reject) => {
      const songNumber = await songdataDB.countDocuments().lean().exec();
      reslove(songNumber);
    });
  },
  geteditsongDetails: (songId) => {
    return new Promise(async (reslove, reject) => {
      const editsongDetails = await songdataDB.findOne({ _id: songId }).lean().exec();
      reslove(editsongDetails);
    });
  },
  editSong: (songId, editsongData) => {
    return new Promise(async (reslove, reject) => {
      const editSong = await songdataDB.updateOne({ _id: songId }, editsongData).lean().exec();
      reslove(editSong);
    })
  },

};
