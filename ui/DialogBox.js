const St = imports.gi.St;
const Lang = imports.lang;
const Gio = imports.gi.Gio;
const ModalDialog = imports.ui.modalDialog;
const Clutter = imports.gi.Clutter;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Log = Me.imports.services.log;

const DialogBox = new Lang.Class({
    Name: 'MyAboutDialog',
    Extends: ModalDialog.ModalDialog,

    _init: function() {
        this.parent({ styleClass: 'extension-dialog' });

        this.setButtons([{ label: "OK",
                           action: Lang.bind(this, this._onClose),
                           key:    Clutter.Escape
                         },
                         { label: "Copy to clipboard",
                           action: Lang.bind(this, this._copyToClipBoard),
                           key:    Clutter.Escape
                         },

                         ]);

        let box = new St.BoxLayout({ vertical: true});
        this.contentLayout.add(box);

        let gicon = new Gio.FileIcon({ file: Gio.file_new_for_path(Me.path + "/icons/icon.png") });
        let icon = new St.Icon({ gicon: gicon });
        box.add(icon);

        this.label = new St.Label({ text: "" ,
         x_align: Clutter.ActorAlign.CENTER,
          style_class: "title-label" });

        box.add(this.label);
    },

    setText(text){
        this.label.text = text;
    },

    

    _onClose: function(button, event) {
        this.close(global.get_current_time());
    },

    _copyToClipBoard: function(button, event) {
        St.Clipboard.get_default().set_text(St.ClipboardType.CLIPBOARD, Log.Log.toString());
        this.close(global.get_current_time());
    },

});