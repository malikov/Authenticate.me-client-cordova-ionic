Authenticate.me app front end (ionic, angularjs, cordova)
================================================================

A starting project to achieve server side authentication for hybrid apps. This is the front end. You can either create your server side api based on the following blog post : [http://www.frnchnrd.com/blog/](http://www.frnchnrd.com/blog/) or reuse the [authenticate.me server nodejs codebase](https://github.com/malikov/Authenticate.me-Node-Server).

## Using this project

The following steps assumes your environment is  an android / ios ready. If you haven't downloaded the appropriate SDKs (ADT, or xcode) and setup the appropriate PATH variables (mostly for android), please do so before doing the steps below. You'll need nodejs installed as well.

### 1. Ionic / Cordova 

make sure both [ionic](http://ionicframework.com/) and cordova are installed on your machine if not run the following command : 

```bash
 npm install -g cordova ionic
```

Note : if npm isn't defined you'll need to install [node](http://nodejs.org/)

### 2. Clone this repo
```bash
 git clone https://github.com/malikov/Authenticate.me-client-cordova-ionic.git
```

Then navigate to the repo :
```bash
 cd Authenticate.me-client-cordova-ionic
```

### 3. Dependencies

Run :
```bash
 npm install
```

This should install all dependencies for the project.


### 4. Add a platform

Once the dependencies installed, you'll need to add a platform (Warning this project has been tested for iOs and Android devices ony)

Run :
```bash
 ionic platform add android
 ionic platform add ios
```

Then to build the project run:
```bash
 ionic run android
 ionic run ios
```