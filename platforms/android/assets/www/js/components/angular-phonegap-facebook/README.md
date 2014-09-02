# angular-phonegap-facebook
Helper for using PhoneGap's facebook plugin. Dependencie : [angular-phonegap-ready](https://github.com/btford/hitch-a-ride-client/tree/master/app/components/angular-phonegap-ready) by Brian Ford

## How to use
Create a facebook app

Create a key for your app (android or ios)

For ANDROID APPS ONLY hash that key by following the instructions on [facebook developers](https://developers.facebook.com/docs/android/getting-started/)

Add it to your facebook app (Apps > [your app's name] > Settings then click on add platform, select android and add it in Key Hashes)

Add the facebook plugin to your app's config.xml file
	
	<gap:plugin name="com.phonegap.plugins.facebookconnect">
    		<param name="APP_ID" value="..." />
    		<param name="APP_NAME" value="..." />
	</gap:plugin>

Add the plugin to your project
	
	cordova plugin add https://github.com/phonegap/phonegap-facebook-plugin.git --variable APP_ID="your app id" --variable APP_NAME="Your app name"

Make sure to CHANGE the header cdv:"xmlns etc..." in your config.xml for gap:"xmlns etc..." Otherwise your build will FAIL

Get the [angular-phonegap-ready](https://github.com/btford/hitch-a-ride-client/tree/master/app/components/angular-phonegap-ready) component

Include both this component and angular-phonegap-facebook
In the app.module().run function add the injected component and call facebook.init([AppId])


## Example 
To be added

## License
MIT
