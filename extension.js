const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const ScreenBrightnessPanelMenu = Me.imports.ui.ScreenBrightnessPanelMenu;


let screenBrightnessPanelMenu;

function init() {
    log(`Initializing ${Me.metadata.name} version ${Me.metadata.version}`);
}

function enable() {
    screenBrightnessPanelMenu = new ScreenBrightnessPanelMenu.ScreenBrightnessPanelMenu();
    Main.panel.addToStatusArea('brightness', screenBrightnessPanelMenu); 
}

function disable() {
    if (screenBrightnessPanelMenu) {
        screenBrightnessPanelMenu.destroy();
        screenBrightnessPanelMenu = null;
    }
}
