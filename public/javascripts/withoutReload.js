const myFav = document.getElementById("fav-btn")
const homeBtn = document.getElementById("home-btn")
const artistBtn = document.getElementById("artist-btn")
const malBtn = document.getElementById("malayalam-btn")
const tamilBtn = document.getElementById("tamil-btn")
const hindiBtn = document.getElementById("hindi-btn")
const engBtn = document.getElementById("english-btn")
const playlistBtn = document.getElementById("playlistBtn")
const trendingBtn = document.getElementById("trendingsongBtn")
const newsongBtn = document.getElementById("newsongBtn")



window.onpopstate = function (event) {
    if (location.pathname === '/') {
        $.ajax({
            type: 'GET',
            url: '/new-home',
            dataType: 'html',
            success: function (response) {
                $("#content").html(response).hide().fadeIn('slow')
                window.history.pushState({ page: 'home' }, 'Home-Page', '/');
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }
};
window.onpopstate = function (event) {
    if (location.pathname === '/artists') {
        $.ajax({
            type: 'GET',
            url: '/artists',
            dataType: 'html',
            success: function (response) {
                $("#content").html(response).hide().fadeIn('slow')
                window.history.pushState({ page: 'artists' }, 'Artists-Page', '/artists');
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }
};

// Function to load home page

myFav.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/get-all-favorite-songs',
        dataType: 'html',
        success: function (response) {

            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'favouriteSongs' }, 'Favourite-Songs', '/get-all-favorite-songs');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})
artistBtn.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/artists',
        dataType: 'html',
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'artists' }, 'Artists-Page', '/artists');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})
trendingBtn.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/trending-songs',
        dataType: 'html',
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'trendingSongs' }, 'trendingSongs', '/trending-songs');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})
newsongBtn.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/new-songs',
        dataType: 'html',
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'newSongs' }, 'newSongs', '/new-songs');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})

homeBtn.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/new-home',
        dataType: 'html',
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'home' }, 'Home-Page', '/');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})

malBtn.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/malayalam-songs',
        dataType: 'html',
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'malayalam' }, 'Malayalam-Songs', '/malayalam-songs');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})

tamilBtn.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/tamil-songs',
        dataType: 'html',
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'tamil' }, 'Tamil-Songs', '/tamil-songs');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})

hindiBtn.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/hindi-songs',
        dataType: 'html',
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'hindi' }, 'Hindi-Songs', '/hindi-songs');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})

engBtn.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/english-songs',
        dataType: 'html',
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'english' }, 'English-Songs', '/english-songs');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})


playlistBtn.addEventListener('click', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/playlist',
        dataType: 'html',
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'playlist' }, 'playlist', '/playlist');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})



// handling adding songs to playlist----
const plForm = document.getElementById("playlistForm")
const submitButton = document.getElementById('submitButton');



createplBtn.addEventListener('click', (e) => {
    const playlistName = plnameinp.value
    console.log(playlistName);
    e.preventDefault()
    $.ajax({
        type: 'post',
        data: { playlistName: playlistName },
        url: '/create-new-playlist',
        success: function (response) {
            console.log("test");
            playlistDiv.style.display = 'none'
            overlayBackground.style.display = 'none'
            playlistnameForm.style.display = "none"
            plnameinp.value = ''
            plForm.reset()
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
})

submitButton.addEventListener("click", (e) => {
    e.preventDefault()
    const element = document.getElementById("add-favourite")
    const songId = element.getAttribute("data-song-id")
    var plId = document.querySelector('input[name="playlistId"]:checked').value;
    $.ajax({
        url: "/save-song-to-playlist",
        type: "post",
        data: { plId: plId, songId: songId },
        success: function (response) {
            console.log("test");
            playlistDiv.style.display = 'none'
            overlayBackground.style.display = 'none'
            playlistnameForm.style.display = "none"
            plForm.reset()
        },
        error: function (error) {
            console.log("Error occurred while submitting the form: " + error);
        }
    });

})
// --------------

// searching

const searchForm = document.getElementById("searchForm")
const searchInp = document.getElementById("searchInp")

searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const searchText = searchInp.value

    $.ajax({
        type: 'get',
        url: `/search/${searchText}`,
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'searchResult' }, 'searchResult', `search/${searchText}`);

        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }

    })

})




getUrl = (url) => {
    $.ajax({
        type: 'get',
        url: `/song/${url}`,
        success: function (response) {
            $("#content").html(response).hide().fadeIn('slow')
            window.history.pushState({ page: 'songPage' }, 'songPage', `song/${url}`);

        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }

    })
}
