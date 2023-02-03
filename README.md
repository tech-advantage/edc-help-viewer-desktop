# edc-help-viewer-desktop

This project provides a viewer to navigate through edc documentations with electron application.

## Installation

First step, install dependencies :

**`npm install`**

#### Available settings properties (file: conf/config_electron_viewer.json):

+ **`isEmbeddedDoc`**: To set if the documentation is embedded.

+ **`docPath`**: Path for documentation in static folder, it should be equal to /static/doc if *`isEmbeddedDoc`* equal to true otherwise if you're using the edc-httpd project (https://github.com/tech-advantage/edc-httpd-java) this configuration should be empty.
    
+ **`img_loader`**: Path for the custom logo, used specifically for customizing the logo of the viewer app.

+ **`hostname`**: The host url, should ever be equal to **http://localhost**.

+ **`server_port`**: The port for the url who's serve the documentation, if you're using the embedded documentation the port must be equal to 60000. if you're using edc-httpd project the port must be equal to 8088.

+ **`browserWindow`**: Parameters for main window of the application
  + **`isEnableMenu`**: Set this property as true if you want showing the top bar menu.

  + **`width`**: To set the width of the main window.

  + **`height`**: To set the height of the main window.


#### Available settings properties (file: conf/config.json):

See the edc-help-viewer README.md file (https://github.com/tech-advantage/edc-help-viewer/blob/master/README.md)

## Logos and style customization

#### Images

To replace the default images you just need to change their path in the config.json file's `images` attribute:

**`favicon`** The page favicon image.

**`logo_header`** Logo for the header - for better display results, we recommend using a logo with a positive width/height ratio.

**`logo_info`** Image for the information page, when the content could not be found.

Once the dependencies are installed, if you're using the embedded documentation, you need to add the documentation directory to the root of the static directory.

The static directory should look like this :

    /static
        /assets
        /doc

To change the name of the package and the name of the default application, go to the package.json file
and modify the appId and productName of the build configuration.
    
Then run build

**`npm run build`**

In the assets folder and in the folder corresponding to your operating system, you can change the default icon with your own icon.
For Windows operating system, your icon extension should be (.ico).

* For macOs to darwin folder, icon size should be at least 512x512.
* For Windows to win32 folder, icon size should be at least 256x256.
* For Linux to linux folder, recommended sizes: 16, 32, 48, 64, 128, 256 (or just 512).

To change the default image with your own, add your image to the public/img folder and then go to the config_electron_viewer.json file by passing the path to your image.

#### Menu

The application menu can be disabled in the configuration options of the config_electron_viewer.json file by passing the **`isEnableMenu`** option to false.

### Run

run the application with :

**`npm start`**

### Packaging and Distributing

Launch packaging of application with :

**`npm run pack`**

Launch distribution of application with :

###### Windows
**`npm run dist:windows`**

###### Linux
**`npm run dist:linux`**

## License
MIT [TECH'advantage](mailto:contact@tech-advantage.com)