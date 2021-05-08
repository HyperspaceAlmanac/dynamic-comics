# Welcome to Dynamic Paintbrush!

This is my Capstone project at DevCodeCamp.

This is a full stack platform for interactive graphic novels platform for artists to make and share interactive graphic novels. This is a asp.net backend with react.js front end, and has features such as profile page, reviews, comments, and donations button using Stripes API.

The artist can upload images, and then put them together into interactive graphic novels in the workstation.

The workstation lets the artists add panels, and then specify actions that should take place at certain times.

The data is then saved to database, and readers can enjoy these.

For now, this is basic proof of concept and made in 2 weeks as my final Capstone project at DevCodeCamp. In the future the editor and other parts may be greatly expanded in functionality. For now it works.

## Supported Commands to interact with images:

With this platform, the user can make comics that have panels that can have commands attached to them. The user can show an image, move it around, scale it and so on at specific time stamps. The user can also add triggers so that the graphic novel proceeds when an image is hovered over or clicked.

This will likely be expanded later, but the user must upload images through their Profile -> Resources page, and then will be able to access the resources in their workstation.

User can either upload a resource that everyone can use, or to upload something so that only they can use.

Currently, there is limitation of each image needing to be unique (no such limitation for text). In the future there will likely be feature to allow artist to display same image multiple times by adding in panel specific image ID.

# Fields and Currently Supported Commands:

Fields:

PanelId, NextPanelId, and ResourceId:

Panel ID is unique identitifer for current panel. NextPanelId is panel to go to for actions transitioning to next panel and should just be left the same as PanelID most of the time. ResourceId and unique identitifer for an image, and not used when using text which will use a different value as identifier.

All there of these values displayed to the developer and are what is in the database. It is developer responsiblity to make sure that they are correct.

PanelId should only be edited for if the developer wants to move an action from one panel to another. The editor will refresh properly and the action will be transferred over.

Timing, Priority, and Layer:

Timing is on what frame the action should happen in a panel. The panel will always start on and load time 0. When moving to a new time, all actions specified for that time will run.

Priority is the order (lowest first) for how the actions should resolve. For example, it is possible to show an image and move it at the same time, but the show command should run with a lower value to run first, and then for the move to happen.

Layer for images is how far up front it should go, and directly correlates to z-index. Text is always set to z-index 9, and the layer value is instead used as a unique identifier for that text.

ActionType and Options are strings that should specify what should happen, and give more parameters for how it hsould be done. For example, Options serves as parameters for how where image should move to for "move" command. For text, Options value is what should be displayed.

IsTrigger, Transition, and Active toggles: IsTrigger is used to indicate that the image something should happen on hover or on click. Transition is currently used to show that when the timing is reached, that the graphic novel should go to the NextPanelId specified. Active toggle is for indicating whether this action should happen. The user can add in several actions and not have them do anything until further edits.

# Currently Supported Operations and Commands to do them:

Show Image and Show Text should be set to priority value lower than move / scale if image should be displayed at a specific location at a specifi size.

1. Display Image (add an image to be displayed for the rest of panel or until it is hidden). Default width is 5vw, and always set to auto-scaling height.

Position of image (and text) based on offset from top left corner of screen. Only used vw vh so far, but other units such as px should work as long as it is given as {"width height"}.

ActionType = "show", Options = string of width, space, height,ResourceId = Id of image, layer: z-index

2. Hide Image

ActionType = "hide", ResourceId = Id of image.

3. Move Image

ActionType = "move", Options = new location given as {width height} offset from top left corner, ResourceId = ID of image

4. Scale Image

ActionType = "scale", Options = how wide the width should be, EX: "20vw", height is always auto scale, ResourceId = ID of image

For the click and hover, they will only be in effect for that one frame. On next frame they will be removed.

5. Add click to to go to next page (Image Only!)

IsTrigger = Yes, ActionType = "click", ResourceId = ID of image

6. Add hover to go to next page (Image Only!)

IsTrigger = Yes, ActionType = "hover", ResourceId = ID of image

7. Add / Show Text

ActionType = "showText", Options = Text to display, layer = unique Id (up to user) for that text (for moving / resizing / hiding later).

Default position is "10vw 10vh".

If adding and moving image on same frame, need to make sure that 

8. Move text

ActionType = "moveText", Options = new position {width height} offset from top left, layer = unique text ID to move.


10. Transition to another Panel

Toggle on Transition, and give it a timing and NextPanelId. Graphic Novel will transition to that panel on reaching the time.


# Unsplash Images Used:

City Landscape:

https://unsplash.com/photos/wpU4veNGnHg?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink

City Portrait:

https://unsplash.com/photos/enGr5YbjQKQ?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink





