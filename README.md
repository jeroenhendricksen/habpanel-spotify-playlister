# Spotify Playlists for OpenHAB Habpanel

Note: This is a simplified version of the plugin, tailored to my personal needs. Credits go to [gytisgreitai](https://github.com/gytisgreitai), from which I forked [this repository](https://github.com/gytisgreitai/habpanel-spotify-playlister).

![](https://github.com/jeroenhendricksen/habpanel-spotify-playlister/raw/master/media/playlister.png)

- Shows your Spotify playlists (max 50)
- Allows to send the selected playlist to an item for further processing

## Requirements

- A valid Spotify Access token, exposed via an OpenHAB item (eg. `Spotify_AccessToken`). Make sure it is always available and updated whenever needed. This is a requirement for this plugin, but outside the scope of this plugin.
- Configured items from binding: `accessToken` and `devicePlayer`, eg:

      String Spotify_AccessToken "Spotify accesstoken"
      String Spotify_Player "Spotify control"

- When the play icon on a playlist is clicked, the above item `Spotify_Player` receives an updated String, containing the id for the playlist to play: `spotify:playlist:37i9dQZF1DX79UF7ALECl7`. Playing the selected playlist via Spotify is outside the scope of this plugin.

## Installation

1. Place `release/spotify-playlister.js` file into openHAB html dir under `spotify-playlister` directory, eg:

      ```
      cd <OPENHAB_DIR>/conf/html/
      mkdir spotify-playlister && cd "$_"
      wget https://raw.githubusercontent.com/jeroenhendricksen/habpanel-spotify-playlister/master/release/spotify-playlister.js
      ```

1. Create the required items inside a .items file.

1. Install `Spotify Playlister.widget.json` to habpanel. This can be done via the Gallery functionality:

    - Click `Add Widget` in the top-right corner of habpanel web UI.
    - Choose `Get more...`
    - Enter `jeroenhendricksen/habpanel-spotify-playlister` for github repository name and click `Go`
    - Select `Import Widget`

1. Add the actual widget to habpanel:

    - Click `Add Widget` in the top-right corner of habpanel web UI.
    - Select `Spotify Playlister`
    - Edit the settings for the new widget
    - Select `Don't wrap in container` or else it will break the layout
    - Configure widget selecting your `Spotify_AccessToken` and `Spotify_Player` items
