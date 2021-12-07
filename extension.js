const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const ScreenBrightnessPanelMenu = Me.imports.ui.ScreenBrightnessPanelMenu;


function init() {
    log(`Initializing ${Me.metadata.name} version ${Me.metadata.version}`);
}

let screenBrightnessPanelMenu;

function enable() {
    screenBrightnessPanelMenu = new ScreenBrightnessPanelMenu.ScreenBrightnessPanelMenu();
    Main.panel.addToStatusArea('brightness', screenBrightnessPanelMenu); 
}

function disable() {
    screenBrightnessPanelMenu.destroy();
    screenBrightnessPanelMenu = null;
}
