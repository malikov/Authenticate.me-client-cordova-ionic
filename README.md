Authenticate.me app front end (ionic, angularjs, cordova)
================================================================

A starting project to achieve server side authentication for hybrid apps. This is the front end. You can either create your server side api based on the following blog post : [http://www.frnchnrd.com/blog/](http://www.frnchnrd.com/blog/) or reuse the [authenticate.me server nodejs codebase](https://github.com/malikov/Authenticate.me-Node-Server).

## Update cordova to 3.6.0 

Note : you'll need the latest version of cordova (3.6.0) for the inAppBrowser plugin to work correctly with ios8 otherwise it will be broken.


## Screenshots

<img style="float:left; margin: 10px;" src="https://raw.githubusercontent.com/malikov/Authenticate.me-client-cordova-ionic/master/www/img/Screenshot_2014-09-15-16-10-25.png" alt="Main Page" width="200px"  />

<img style="float:left; margin: 10px;" src="https://raw.githubusercontent.com/malikov/Authenticate.me-client-cordova-ionic/master/www/img/Screenshot_2014-09-15-16-10-30.png" alt="Sign In Page" width="200px" />

<img style="float:left; margin: 10px;" src="https://raw.githubusercontent.com/malikov/Authenticate.me-client-cordova-ionic/master/www/img/Screenshot_2014-09-15-16-10-36.png" alt="SignUp Page" width="200px" />

<img style="float:left; margin: 10px;" src="https://raw.githubusercontent.com/malikov/Authenticate.me-client-cordova-ionic/master/www/img/Screenshot_2014-09-15-16-12-26.png" alt="Instagram login page" width="200px" />

<img style="float:left; margin: 10px;" src="https://raw.githubusercontent.com/malikov/Authenticate.me-client-cordova-ionic/master/www/img/Screenshot_2014-09-15-16-12-36.png" alt="Twitter login page" width="200px" />

<img style="float:left; margin: 10px;" src="https://raw.githubusercontent.com/malikov/Authenticate.me-client-cordova-ionic/master/www/img/Screenshot_2014-09-15-16-12-55.png" alt="Profile page" width="200px" />

<img style="float:left; margin: 10px;" src="https://raw.githubusercontent.com/malikov/Authenticate.me-client-cordova-ionic/master/www/img/Screenshot_2014-09-15-16-13-01.png" alt="User sidebar" width="200px"/>

<img style="float:left; margin: 10px;" src="https://raw.githubusercontent.com/malikov/Authenticate.me-client-cordova-ionic/master/www/img/Screenshot_2014-09-15-16-13-05.png" alt="Users list" width="200px" />

## APK

you can download the apk [here](https://drive.google.com/file/d/0B9GTa-_sqdVJNnZwbzl1TGQxZFE/edit?usp=sharing)

## Using this project

The following steps assume your environment is  android / ios ready. If you haven't downloaded the appropriate SDKs (ADT, or xcode) and setup the appropriate PATH variables (mostly for android), please do so before doing the steps below. You'll need nodejs installed as well.

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

### 5. Configuration
I'd start by looking at the AuthService and Constants.js file. The api url implemented on the client side for the login/registration needs to match the router's url on the server side


### TODO
tests

add facebook
add native sdk functionalities (i.e : use facebook or twitter's sdk if the app is installed on the phone use the native app otherwise fallback to window.open)
