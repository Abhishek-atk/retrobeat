const playBtn = document.querySelector('#mainplayBtn');
const audio = document.querySelector('#audio');
const prevBtn = document.querySelector('#btnPrev');
const nextBtn = document.querySelector('#btnNext');
const trackTitle = document.querySelector('.track-title');
const cover = document.querySelector('.cover');
const slider = document.querySelector('.slider');
const thumb = document.querySelector('.slider-thumb');
const progress = document.querySelector('.progress');
const time = document.querySelector('.time');
const fulltime = document.querySelector('.fulltime');
const volumeSlider = document.querySelector('.volume-slider .slider');
const volumeProgress = document.querySelector('.volume-slider .progress');
const volumeIcon = document.querySelector('.volume-icon');


let trackPlaying = false
let volumeMuted = false

let trackId = 0;



playBtn.addEventListener('click', playTrack)

function playTrack() {
    if (trackPlaying) {
        audio.pause();
        playBtn.innerHTML = `<span><i class="fas fa-play"></i></span>`
        trackPlaying = false
    } else {
        audio.play();
        playBtn.innerHTML = `<span><i class="fas fa-pause"></i></span>`
        trackPlaying = true
    }
}
function switchTrack() {
    if (trackPlaying) {
        audio.play()
    }
}

const playSong = () => {
    audio.play()
    playBtn.innerHTML = `<span><i class="fas fa-pause"></i></span>`
    trackPlaying = true
}



let favsongid = document.getElementById("favsongid").innerHTML;
let favsongidArray = favsongid.split(",");

const getsongDetails = async (id, songName, imageName, fileName) => {
    const trackSrc = '/uploads/songFile/' + fileName;
    const imgSrc = '/uploads/songImage/' + imageName;
    document.getElementById("musicPlayer").style.display = 'flex'
    document.getElementById("imageName").src = imgSrc
    document.getElementById("songName").innerHTML = songName
    const element = document.getElementById('add-favourite')
    element.setAttribute('data-song-id', id)
    loadTrack(trackSrc)
    if (favsongidArray.includes(id)) {
        document.getElementById("add-favourite").style.display = 'none'
        document.getElementById("remove-favourite").style.display = 'flex'
    } else {
        document.getElementById("add-favourite").style.display = 'flex'
        document.getElementById("remove-favourite").style.display = 'none'
    }
    try {
        const res = await fetch(`/api/songs/${id}/views`, { method: 'PUT' });
        const data = await res.json();
        console.log(`Song views: ${data.views}`);
    } catch (err) {
        console.error(err);
    }

}

function getsongDuration() {
}


function loadTrack(trackSrc) {
    audio.src = trackSrc
    audio.load()
    playSong()
    progress.style.width = '0'
    thumb.style.left = '0'
    audio.addEventListener('loadeddata', () => {
        setTime(fulltime, audio.duration)
        slider.setAttribute("max", audio.duration)
    })
}

loadTrack()

prevBtn.addEventListener('click', prevTrack)

function prevTrack() {
    trackId--;
    if (trackId < 0) {
        trackId = trackDatas.length - 1
    }
    loadTrack()
    switchTrack()
}

nextBtn.addEventListener('click', nextTrack)

function nextTrack() {
    trackId++;
    if (trackId > trackDatas.length - 1) {
        trackId = 0;
    }
    loadTrack()
    switchTrack()
}
audio.addEventListener('ended', nextTrack)

function setTime(output, input) {
    const minutes = Math.floor(input / 60)
    const seconds = Math.floor(input % 60)
    if (seconds < 10) {
        output.innerHTML = minutes + ":0" + seconds;
    } else {
        output.innerHTML = minutes + ":" + seconds;
    }
}

setTime(fulltime, audio.duration)
audio.addEventListener('timeupdate', () => {
    const currentAudioTime = Math.floor(audio.currentTime)
    const timePercentage = (currentAudioTime / audio.duration) * 100 + '%'
    setTime(time, currentAudioTime)
    progress.style.width = timePercentage;
    thumb.style.left = timePercentage
})

function customSlider() {
    const value = (slider.value / audio.duration) * 100 + '%'
    progress.style.width = value
    thumb.style.left = value
    setTime(time, slider.value)
    audio.currentTime = slider.value
}
customSlider()
slider.addEventListener("input", customSlider)

let audioValue;

