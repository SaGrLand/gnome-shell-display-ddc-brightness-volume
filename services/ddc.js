'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const MyShell = Me.imports.services.shell;

function getDisplays() {

    const result = MyShell.exec('ddcutil detect --brief');
    log(`${Me.metadata.uuid} - getDisplays ${result}`);
    const displays = [];

    result.split('Display ').forEach(group => {
        const lines = group.split('\n');
        const bus = lines[1] ? lines[1].split('/dev/i2c-')[1].trim() : null;
        const description = lines[2] ? lines[2].split('Monitor:')[1].trim() : null;
        const name = description ? description.split(':')[1] : null;
        //const serialNumber = description ? description.split(':')[2] : null;
        
        if (bus && name){ //&& serialNumber) {
            const {current, max} = getDisplayBrightness(bus);
            log(`${Me.metadata.uuid} - getDisplays - OK ${bus}, ${description}, ${name}, ${current}, ${max}`);
            displays.push({
                bus,
                name,
                //serialNumber,
                current,
                max
            });
        } else {
            log(`${Me.metadata.uuid} - getDisplays - ERR ${bus}, ${description}, ${name}`);
        }

    });

    return displays;
}

function getDisplayBrightness(bus) {
    const result = MyShell.exec(`ddcutil getvcp 10 --bus ${bus} --brief`).split(' ');
    log(`${Me.metadata.uuid} - getDisplayBrightness ${result}`);
    return {
        current: result[3],
        max: result[4]
    };
}

function setDisplayBrightness(bus, value) {
    const result = MyShell.execAsync(`ddcutil setvcp 10 ${value} --bus ${bus}`);
    log(`${Me.metadata.uuid} - setDisplayBrightness ${result}`);
}
