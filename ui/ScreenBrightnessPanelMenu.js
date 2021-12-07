const St = imports.gi.St;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const GObject = imports.gi.GObject;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const DDC = Me.imports.services.ddc;
const MyShell = Me.imports.services.shell;
const Timer = Me.imports.services.timer;

const SliderMenuItem = Me.imports.ui.SliderMenuItem;


const ScreenBrightnessPanelMenu = GObject.registerClass(class Screen_Brightness extends PanelMenu.Button {
    _init() {
        super._init(St.Align.START);
       
        this.displays = DDC.getDisplays();
        this.brightness = parseInt(this.displays[0]['current']).toString();


        const icon =  new St.Icon({icon_name: 'display-brightness-symbolic', 
                                   style_class: 'system-status-icon'});
        this.add_actor(icon);

        let iconLabel = new St.Label({
                        style_class: 'helloworld-label', // add CSS label
                        text: "br"
                        });
        this.add_actor(iconLabel);

        this.displays = DDC.getDisplays();
        this.sliders = [];
        this.reloadDisplays();
    }

    reloadDisplays() {
        if (this.displays) {
            let mainSliderValue = this.displays[0].current / this.displays[0].max; 
            let mainSlider = new SliderMenuItem.MainBrightnessSliderItem(mainSliderValue, this.sliders, {}); 

            this.menu.addMenuItem(mainSlider);
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

            for (const display of this.displays) {
                const slider = new SliderMenuItem.BrightnessSliderItem(display.bus, `${display.name}`, display.current, display.max, {});
                this.sliders.push(slider);
                this.menu.addMenuItem(slider);
            }
        } else {
            this.menu.addMenuItem(new PopupMenu.PopupMenuItem("No monitors detected.", {'reactive': false}));
        }
    }
});
