const GLib = imports.gi.GLib;
const ByteArray = imports.byteArray;

function exec(cmd) {
    try {
        let [, out] = GLib.spawn_command_line_sync(cmd);
        const response = ByteArray.toString(out);
        return response;
    } catch (err) {
        return null;
    }
}

function execAsync(cmd) {
    try {
        let [, out] = GLib.spawn_command_line_async(cmd);
        const response = ByteArray.toString(out);
        return response;
    } catch (err) {
        return null;
    }
}
