Music Network Ideas
===================

## Integrated Services
+ Spotify
    - main music provider
    - export playlists
    
+ Soundcloud
    - secondary music provider
    - allows for lesser known artists to be included
    
+ Genius
    - get lyrics from songs
    - keyword/topic based playlist creation (possible future feature)

## Node Information
+ catagory
    - list of songs
    - blacklist
    - "contains" list consisting of all nodes that flow into it
    - source string
    - type string
+ use cases
    - albums/playlist: catagory
    - playlist (spotify): catagory + update flag
    - artists: catagory + update flag + create albums to flow into it
    - song: not a catagory

## User Action Flow (and how?)
+ login (load network)
    - make account on site
    - connect account to spotify account (and other accounts if wanted)
    - will need to look into storing encrypted user data for login system
+ add catagories & sources 
    - open sidenav 
    - click on empty space to add source there
+ edit catagories & sources
    - open sidenav
    - use sidenav menus or click button to open more detailed menu in new tab
+ connect catagories & sources
    - open sidenav
    - click on one node and drag to other node
    - use sidenav to edit connections (can also use detailed menu)
+ blacklist items
    - from detailed menu or player click on blacklist button
    - fuzzy search from sidenav for songs/albums/sources?
+ play music from selected playlist
    - click on playlist to open in detailed menu in new tab (detailed menu will have player)
    - or export to spotify
+ logout (auto saving?)
    - button in menu/titlebar

## How is saving going to work?
+ requirements
    - minimize space used
    - maximize speed
    - be able to recreate network exactly
+ what is needed to recreate the network
    - adjacency list ("contains"of all nodes)
    - node data (source info, type, etc)
    - songs each node has
    - blacklists
    
    


