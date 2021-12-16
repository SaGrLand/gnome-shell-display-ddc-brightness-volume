'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Log = Me.imports.services.log;
const MyShell = Me.imports.services.shell;

function getDisplays() {

    const result = MyShell.exec('ddcutil detect --brief');

    if (result == null){
        return null;
    };

    Log.Log.log(`getDisplays - ${result}`);
    const displays = [];

    result.split('Display ').forEach(group => {
        const lines = group.split('\n');
        if (2 < lines.length){
            const bus = lines[1] ? lines[1].split('/dev/i2c-')[1].trim() : null;
            const description = lines[2] ? lines[2].split('Monitor:')[1].trim() : null;
            const name = description ? description.split(':')[1] : null;
            //const serialNumber = description ? description.split(':')[2] : null;
            
            if (bus && name){ //&& serialNumber) {
                var  rv = getDisplayBrightness(bus);
                var current = rv.current;
                var max = rv.max;
                
                if (current == null || max == null){
                    Log.Log.log(`getDisplays - ERR ${bus}, ${description}, ${name}, ${current}, ${max}`);
                    current = 0;java
                    max = 100;
                } else {
                    Log.Log.log(`getDisplays - OK ${bus}, ${description}, ${name}, ${current}, ${max}`);
                }

                displays.push({
                    bus,
                    name,
                    //serialNumber,
                    current,
                    max
                });
            } else {
                Log.Log.log(`getDisplays - ERR ${bus}, ${description}, ${name}`);
            }
        }

    });

    return displays;
}

function getDisplayBrightness(bus) {
    const result = MyShell.exec(`ddcutil getvcp 10 --bus ${bus} --brief`);
    Log.Log.log(`getDisplayBrightness - bus: ${bus}, result: ${result}`);

    var vcp_split = result.split('VCP ')[1];
    if (vcp_split==null){
        return {
        current: null,
        max: null
        };
    }

    var values = vcp_split.split(" ");

    if (values.length < 4){
        return {
        current: null,
        max: null
        };
    }


    return {
        current: values[2],
        max: values[3]
    };
}

function setDisplayBrightness(bus, value) {
    const result = MyShell.execAsync(`ddcutil setvcp 10 ${value} --bus ${bus}`);
    Log.Log.log(`setDisplayBrightness - value: ${value}, bus: ${bus}, result: ${result}`);
}
