
const { usersSchema, songdataSchema, playlistSchema } = require("../db/schema");
const usersDB = usersSchema;
const songdataDB = songdataSchema;
const playlistsDB = playlistSchema
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const ObjectId = require('mongoose').Types.ObjectId



module.exports = {
  doSignup: (data) => {
    return new Promise(async (resolve, reject) => {
      const userExist = await usersDB.findOne({ email: data.email });
      if (userExist) {
        reject({ msg: "User Already Exist" });
      } else {
        data.password = await bcrypt.hash(data.password, 10);
        const user = await usersDB.create(data)
        const token = jwt.sign(
          { username: user.username },
          process.env.JWT_SECRET
        );
        console.log(user);
        resolve({ msg: "New User Created", user: user, status: true, token: token });
      }
    });
  },

  doLogin: (data) => {
    const { email, password } = data;
    return new Promise(async (resolve, reject) => {
      const userExist = await usersDB.findOne({ email: email }).lean().exec();
      if (userExist) {
        bcrypt.compare(password, userExist.password, (err, response) => {
          if (response) {
            const token = jwt.sign(
              { username: userExist.username },
              process.env.JWT_SECRET
            );
            resolve({
              status: true,
              user: userExist,
              msg: "Login Successful",
              token: token,
            });
          } else {
            resolve({ status: false, msg: "Email or password incorrect" });
          }
        });
      } else {
        resolve({ status: false, msg: "Email or password incorrect" });
      }
    });
  },
  getnewtenSongs: () => {
    try {
      const songDatas = songdataDB.find().sort({ _id: 'desc' }).limit(10).lean().exec();
      return songDatas
    } catch (error) {

    }
  },
  addfavoriteSong: (userId, songId) => {
    return new Promise(async (resolve, reject) => {
      const addfavsong = await usersDB.updateOne({ _id: userId }, { $push: { 'favoriteItems.favoriteSongIds': songId } }).lean().exec();
      const favSongs = await usersDB.findOne({ _id: userId }).lean().exec();
      const favsongsId = favSongs.favoriteItems.favoriteSongIds
      resolve({ msg: "Song Added to fav", ids: favsongsId });
      reject({ msg: "error" });
    })
  },
  getfavoriteSongs: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let getfavSongs = await usersDB.aggregate([
          {
            $match: {
              _id: new ObjectId(userId)
            }
          },
          {
            $project: {
              _id: null,
              favoriteItems: "$favoriteItems"
            }
          }
        ]);
        if (getfavSongs.length === 0 || !getfavSongs[0].favoriteItems) {
          resolve({ favSongsId: []});
        } else {
          const favSongsId = getfavSongs[0].favoriteItems.favoriteSongIds || [];
          resolve(favSongsId);
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  removefavoriteSong: (userId, songId) => {
    return new Promise(async (resolve, reject) => {
      const removefavsong = await usersDB.updateOne({ _id: userId }, { $pull: { 'favoriteItems.favoriteSongIds': songId } }).lean().exec();
      const favSongs = await usersDB.findOne({ _id: userId }).lean().exec();
      const favsongsId = favSongs.favoriteItems.favoriteSongIds
      resolve({ msg: "Song Removed from fav", ids: favsongsId });
      reject({ msg: "error" });
    })
  },
  getAllFavoriteSongs: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const getfavSongs = await usersDB.aggregate([
          {
            $match: {
              _id: new ObjectId(userId)
            }
          },
          {
            $project: {
              _id: null,
              favoriteItems: "$favoriteItems.favoriteSongIds"
            }
          }
        ]);

        if (getfavSongs.length === 0 || !getfavSongs[0].favoriteItems) {
          resolve({ favSongsId: [] });
        } else {
          const favSongsId = getfavSongs[0].favoriteItems || [];

          // Use the $lookup stage to fetch song data for the favorite song IDs
          const songData = await songdataDB.aggregate([
            {
              $match: {
                _id: { $in: favSongsId.map(id => new ObjectId(id)) }
              }
            }
          ]);
          resolve(songData);
        }
      } catch (error) {
        reject(error);
      }

  
    })
  },
  getMalayalamSongs: () => {
    return new Promise(async (resolve, reject) => {
      const malayalamSongs = await songdataDB.find({ language: "Malayalam" }).lean().exec();
      resolve(malayalamSongs);
    })
  },
  getTamilSongs: () => {
    return new Promise(async (resolve, reject) => {
      const tamilSongs = await songdataDB.find({ language: "Tamil" }).lean().exec();
      resolve(tamilSongs);
    })
  },
  getHindiSongs: () => {
    return new Promise(async (resolve, reject) => {
      const hindiSongs = await songdataDB.find({ language: "Hindi" }).lean().exec();
      resolve(hindiSongs);
    })
  },
  getEnglishSongs: () => {
    return new Promise(async (resolve, reject) => {
      const englishSongs = await songdataDB.find({ language: "English" }).lean().exec();
      resolve(englishSongs);
    })
  },
  increasesongViews: (songId) => {
    return new Promise(async (resolve, reject) => {
      const song = await songdataDB.findByIdAndUpdate(songId, { $inc: { views: 1 } }, { new: true });
      resolve({ success: true, views: song.views })
    })
  },
  getTopTenSongs: () => {
    return new Promise(async (resolve, reject) => {
      const topTenSongs = await songdataDB.find().sort({ views: -1 }).limit(10).lean().exec();
      resolve(topTenSongs);
    })
  },
  getArtists: () => {
    return new Promise(async (resolve, reject) => {
      const artists = await songdataDB.distinct('artistsName').exec();
      console.log(artists);
      resolve(artists);
    })
  },
  getArtistSongs: (artistName) => {
    return new Promise(async (resolve, reject) => {
      const artistSongs = await songdataDB.find({ artistsName: artistName }).lean().exec();
      resolve(artistSongs);
    })

  },
  createplaylist: (userId, plName) => {
    return new Promise(async (resolve, reject) => {
      await playlistsDB.create({ ownerId: userId, playlistName: plName })
      resolve({ msg: "new playlist created" });

    })
  },
  getyourPlaylists: (userId) => {
    return new Promise(async (resolve, reject) => {
      const playlistExist = await playlistsDB.find({ ownerId: userId }).lean().exec();
      if (!playlistExist) {
        resolve()
      } else {
        resolve(playlistExist)
      }
    })
  },
  savesongtoPlaylist: (plId, songId) => {
    return new Promise(async (resolve, reject) => {
      const playlistExist = await playlistsDB.findOne({ _id: plId }).lean().exec();
      console.log(playlistExist);
      if (playlistExist) {
        await playlistsDB.updateOne({ _id: plId }, { $push: { 'playlistItem': songId } })
        resolve({ msg: "Song Added to playlist" });
      } else {
        reject({ msg: "Something went wrong" })

      }
    })
  },
  getPlaylist: (userId) => {
    return new Promise(async (resolve, reject) => {
      const playlist = await playlistsDB.find({ ownerId: userId }).lean().exec();

      resolve(playlist)

    })
  },
  getplaylistItem: (plId) => {
    return new Promise(async (resolve, reject) => {
      const playlist = await playlistsDB.findOne({ _id: plId }).lean().exec();
      const plsongId = playlist.playlistItem
      const playlistSongs = await songdataDB.find({ _id: { $in: plsongId } }).lean().exec();
      resolve(playlistSongs, { msg: "success" });

    })
  },
  gettrendingSongs: () => {
    return new Promise(async (resolve, reject) => {
      const trendingSongs = await songdataDB.find().sort({ views: -1 }).limit(50).lean().exec();
      resolve(trendingSongs);
    })


  },

  getnewSongs: () => {
    return new Promise(async (resolve, reject) => {
      const newSongs = songdataDB.find().sort({ _id: 'desc' }).limit(50).lean().exec();
      resolve(newSongs);
    })

  },
  search: (searchText) => {
    return new Promise(async (resolve, reject) => {
      const searchResult = await songdataDB.find({ songName: { $regex: searchText, $options: 'i' } }).lean().exec();
      if (!searchResult.length == 0) {
        const artistsName = searchResult[0].artistsName
        const language = searchResult[0].language
        const category = searchResult[0].categories
        const types = searchResult[0].types

        const artistSearch = await songdataDB.find({ artistsName: artistsName }).lean().exec();
        const languageSearch = await songdataDB.find({ language: language }).lean().exec();
        const similerSongs = await songdataDB.find({
          $and: [
            { categories: category },
            { types: types }
          ]
        }).lean().exec();


        resolve({ searchResult, artistSearch, languageSearch, similerSongs })


      } else {
        resolve({ msg: "Search result empty" })

      }

    })

  },
  getsongPage: (songtype) => {
    console.log(songtype);
    return new Promise(async (resolve, reject) => {
      const result = await songdataDB.find({
        $or: [
          { categories: songtype },
          { types: songtype }
        ]
      }).lean().exec();

      if (result.length == 0) {
        resolve([])

      } else {
        console.log(result);
        resolve(result)

      }
    })
  }
};


