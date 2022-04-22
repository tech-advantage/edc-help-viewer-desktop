# edc-help-viewer-desktop

This project provides a viewer to navigate through edc documentations with electron application.

## Installation

First step, install dependencies :

    npm install

Once the dependencies are installed, you need to add the documentation directory to the root of the static directory.

The static directory should look like this :

    /static
        /assets
        /doc

To change the name of the package and the name of the default application, go to the package.json file
and modify the appId and productName of the build configuration.
    
Then run build

    npm run build

In the assets folder and in the folder corresponding to your operating system, you can change the default icon with your own icon.
For Windows operating system, your icon extension should be (.ico).

* For macOs to darwin folder, icon size should be at least 512x512.
* For Windows to win32 folder, icon size should be at least 256x256.
* For Linux to linux folder, recommended sizes: 16, 32, 48, 64, 128, 256 (or just 512).

To change the default image with your own, add your image to the public/img folder and then go to the config_electron_viewer.json file by passing the path to your image.

#### Menu

The application menu can be disabled in the configuration options of the config_electron_viewer.json file by passing the "isEnableMenu" option to false.

### Run

run the application with :

    npm start

### Packaging and Distributing

Launch packaging of application with :

    npm run pack

Launch distribution of application with :

###### Windows
    npm run dist:windows

###### Linux
    npm run dist:linux

## License
MIT [TECH'advantage](mailto:contact@tech-advantage.com)