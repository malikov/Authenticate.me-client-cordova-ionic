/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2011, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 * Copyright (c) 2013, Takhfifan.
 */
package com.phonegap.plugins.childBrowser;

import java.io.IOException;
import java.io.InputStream;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.R.bool;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.WindowManager.LayoutParams;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.PluginResult;
import org.apache.cordova.CallbackContext;

public class ChildBrowser extends CordovaPlugin {

    protected static final String LOG_TAG = "ChildBrowser";
    private static int CLOSE_EVENT = 0;
    private static int LOCATION_CHANGED_EVENT = 1;
    private static int OPEN_EXTERNAL_EVENT = 2;
    private static int BROWSER_OPENED = 3;

    private CallbackContext callbackContext = null;

    private Dialog dialog;
    private WebView webview;
    private EditText edittext;
    private boolean showLocationBar = true;
    private boolean showAddress = true;
    private boolean showNavigationBar = true;

    /**
     * Executes the request and returns boolean.
     *
     * @param action          The action to execute.
     * @param args            JSONArry of arguments for the plugin.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return                boolean
     */
    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext)
         throws JSONException
    {
        Log.d(LOG_TAG, action);
        String result = "";

        if (action.equals("showWebPage")) {
            Log.d(LOG_TAG, args.getString(0));
            Log.d(LOG_TAG, action);

            // If the ChildBrowser is already open then throw an error
            if (dialog != null && dialog.isShowing()) {
                callbackContext.error("ChildBrowser is already open");
            } else {
                this.callbackContext = callbackContext;
                result = this.showWebPage(args.getString(0), args.optJSONObject(1));

                if (result.length() > 0) {
                    callbackContext.error(result);
                } else {
                    JSONObject obj = new JSONObject();
                    obj.put("type", BROWSER_OPENED);
                    sendUpdate(obj, true);
                }
                Log.d(LOG_TAG, result);
            }
            return true;
        } else if (action.equals("close")) {
            closeDialog();

            JSONObject obj = new JSONObject();
            obj.put("type", CLOSE_EVENT);

            sendUpdate(obj, false);
            return true;
        } else if (action.equals("openExternal")) {
            result = this.openExternal(args.getString(0), args.optBoolean(1));
            if (result.length() > 0) {
                callbackContext.error(result);
            } else {
                JSONObject obj = new JSONObject();
                obj.put("type", OPEN_EXTERNAL_EVENT);
                sendUpdate(obj, true);
            }
            return true;
        }
        return false;
    }

    /**
     * Display a new browser with the specified URL.
     *
     * @param url           The url to load.
     * @param usePhoneGap   Load url in PhoneGap webview
     * @return              "" if ok, or error message.
     */
    public String openExternal(String url, boolean usePhoneGap) {
        try {
            Intent intent = null;
            if (usePhoneGap) {
                intent = new Intent().setClass((Context) cordova.getActivity(), org.apache.cordova.DroidGap.class);
                intent.setData(Uri.parse(url)); // This line will be removed in future.
                intent.putExtra("url", url);

                // Timeout parameter: 60 sec max - May be less if http device timeout is less.
                intent.putExtra("loadUrlTimeoutValue", 60000);

                // These parameters can be configured if you want to show the loading dialog
                intent.putExtra("loadingDialog", "Wait,Loading web page...");
                intent.putExtra("hideLoadingDialogOnPageLoad", true);
            } else {
                intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
            }
            cordova.getActivity().startActivity(intent);
            return "";
        } catch (android.content.ActivityNotFoundException e) {
            Log.d(LOG_TAG, "ChildBrowser: Error loading url " + url + ":" + e.toString());
            return e.toString();
        }
    }

    /**
     * Closes the dialog
     */
    private void closeDialog() {
        if (dialog != null) {
            dialog.dismiss();
        }
    }

    /**
     * Sees if it is possible to go back one page in history, then does so
     */
    private void goBack() {
        if (this.webview.canGoBack()) {
            this.webview.goBack();
        }
    }

    /**
     * Sees if it is possible to go forward one page in history, then does so
     */
    private void goForward() {
        if (this.webview.canGoForward()) {
            this.webview.goForward();
        }
    }

    /**
     * Navigate to the new page
     *
     * @param url to load
     */
    private void navigate(String url) {
        InputMethodManager imm = (InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(edittext.getWindowToken(), 0);

        if (!url.startsWith("http")) {
            this.webview.loadUrl("http://" + url);
        }
        this.webview.loadUrl(url);
        this.webview.requestFocus();
    }

    /**
     * Should we show the location bar?
     *
     * @return boolean
     */
    private boolean getShowLocationBar() {
        return this.showLocationBar;
    }

    /**
     * Display a new browser with the specified URL.
     *
     * @param url           The url to load.
     * @param jsonObject
     */
    public String showWebPage(final String url, JSONObject options) {
        // Determine if we should hide the location bar.
        if (options != null) {
            showLocationBar = options.optBoolean("showLocationBar", true);
            showNavigationBar = options.optBoolean("showNavigationBar", true);
            showAddress = options.optBoolean("showAddress", true);
        }

        // Create dialog in new thread
        Runnable runnable = new Runnable() {
            public void run() {
                dialog = new Dialog((Context) cordova.getActivity());

                dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
                dialog.setCancelable(true);
                dialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
                    public void onDismiss(DialogInterface dialog) {
                        webview.stopLoading();
                        try {
                            JSONObject obj = new JSONObject();
                            obj.put("type", CLOSE_EVENT);

                            sendUpdate(obj, false);
                        } catch (JSONException e) {
                            Log.d(LOG_TAG, "Should never happen");
                        }
                    }
                });

                LinearLayout.LayoutParams backParams = new LinearLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
                LinearLayout.LayoutParams forwardParams = new LinearLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
                LinearLayout.LayoutParams editParams = new LinearLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT, 1.0f);
                LinearLayout.LayoutParams closeParams = new LinearLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
                LinearLayout.LayoutParams wvParams = new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT);
                if (!showAddress) // larger buttons if address bar is not visible
                {
                    backParams = new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT, 1.0f);
                    forwardParams = new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT, 1.0f);
                    closeParams = new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT, 1.0f);
                }

                LinearLayout main = new LinearLayout((Context) cordova.getActivity());
                main.setOrientation(LinearLayout.VERTICAL);

                LinearLayout toolbar = new LinearLayout((Context) cordova.getActivity());
                toolbar.setOrientation(LinearLayout.HORIZONTAL);

                ImageButton back = new ImageButton((Context) cordova.getActivity());
                back.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        goBack();
                    }
                });
                back.setId(1);
                try {
                    back.setImageBitmap(loadDrawable("www/childbrowser/icon_arrow_left.png"));
                } catch (IOException e) {
                    Log.e(LOG_TAG, e.getMessage(), e);
                }
                back.setLayoutParams(backParams);

                ImageButton forward = new ImageButton((Context) cordova.getActivity());
                forward.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        goForward();
                    }
                });
                forward.setId(2);
                try {
                    forward.setImageBitmap(loadDrawable("www/childbrowser/icon_arrow_right.png"));
                } catch (IOException e) {
                    Log.e(LOG_TAG, e.getMessage(), e);
                }
                forward.setLayoutParams(forwardParams);

                edittext = new EditText((Context) cordova.getActivity());
                edittext.setOnKeyListener(new View.OnKeyListener() {
                    public boolean onKey(View v, int keyCode, KeyEvent event) {
                        // If the event is a key-down event on the "enter" button
                        if ((event.getAction() == KeyEvent.ACTION_DOWN) && (keyCode == KeyEvent.KEYCODE_ENTER)) {
                            navigate(edittext.getText().toString());
                            return true;
                        }
                        return false;
                    }
                });
                edittext.setId(3);
                edittext.setSingleLine(true);
                edittext.setText(url);
                edittext.setLayoutParams(editParams);

                ImageButton close = new ImageButton(cordova.getActivity());
                close.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        closeDialog();
                    }
                });
                close.setId(4);
                try {
                    close.setImageBitmap(loadDrawable("www/childbrowser/icon_close.png"));
                } catch (IOException e) {
                    Log.e(LOG_TAG, e.getMessage(), e);
                }
                close.setLayoutParams(closeParams);

                webview = new WebView((Context) cordova.getActivity());
                webview.getSettings().setJavaScriptEnabled(true);
                webview.getSettings().setBuiltInZoomControls(true);
                WebViewClient client = new ChildBrowserClient(cordova, edittext);
                webview.setWebViewClient(client);
                webview.loadUrl(url);
                webview.setId(5);
                webview.setInitialScale(0);
                webview.setLayoutParams(wvParams);
                webview.requestFocus();
                webview.requestFocusFromTouch();
                webview.getSettings().setUseWideViewPort(true);
                webview.getSettings().setLoadWithOverviewMode(true);
                toolbar.addView(back);
                toolbar.addView(forward);
                toolbar.addView(edittext);
                toolbar.addView(close);

                if (getShowLocationBar()) {
                    main.addView(toolbar);
                }
                main.addView(webview);

                WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
                lp.copyFrom(dialog.getWindow().getAttributes());
                lp.width = WindowManager.LayoutParams.FILL_PARENT;
                lp.height = WindowManager.LayoutParams.FILL_PARENT;

                dialog.setContentView(main);
                dialog.show();
                dialog.getWindow().setAttributes(lp);

                if (!showNavigationBar) {
                    back.setVisibility(View.GONE);
                    forward.setVisibility(View.GONE);
                    close.setVisibility(View.GONE);
                }
                if (!showAddress) {
                    edittext.setVisibility(View.GONE);
                }
            }

            private Bitmap loadDrawable(String filename) throws java.io.IOException {
                InputStream input = cordova.getActivity().getAssets().open(filename);
                return BitmapFactory.decodeStream(input);
            }
        };
        cordova.getActivity().runOnUiThread(runnable);
        return "";
    }

    /**
     * Create a new plugin result and send it back to JavaScript
     *
     * @param obj a JSONObject contain event payload information
     */
    private void sendUpdate(JSONObject obj, boolean keepCallback) {
        if (this.callbackContext != null) {
            PluginResult pr = new PluginResult(PluginResult.Status.OK, obj);
            pr.setKeepCallback(keepCallback);
            callbackContext.sendPluginResult(pr);
            Log.d("ChildBrowser", "sent plugin result via callbackContext");
        } else {
            Log.d("ChildBrowser", "callbackContext is null :|");
        }
    }

    /**
     * The webview client receives notifications about appView
     */
    public class ChildBrowserClient extends WebViewClient {
        CordovaInterface ctx;
        EditText edittext;

        /**
         * Constructor.
         *
         * @param mContext
         * @param edittext
         */
        public ChildBrowserClient(CordovaInterface mContext, EditText mEditText) {
            this.ctx = mContext;
            this.edittext = mEditText;
        }

        /**
         * Notify the host application that a page has started loading.
         *
         * @param view          The webview initiating the callback.
         * @param url           The url of the page.
         */
        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            String newloc;
            if (url.startsWith("http:") || url.startsWith("https:")) {
                newloc = url;
            } else {
                newloc = "http://" + url;
            }

            if (!newloc.equals(edittext.getText().toString())) {
                edittext.setText(newloc);
            }

            try {
                JSONObject obj = new JSONObject();
                obj.put("type", LOCATION_CHANGED_EVENT);
                obj.put("location", url);

                sendUpdate(obj, true);
            } catch (JSONException e) {
                Log.d("ChildBrowser", "This should never happen");
            }
        }
    }
}
