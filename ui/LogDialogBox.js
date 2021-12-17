const St = imports.gi.St;
const Gio = imports.gi.Gio;
const ModalDialog = imports.ui.modalDialog;
const Clutter = imports.gi.Clutter;
const GObject = imports.gi.GObject;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Log = Me.imports.services.log;


var LogDialogBox = GObject.registerClass(class Log_DialogBox extends ModalDialog.ModalDialog {
    _init() {
        super._init({ styleClass: 'extension-dialog'});

        this.setButtons([{ label: "OK",
                           action: () => {this._onClose()},
                           key:    Clutter.KEY_Escape
                         },
                         { label: "Copy to clipboard",
                           action: () => {this._copyToClipBoard()},
                           key:    Clutter.KEY_Tab
                         },

                         ]);

        var box = new St.BoxLayout({ vertical: true});
        

        var gicon = new Gio.FileIcon({ file: Gio.file_new_for_path(Me.path + "/icons/icon.png") });
        var icon = new St.Icon({ gicon: gicon });
        box.add(icon);

        this.label = new St.Label({ text: "" ,
         x_align: Clutter.ActorAlign.CENTER,
          style_class: "title-label" });

        box.add(this.label);

        this.contentLayout.add(box);
    }

    setText(text){
        this.label.text = text;
    }

    _onClose() {
        this.close(global.get_current_time());
    }

    _copyToClipBoard() {
        St.Clipboard.get_default().set_text(St.ClipboardType.CLIPBOARD, Log.Log.toString());
        this.close(global.get_current_time());
    }
});