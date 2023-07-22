var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminControllers");
const { verifyAdmin, verifyToken } = require("../middleware/middlewares");
const multer = require("multer");
const fs = require('fs')

/* GET admin home page. */
router.get("/dashboard", verifyToken, verifyAdmin, async (req, res) => {
  const userNumber = await adminController.getuserNumber();
  const songNumber = await adminController.getsongNumber();
  res.render("admin/dashboard", { userNumber, songNumber });
});

router.get("/dashboard/users", verifyToken, verifyAdmin, (req, res) => {
  adminController.getallUsers().then((users) => {
    res.render("admin/allUsers", { users });
  });
});
// @Get request for render song list
router.get("/dashboard/songs", verifyToken, verifyAdmin, (req, res) => {
  adminController.getallSongs().then((allSongs) => {
    res.render("admin/songs", { allSongs });
  }).catch((err) => {
    console.log(err.msg);
  })
});
// @Get request for render form for adding new song
router.get("/dashboard/songs/add-song", verifyToken, verifyAdmin, (req, res) => {
  res.render("admin/addsongForm");

}
);

let songName;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "songImg") {
      cb(null, "public/uploads/songImage");
    } else if (file.fieldname === "songFile") {
      cb(null, "public/uploads/songFile");
    }
  },
  filename: function (req, file, cb) {
    songName = Date.now() + file.originalname;
    cb(null, songName);
  },
});

const songUpload = multer({ storage: storage }).fields([
  { name: "songImg", maxCount: 1 },
  { name: "songFile", maxCount: 1 },
]);


router.post("/upload-new-song", verifyToken, verifyAdmin, (req, res) => {
  
  songUpload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const songName = req.body.songname;
      const artistsName = req.body.artistname;
      const language = req.body.language
      const categories = req.body.categories
      const types = req.body.types
      const duration = req.body.duration
      const songimgName = req.files.songImg[0].filename;
      const songfileName = req.files.songFile[0].filename;
      const newsongData = {
        songName: songName,
        artistsName: artistsName,
        songimgName: songimgName,
        songfileName: songfileName,
        language: language,
        categories: categories,
        types: types,
        duration:duration
      };

      adminController.addNewSong(newsongData).then((response) => {
        console.log(response.msg);
        res.redirect("/admin/dashboard/songs");
      });
    }
  })

});

router.get("/dashboard/albums", verifyToken, verifyAdmin, (req, res) => {
  res.render("admin/albums");
});
router.get("/dashboard/artists", verifyToken, verifyAdmin, (req, res) => {
  res.render("admin/artists");
});

router.get('/dashboard/songs/delete-song/:id/:songimgName/:songfileName', verifyToken, verifyAdmin, (req, res) => {
  const songimgPath = "public/uploads/songImage/" + req.params.songimgName;
  const songfilePath = "public/uploads/songFile/" + req.params.songfileName;

  adminController.deleteSong(req.params.id).then((response) => {
    fs.unlink(songimgPath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to delete file');
        return;
      }
    })
    fs.unlink(songfilePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to delete file');
        return;
      }
    });
    res.redirect("/admin/dashboard/songs");
  })
})

router.get("/dashboard/songs/edit-song/:id", verifyToken, verifyAdmin, (req, res) => {
  adminController.geteditsongDetails(req.params.id).then((response) => {
    const editsongDetails = response;
    res.render("admin/editSongForm", { editsongDetails });
  })

})

router.post('/edit-song', verifyToken, verifyAdmin, (req, res) => {
  songUpload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const songimgPath = "public/uploads/songImage/" + req.body.songimgNameCheck;
      const songfilePath = "public/uploads/songFile/" + req.body.songfileNameCheck;
      const songId = req.body.songId
      const songName = req.body.songname;
      const artistsName = req.body.artistname;
      const language = req.body.language
      const categories = req.body.categories
      const types = req.body.types
      const duration = req.body.duration
      const songimgName = req.files.songImg[0].filename;
      const songfileName = req.files.songFile[0].filename;
      const editedsongData = {
        songName: songName,
        artistsName: artistsName,
        songimgName: songimgName,
        songfileName: songfileName,
        language: language,
        categories: categories,
        types: types,
        duration:duration
      };

      adminController.editSong(songId, editedsongData).then((response) => {
        fs.unlink(songimgPath, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Failed to delete file');
            return;
          }
          console.log("img deleted");
        })
        fs.unlink(songfilePath, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Failed to delete file');
            return;
          }
          console.log("file deleted");
        });
        res.redirect("/admin/dashboard/songs");
      })
    }
  })
})

module.exports = router;