function customvolumeSlider() {
    const maxValue = volumeSlider.getAttribute('max');
    audioValue = (volumeSlider.value / maxValue) * 100 + '%'
    volumeProgress.style.width = audioValue
    audio.volume = volumeSlider.value / 100

    if (audio.volume > 0.5) {
        volumeIcon.innerHTML = `<span><i class="fa-solid fa-volume-high"></i></span>`
    } else if (audio.volume === 0) {
        volumeIcon.innerHTML = `<span><i class="fa-solid fa-volume-xmark"></i></span>`
    } else {
        volumeIcon.innerHTML = `<span><i class="fa-solid fa-volume-low"></i></span>`
    }
}
customvolumeSlider()
volumeSlider.addEventListener("input", customvolumeSlider)

volumeIcon.addEventListener('click', () => {
    if (volumeMuted === false) {
        volumeIcon.innerHTML = `<span><i class="fa-solid fa-volume-xmark"></i></span>`
        audio.volume = 0
        volumeProgress.style.width = 0;
        volumeMuted = true
    } else {
        volumeIcon.innerHTML = `<span><i class="fa-solid fa-volume-low"></i></span>`
        audio.volume = .5
        volumeProgress.style.width = audioValue
        volumeMuted = false
    }
})





//! in sone request write two function. that meanst now i'm write in two diff request that changes to one request two function
// how can change img and song name? check that sence in fav also remove-favourite

document.getElementById("add-favourite").addEventListener("click", (e) => {
    const element = document.getElementById("add-favourite")
    const songId = element.getAttribute("data-song-id")
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/add-favorite-song',
        data: { songId: songId },
        success: function (response) {
            if (response.status) {
                favsongidArray = document.getElementById("favsongid").innerHTML = response.ids
                document.getElementById("add-favourite").style.display = 'none'
                document.getElementById("remove-favourite").style.display = 'flex'
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})


document.getElementById("remove-favourite").addEventListener("click", (e) => {
    const element = document.getElementById("add-favourite")
    const songId = element.getAttribute("data-song-id")
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/remove-favorite-song',
        data: { songId: songId },
        success: function (response) {
            if (response.status) {
                favsongidArray = document.getElementById("favsongid").innerHTML = response.ids
                document.getElementById("remove-favourite").style.display = 'none'
                document.getElementById("add-favourite").style.display = 'flex'
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})




// click add btn to playlist open div of all playlist

const addBtn = document.getElementById("add-to-playlist")
const playlistDiv = document.getElementById("add-to-playlist-div")
const overlayBackground = document.getElementById("overlay-background")
const closeIcon = document.getElementById("close-icon")


addBtn.addEventListener("click", () => {
    playlistDiv.style.display = 'block'
    overlayBackground.style.display = 'block'
})
closeIcon.addEventListener("click", () => {
    playlistDiv.style.display = 'none'
    overlayBackground.style.display = 'none'
    playlistnameForm.style.display = "none"
    plnameinp.value = ''
    plForm.reset()
})

// handling single check box at a time and enabling submit btn

function handleCheckboxChange(checkbox) {
    const checkboxes = document.getElementsByName('playlistId');
    const submitButton = document.getElementById('submitButton');

    checkboxes.forEach((cb) => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });

    submitButton.disabled = !checkbox.checked;
}

const playlistnameForm = document.getElementById("createplaylistForm")

const showformBtn = document.getElementById("createplaylistdivBtn")
const plnameinp = document.getElementById("plnameinp")

showformBtn.addEventListener("click", () => {
    playlistnameForm.style.display = "block"
})






/*
const getsongDetails = (id, songName, imageName, fileName) => {
    const trackSrc = '/uploads/songFile/' + fileName;
    const imgSrc = '/uploads/songImage/' + imageName;
    document.getElementById("musicPlayer").style.display = 'flex'
    document.getElementById("imageName").src = imgSrc
    document.getElementById("songName").innerHTML = songName
    const element = document.getElementById('add-favourite')
    element.setAttribute('data-song-id', id)
    loadTrack(trackSrc)
    if (favsongidArray.includes(id)) {
        document.getElementById("add-favourite").style.display = 'none'
        document.getElementById("remove-favourite").style.display = 'flex'
    } else {
        document.getElementById("add-favourite").style.display = 'flex'
        document.getElementById("remove-favourite").style.display = 'none'
    }

}

*/