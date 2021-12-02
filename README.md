# edc-help-viewer-desktop

This project provides a viewer to navigate through edc documentations with electron application.

## Installation

First step, run that follow command :

    npm run build

When the webpack build process is complete you need to add the documentation directory to the root of the static directory.

The static directory should look like this : 

    /static
        /doc
        /help

### Run

run the application with :

    npm start

#### Packaging and Distributing

Launch packaging of application with :

    npm run pack

Launch distribution of application with :

    npm run dist