var express = require('express');
var router = express.Router();
const userController = require('../controllers/userControllers');
const { verifyToken, verifyloggedIn } = require('../middleware/middlewares');
require("dotenv").config();


/* GET users Home page. */
router.get('/', async (req, res) => {
  let loggedIn;
  const username = req.cookies.username;
  const token = req.cookies.token;
  const isAdmin = req.cookies.admin;
  const boolStatus = isAdmin ? isAdmin === "true" : false;
  if (!token) {
    loggedIn = false;
  } else {
    loggedIn = true;
  }
  const newTenSongs = await userController.getnewtenSongs()
  const favsongId = await userController.getfavoriteSongs(req.cookies.id)
  const topTenSongs = await userController.getTopTenSongs()
  const playlists = await userController.getyourPlaylists(req.cookies.id)
  res.render("users/home", {
    isAdmin: boolStatus,
    username: username,
    loggedIn: loggedIn,
    newTenSongs,
    favsongId,
    topTenSongs,
    playlists
  });
});


router.get('/new-home', async (req, res) => {
  let loggedIn;
  const username = req.cookies.username;
  const token = req.cookies.token;
  const isAdmin = req.cookies.admin;
  const boolStatus = isAdmin ? isAdmin === "true" : false;
  if (!token) {
    loggedIn = false;
  } else {
    loggedIn = true;
  }
  const newTenSongs = await userController.getnewtenSongs()
  const favsongId = await userController.getfavoriteSongs(req.cookies.id)
  const topTenSongs = await userController.getTopTenSongs()

  res.render("users/newHome", {
    isAdmin: boolStatus,
    username: username,
    loggedIn: loggedIn,
    newTenSongs,
    favsongId,
    topTenSongs
  });
});

router.get("/login", (req, res) => {
  res.render("users/login");
});
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  await userController.doSignup(body).then((response) => {
    if (response.status) {
      res.cookie("username", response.user.username, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
      });
      res.cookie("id", response.user._id, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
      });
      res.cookie("token", response.token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
      });

      res.cookie("admin", response.user.isAdmin, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
      });
      res.redirect("/");
    } 
  }).catch((error) => {
    res.redirect("/signup");
  })
})

router.post("/login", async (req, res) => {
  await userController.doLogin(req.body).then((response) => {
    if (response.status) {
      res.cookie("username", response.user.username, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
      });
      res.cookie("id", response.user._id, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
      });
      res.cookie("token", response.token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
      });

      res.cookie("admin", response.user.isAdmin, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
      });
      res.redirect("/");
    } else {
      res.render("users/login", { error:"eorr"})
    }
  })
})

router.get("/logout", (req, res) => {
  res.clearCookie("admin");
  res.clearCookie("token");
  res.clearCookie("username");
  res.redirect("/");
})

router.post("/add-favorite-song", verifyloggedIn, (req, res) => {
  const songId = req.body.songId
  const userId = req.cookies.id

  userController.addfavoriteSong(userId, songId).then((response) => {
    response.status = true
    res.json(response)
  }).catch((error) => {
    res.status(500).send({ error: "Something went wrong" }); // send an error response back to the client
  });
})

router.post('/remove-favorite-song', (req, res) => {
  const songId = req.body.songId
  const userId = req.cookies.id
  userController.removefavoriteSong(userId, songId).then((response) => {
    response.status = true
    res.json(response)
  }).catch((error) => {
    res.status(500).send({ error: "Something went wrong" }); // send an error response back to the client
  });
})

router.get('/get-all-favorite-songs', verifyloggedIn, (req, res) => {
  const userId = req.cookies.id

  userController.getAllFavoriteSongs(userId).then((response) => {
    const favSongs = response
    res.render("users/favouriteSongs", { favSongs });
  })


})
router.get("/malayalam-songs", (req, res) => {
  userController.getMalayalamSongs().then((response) => {
    const malayalamSongs = response
    res.render("users/malayalamSongs", { malayalamSongs });
  })
})
router.get('/tamil-songs', (req, res) => {
  userController.getTamilSongs().then((response) => {
    const tamilSongs = response
    res.render("users/tamilSongs", { tamilSongs });
  })
})
router.get('/hindi-songs', (req, res) => {
  userController.getHindiSongs().then((response) => {
    const hindiSongs = response
    res.render("users/hindiSongs", { hindiSongs });
  })
})
router.get('/english-songs', (req, res) => {
  userController.getEnglishSongs().then((response) => {
    const englishSongs = response
    res.render("users/englishSongs", { englishSongs });
  })
})

// Increasing views of songs
router.put('/api/songs/:id/views', async (req, res) => {
  const songId = req.params.id;
  userController.increasesongViews(songId).then((response) => {
    res.json(response);
  })
});

router.get('/artists', (req, res) => {
  userController.getArtists().then((response) => {
    const artists = response
    res.render("users/artists", { artists });
  })
})
router.get('/artist-songs/:artistName', (req, res) => {
  const artistName = req.params.artistName
  userController.getArtistSongs(artistName).then((response) => {
    const artistSongs = response
    res.render("users/artistSongs", { artistSongs });
  })
})
router.post('/create-new-playlist', (req, res) => {
  const userId = req.cookies.id
  const plName = req.body.playlistName
  userController.createplaylist(userId, plName).then((response) => {
    response.status = true
    res.json(response)
  })
})

router.post('/save-song-to-playlist', (req, res) => {
  const plId = req.body.plId
  const songId = req.body.songId
  userController.savesongtoPlaylist(plId, songId).then((response) => {
    response.status = true
    res.json(response)
  })
})

router.get('/playlist', verifyloggedIn, (req, res) => {
  const userId = req.cookies.id
  userController.getPlaylist(userId).then((response) => {
    const playlist = response
    res.render("users/playlist", { playlist });

  })
})

router.get('/playlist/:playlistId', (req, res) => {
  const playlistId = req.params.playlistId
  userController.getplaylistItem(playlistId).then((response) => {
    const playlistSongs = response
    res.render("users/playlistSongs", { playlistSongs });
  })
})


router.get('/trending-songs', (req, res) => {
  userController.gettrendingSongs().then((response) => {
    const trendingSongs = response
    res.render("users/trendingSongs", { trendingSongs });
  })

})

router.get('/new-songs', (req, res) => {
  userController.getnewSongs().then((response) => {
    const newSongs = response
    res.render("users/newSongs", { newSongs });
  })

})

router.get('/search/:searchText', (req, res) => {
  const searchText = req.params.searchText

  userController.search(searchText).then((response) => {
    const searchResult = response
    res.render('users/searchResult',{searchResult})
  })

})

router.get('/song/:songType', (req, res) => {

  userController.getsongPage(req.params.songType).then((response) => {
    const result = response
    res.render('users/songPage', { result })
  })
})


module.exports = router;
