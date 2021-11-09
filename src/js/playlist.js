function getAccessToken() {
  const hash = window.location.hash;
  const hashWithoutHash = hash.substring(1);

  const params = hashWithoutHash.split('&');
  const keyValues = params.map((param) => param.split('='));

  const accessToken = keyValues[0][1];
  return accessToken;
}

function getPlaylist(playlist_id) {
  const url = `https://api.spotify.com/v1/playlists/${playlist_id}`;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`,
  };

  return fetch(url, { headers }).then((response) => response.json());
}

function renderPlaylist(playlistId) {
  const container = document.getElementById('tracks');
  const audioPlayer = document.getElementById('player');
  getPlaylist(playlistId).then((playlist) => {
    const tracks = playlist.tracks.items;

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i].track;

      const playListItem = document.createElement('div');
      playListItem.classList.add('playlist-item');

      const playListItemImg = document.createElement('img');
      playListItemImg.classList.add('playlist-item-img');
      playListItemImg.setAttribute('src', track.album.images[0].url);

      const playListItemTitle = document.createElement('div');
      playListItemTitle.classList.add('playlist-item-title');
      playListItemTitle.innerHTML = track.name;

      playListItem.addEventListener('click', () => {
        if (currentlyActive === track.id) {
          audioPlayer.pause();
          currentlyActive = null;
          playListItem.classList.remove('active');
        } else {
          if (currentlyActive) {
            document.querySelector('.active').classList.remove('active');
          }
          currentlyActive = track.id;
          playListItem.classList.add('active');
        }
        if (track.preview_url) {
          currentlyActive = track.preview_url;
          audioPlayer.setAttribute('src', track.preview_url);
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
      });

      playListItem.appendChild(playListItemImg);
      playListItem.appendChild(playListItemTitle);
      container.appendChild(playListItem);
    }
  });
}

let currentlyActive;
// https://open.spotify.com/show/15HFmorFE9BBuzImuymwdt?si=63f4b17708034a0a
renderPlaylist('37i9dQZF1DWTMYgB8TqtmR');
