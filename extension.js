const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const ScreenBrightnessPanelMenu = Me.imports.ui.ScreenBrightnessPanelMenu;


let screenBrightnessPanelMenu;

function init() {
    log(`${Me.metadata.uuid} initializing,  version ${Me.metadata.version}`);
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
}
