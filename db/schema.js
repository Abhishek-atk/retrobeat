const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  favoriteItems: {
    favoriteSongIds: { type: String }
  }

});

const songdataSchema = new mongoose.Schema({
  songName: {
    type: String,
    required: true,
  },
  artistsName: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  types: {
    type: String,
    required: true,
  },
  songimgName: {
    type: String,
    required: true,
  },
  songfileName: {
    type: String,
    required: true
  },
  views: { type: Number, default: 0 },
  duration: { type: String, required: true }
});

const playlistSchema = new mongoose.Schema({
  ownerId: { type: String },
  playlistName: { type: String },
  playlistItem: { type: String }
});

module.exports = {
  usersSchema: mongoose.model("Users", usersSchema),
  songdataSchema: mongoose.model("songdata", songdataSchema),
  playlistSchema: mongoose.model("playlists", playlistSchema)

}