# RemikuProj

RemikuProj is a music hub project developed using Angular for the front end, C# (specifically ASP.NET API) for the back end, and SQLite as the database.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Built With](#built-with)
- [Contributing](#contributing)
- [License](#license)

## Overview

In Remiku, you become the owner of your Music Hub, with the ability to import any YouTube music and more.

## Features

With Remiku, you can:
1. **Import Your Own Music:** Utilizing regex, the application detects your YouTube links and imports them into the database.
2. **Create Your Own Playlists:** Through the Remiku Web API, you can list your music as you wish.
3. **Manage Playlists and Music:** Take control by removing any playlist or individual music.
4. **Favorite Your Music:** Remiku automatically creates a "Favorites" playlist where you can find your favorited tunes.
5. **Toggle YT Player Visibility:** The video player starts hidden by default, but you can show or hide it at your convenience using the Ghost icon.

## Getting Started

Setup your folders and prepare your Prerequisites, 'cause today you're going to have your own Music Player.

### Prerequisites

Ensure you have the following for Remiku:
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com)
- [Visual Studio Code](https://code.visualstudio.com)
- [.NET SDK](https://dotnet.microsoft.com/download)
- [Your Own Youtube API Key](#API-KEY)

### API-KEY
 For Remiku you'll need to use your own API Key, you can generate one by following these steps:
 1. Create your project in [YouTube Cloud](https://console.cloud.google.com/apis/dashboard?hl=pt-br&project=mikuproj)
 2. Select "[Activate an API](https://console.cloud.google.com/apis/library?hl=pt-br&project=mikuproj)" and choose "YouTube Data API v3"
 3. Now, choose "Credentials" on the right menu.
 4. Select "Create Credentials" and then "API Key".
 5. Copy your API Key and don't share with anyone. Save it, you'll use later on Installation.
  
### Installation

To start using Remiku:
1. Open two consoles, one for the Front-End application and the other for the Back-End.
2. In Console 1 (Front-End), use: `npm install` (Example directory: ReMikuProj/Front)
3. In Console 2, navigate to the Back-End directory (ReMikuProj/Back/mikuProj.API) and use `dotnet restore`.
4. Now you'll need to use your generated Api Key. Select "secrets.json" file and replace "example_api_key" with your own key.
5. In Console 1, use `ng s` to run the Angular Application.
6. In Console 2, use `dotnet run` to start the Web API.

## Usage

Remiku uses Angular components to Import or Delete songs, and Create Playlists. Check the drop menu on the center of the screen. Your data will only be saved locally on your computer.
If you wanna keep your settings, like Playlists or Imported Songs, copy "Musics.db" file. 

## Built With

- [Angular](https://angular.io/) - Front-end framework
- [C# (ASP.NET API)](https://docs.microsoft.com/en-us/dotnet/csharp/) - Back-end language and framework
- [SQLite](https://www.sqlite.org/) - Database
- [BoxIcons](https://boxicons.com/?query=) - Icons
- [Bootstrap](https://getbootstrap.com/) - Front-end framework for design and layout


## Contributing

Your contributions are welcome! Feel free to open a Pull Request, and I'll conduct a code review. If you're not quite ready to dive into the code, you can open your own Issue!

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See [LICENSE.md](https://github.com/grabel7/ReMikuProj/blob/development/LICENSE#L1) for details.
