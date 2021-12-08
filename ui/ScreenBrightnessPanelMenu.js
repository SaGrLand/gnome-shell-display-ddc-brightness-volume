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
const DialogBox = Me.imports.ui.DialogBox;


var ScreenBrightnessPanelMenu = GObject.registerClass(class Screen_BrightnessPanelMenu extends PanelMenu.Button {
    _init() {
        super._init(St.Align.START);
        var icon =  new St.Icon({icon_name: 'display-brightness-symbolic', 
                                   style_class: 'system-status-icon'});
        this.add_actor(icon);

        var iconLabel = new St.Label({
                        style_class: 'helloworld-label', // add CSS label
                        text: 'br'
                        });
        this.add_actor(iconLabel);

        this.displays =  DDC.getDisplays();
        this.sliders = [];
        this.reloadDisplays();

        this.log_dialog = new DialogBox.DialogBox();

        this.log_button = new PopupMenu.PopupMenuItem('Show logging');
        this.log_button.connect('activate', (item) => {
            this.log_dialog.setText(Log.Log.toString());
            this.log_dialog.open(global.get_current_time());

        });
        this.menu.addMenuItem(this.log_button);
        
        Log.Log.log(`ScreenBrightnessPanelMenu init finsihed.`);
    }

    reloadDisplays() {
        if (Array.isArray(this.displays) && 1 <= this.displays.length) {
            var mainSliderValue = this.displays[0].current / this.displays[0].max; 
            var mainSlider = new SliderMenuItem.MainBrightnessSliderItem(
                mainSliderValue, this.sliders, {}); 

            this.menu.addMenuItem(mainSlider);
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
});
