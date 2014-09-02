//
//  PhoneGap ! ChildBrowserCommand
//
//
//  Created by Jesse MacFadyen on 10-05-29.
//  Copyright 2010 Nitobi. All rights reserved.
//

#import <Cordova/CDVPlugin.h>
#import "ChildBrowserViewController.h"

@interface ChildBrowserCommand : CDVPlugin <ChildBrowserDelegate>  { }

@property (nonatomic, retain) ChildBrowserViewController *childBrowser;
@property (nonatomic, strong) NSString *callbackId;
@property (nonatomic, strong) NSNumber *CLOSE_EVENT;
@property (nonatomic, strong) NSNumber *LOCATION_CHANGE_EVENT;
@property (nonatomic, strong) NSNumber *OPEN_EXTERNAL_EVENT;

-(void) showWebPage:(CDVInvokedUrlCommand*)command;
-(void) onChildLocationChange:(NSString*)newLoc;

-(NSDictionary*) dictionaryForEvent:(NSNumber*)event;

@end
