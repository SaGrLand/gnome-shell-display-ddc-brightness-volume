const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const GObject = imports.gi.GObject;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const DDC = Me.imports.services.ddc;
const Log = Me.imports.services.log;
const MyShell = Me.imports.services.shell;
const Timer = Me.imports.services.timer;
const SliderMenuItem = Me.imports.ui.SliderMenuItem;
const LogDialogBox = Me.imports.ui.LogDialogBox;
const InstallDDCUtilDialogBox = Me.imports.ui.InstallDDCUtilDialogBox;


var ScreenBrightnessPanelMenu = GObject.registerClass(class Screen_BrightnessPanelMenu extends PanelMenu.Button {
    _init() {
        super._init(St.Align.START);
        this.connect('destroy', () => {this._onDestroy()});

        var icon =  new St.Icon({icon_name: 'display-brightness-symbolic', 
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
        this.displays =  DDC.getDisplays();
        
        this.installDDCUtilDialog = new InstallDDCUtilDialogBox.InstallDDCUtilDialogBox();
        this.installDDCUtilButton = new PopupMenu.PopupMenuItem('ddcutil is not installed');
        if (this.displays){
            this.reloadDisplays();
        } else {
            Log.Log.log(`ScreenBrightnessPanelMenu - ddcutil not installed.`);
            this.installDDCUtilButton.connect('activate', (item) => {
                this.installDDCUtilDialog.open(global.get_current_time(), true);
            });
            this.menu.addMenuItem(this.installDDCUtilButton);
        };

        this.logDialog = new LogDialogBox.LogDialogBox();
        this.logButton = new PopupMenu.PopupMenuItem('Show logging');
        this.logButton.connect('activate', (item) => {
            this.logDialog.setText(Log.Log.toStringLastN(10));
            this.logDialog.open(global.get_current_time(), true);
        });

        this.reloadButton = new PopupMenu.PopupMenuItem('Reload displays');
        this.reloadButton.connect('activate', (item) => {
            this.populateMenu();
        });
        
        this.menu.addMenuItem(this.logButton);
        this.menu.addMenuItem(this.reloadButton);

    }

    reloadDisplays() {
        if (Array.isArray(this.displays) && 1 <= this.displays.length) {
            var mainSliderValue = this.displays[0].current / this.displays[0].max; 

            if (this.mainSlider == null) {
                this.mainSlider = new SliderMenuItem.MainBrightnessSliderItem(
                    mainSliderValue, this.sliders, {}); 
            }

            this.menu.addMenuItem(this.mainSlider);
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

            for (var display of this.displays) {
                var slider = new SliderMenuItem.BrightnessSliderItem(
                    display.bus, display.name, display.current, display.max, {});
                this.sliders.push(slider);
                this.menu.addMenuItem(slider);
            }
        } else {
            this.menu.addMenuItem(new PopupMenu.PopupMenuItem('No monitors detected.', {'reactive': false}));
        }
    }

    _onDestroy(){
        if (this.logDialog) {
            this.logDialog.close();
            this.logDialog.destroy();
            this.logDialog = null;
        };
        if (this.installDDCUtilDialog) {
            this.installDDCUtilDialog.close();
            this.installDDCUtilDialog.destroy();
            this.installDDCUtilDialog = null;
        };
    }
});
