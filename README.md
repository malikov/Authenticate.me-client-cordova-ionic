Authenticate.me app front end (ionic, angularjs, cordova)
================================================================

A starting project to achieve server side authentication for hybrid apps. This is the front end. You can either create your server side api based on the following blog post : [http://www.frnchnrd.com/blog/](blogpost) or reuse the [https://github.com/malikov/Authenticate.me-Node-Server](authenticate.me server nodejs codebase).

## Using this project

1. Ionic / Cordova 

make sure both [http://ionicframework.com/](ionic) and cordova are installed on your machine if not then run : 

```bash
 npm install -g cordova ionic
```

Note : if npm isn't defined you'll need to install [http://nodejs.org/](node)

2. Clone this repo
```bash
 git clone https://github.com/malikov/Authenticate.me-client-cordova-ionic.git
```

Then navigate to the repo :
```bash
 cd Authenticate.me-client-cordova-ionic
```

3. Dependencies

Run :
```bash
 npm install
```

This should install all dependencies for the project.


4. Add a platform

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

