const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const ScreenBrightnessPanelMenu = Me.imports.ui.ScreenBrightnessPanelMenu;
const Log = Me.imports.services.log;


var screenBrightnessPanelMenu;


function init() {
    Log.Log.log(`initializing,  version ${Me.metadata.version}`);
}

function enable() {
    screenBrightnessPanelMenu = new ScreenBrightnessPanelMenu.ScreenBrightnessPanelMenu();
    Main.panel.addToStatusArea('adjust_display_brightness', screenBrightnessPanelMenu); 
}

function disable() {
    if (screenBrightnessPanelMenu) {
        screenBrightnessPanelMenu.destroy();
        screenBrightnessPanelMenu = null;
    }

    Log.Log.empty();
}
