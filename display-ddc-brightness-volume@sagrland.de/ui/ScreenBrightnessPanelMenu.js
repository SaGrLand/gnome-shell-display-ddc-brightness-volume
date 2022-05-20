const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const GObject = imports.gi.GObject;
const ExtensionUtils = imports.misc.extensionUtils;
const Gio = imports.gi.Gio;
const Me = ExtensionUtils.getCurrentExtension();

const DDC = Me.imports.services.ddc;
const Log = Me.imports.services.log;
const MyShell = Me.imports.services.shell;
const Timer = Me.imports.services.timer;
const SliderMenuItem = Me.imports.ui.SliderMenuItem;
const SliderVolumeMenuItem = Me.imports.ui.SliderVolumeMenuItem;
const LogDialogBox = Me.imports.ui.LogDialogBox;
const InstallDDCUtilDialogBox = Me.imports.ui.InstallDDCUtilDialogBox;


var ScreenBrightnessPanelMenu = GObject.registerClass(class Screen_BrightnessPanelMenu extends PanelMenu.Button {
    _init() {
        super._init(St.Align.START);
        this.connect('destroy', () => {this._onDestroy()});
        var icon =  new St.Icon({icon_name: 'display-projector-symbolic', 
                                   style_class: 'system-status-icon'});
        this.add_actor(icon);

        var iconLabel = new St.Label({
                        style_class: 'helloworld-label', // add CSS label
                        text: 'br'
                        });
        this.add_actor(iconLabel);
        this.populateMenu();

        Log.Log.log(`ScreenBrightnessPanelMenu init finsihed.`);
    }


    populateMenu(){
        this.setMenu(new PopupMenu.PopupMenu(this, St.Align.START, St.Side.TOP, 0));
        this.sliders = [];
        this.mainSlider = null;

        try{
            this.displays =  DDC.getDisplays();

            this.installDDCUtilButton = new PopupMenu.PopupMenuItem('ddcutil is not installed');
            if (this.displays){
                this.addDisplaySliders();
            } else {
                Log.Log.log(`ScreenBrightnessPanelMenu - ddcutil not installed.`);
                this.installDDCUtilButton.connect('activate', (item) => {
                    this.installDDCUtilDialog = new InstallDDCUtilDialogBox.InstallDDCUtilDialogBox();
                    this.installDDCUtilDialog.connect('destroy', () => {this.installDDCUtilDialog = null});
                    this.installDDCUtilDialog.open(global.get_current_time(), true);
                });
                this.menu.addMenuItem(this.installDDCUtilButton);
            };
        } catch(error){
            Log.Log.log(error.stack);
            this.displays = null; 
        }

        this.logButton = new PopupMenu.PopupImageMenuItem('Show logging','text-x-generic-symbolic');
        this.logButton.connect('activate', (item) => {
            this.logDialog = new LogDialogBox.LogDialogBox();
            this.logDialog.connect('destroy', () => {this.logDialog = null});
            this.logDialog.setText(Log.Log.toStringLastN(10));
            this.logDialog.open(global.get_current_time(), true);
        });

        this.reloadButton = new PopupMenu.PopupImageMenuItem('Reload displays','system-restart-symbolic');
        this.reloadButton.connect('activate', (item) => {
            this.populateMenu();
        });
        
        this.menu.addMenuItem(this.logButton);
        this.menu.addMenuItem(this.reloadButton);

    }

    addDisplaySliders() {
        if (Array.isArray(this.displays) && 0 < this.displays.length) {

            for (var display of this.displays) {
                this.menu.addMenuItem(new PopupMenu.PopupMenuItem(display.name));
                var slider = new SliderMenuItem.BrightnessSliderItem(
                    display.bus, display.name, display.current, display.max, {});
                this.sliders.push(slider);
                this.menu.addMenuItem(slider);
                if (!(isNaN(display.currentVol))) {
                    var audioslider = new SliderVolumeMenuItem.VolumeSliderItem(
                        display.bus, display.name, display.currentVol, display.maxVol, {});
                    this.sliders.push(audioslider);
                    this.menu.addMenuItem(audioslider);
                }
                this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            }
        } else {
            this.menu.addMenuItem(new PopupMenu.PopupMenuItem('No monitors detected.', {'reactive': false}));
        }
    }

    _onDestroy(){
        if (this.logDialog) {
            this.logDialog.destroy();
            this.logDialog = null;
        };
        if (this.installDDCUtilDialog) {
            this.installDDCUtilDialog.destroy();
            this.installDDCUtilDialog = null;
        };
    }
});
