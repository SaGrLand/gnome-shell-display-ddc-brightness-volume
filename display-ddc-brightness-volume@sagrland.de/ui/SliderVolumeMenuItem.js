const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const GObject = imports.gi.GObject;

const Me = ExtensionUtils.getCurrentExtension();
const DDC = Me.imports.services.ddc;
const Log = Me.imports.services.log;
const Timer = Me.imports.services.timer;

var LabeldSliderItem = GObject.registerClass(class Labeld_SliderItem extends PopupMenu.PopupMenuItem {  
    _init(sliderValue, params) {
        super._init("", params);

        this.slider = new Slider.Slider(sliderValue);
        this._updateSliderLabel(sliderValue);
        this.slider.connect('notify::value', (item) => {
             this._updateSliderLabel(item._value); 
        });

        this.add(this.slider);
    }    

    _updateSliderLabel(sliderValue) {
        this.label.text = parseInt(sliderValue * 100).toString();
    }

    setValue(sliderValue){
        this.slider.value = sliderValue;
        this._updateSliderLabel(sliderValue);
    }
});

var VolumeSliderItem = GObject.registerClass(class Volume_SliderItem extends LabeldSliderItem {  
    _init(bus, name, currentVol, maxVol, params) {
        super._init("", params);

        this.connect('destroy', () => {this._onDestroy()});

        this.bus = bus;
        this.name = name;
        this.currentVol = currentVol;
        this.maxVol = maxVol;
        this.timeout = null;

        this.setValue(currentVol / maxVol);

        this.slider.connect('drag-end', (item) => {
              this._broadcastVolume(item._value);
        });

 var icon =  new St.Icon({icon_name: 'audio-volume-medium-symbolic', 
                                   style_class: 'menuItem'});
        this.add_child(icon);

    }



    setVolume(percent) {
        this.setValue(percent);
        this._broadcastVolume(percent);
        this._updateSliderLabel(percent);
    }

    _ratioToVolume(ratio) {
        return parseInt(ratio * this.maxVol);
    }

    _broadcastVolume(sliderValue) {
        if (this.timeout) {
            Timer.clearTimeout(this.timeout);
        }
        this.timeout = Timer.setTimeout(() => {
            var Volume = this._ratioToVolume(sliderValue);
            DDC.setAudioVolume(this.bus, Volume);
        }, 500);
    }

    _onDestroy(){
        if (this.timeout) {
            Timer.clearTimeout(this.timeout);
        };
    }

});

var MainVolumeSliderItem = GObject.registerClass(class Main_VolumeSliderItem extends LabeldSliderItem {  
    _init(value, sliders, params) {
        super._init(value, params);
        this.sliders = sliders;

        this.slider.connect('drag-end', (item) => {
              this._setAllVolume(item._value)
        });

        this.slider.connect('notify::value', (item) => {
              this._setAllValue(item._value)
        });
    }

    _setAllVolume(value) {
        for (var s of this.sliders) {
           s.setVolume(value);
        }
    }

    _setAllValue(value) {
        for (var s of this.sliders) {
           s.setValue(value);
        }
    }
});
