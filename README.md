Authenticate.me app front end (ionic, angularjs, cordova)
================================================================

A starting project to achieve server side authentication for hybrid apps. This is the front end. You can either create your server side api based on the following blog post : [http://www.frnchnrd.com/blog/](http://www.frnchnrd.com/blog/) or reuse the [authenticate.me server nodejs codebase](https://github.com/malikov/Authenticate.me-Node-Server).

## Screenshots
![alt tag](https://drive.google.com/file/d/0B9GTa-_sqdVJRlBIdmF5ampzd1k/edit?usp=sharing)
![alt tag](https://drive.google.com/file/d/0B9GTa-_sqdVJQkY5d0U3U1F2OGM/edit?usp=sharing)
![alt tag](https://drive.google.com/file/d/0B9GTa-_sqdVJWlRfS0VWMGxxbzg/edit?usp=sharing)
![alt tag](https://drive.google.com/file/d/0B9GTa-_sqdVJa3YyY2xuYVY5V28/edit?usp=sharing)
![alt tag](https://drive.google.com/file/d/0B9GTa-_sqdVJYWdiX3VvVFhpUDQ/edit?usp=sharing)

![alt tag](https://drive.google.com/file/d/0B9GTa-_sqdVJMUhteE9WRFVOaGM/edit?usp=sharing)
![alt tag](https://drive.google.com/file/d/0B9GTa-_sqdVJT0k2Ujh3SERKS2s/edit?usp=sharing)

![alt tag](https://drive.google.com/file/d/0B9GTa-_sqdVJUUNBa1pCLXQyOU0/edit?usp=sharing)


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
