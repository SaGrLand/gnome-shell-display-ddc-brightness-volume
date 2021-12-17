'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Log = Me.imports.services.log;
const MyShell = Me.imports.services.shell;

function getValueFromString(value, key, idx){
    if (value != null){
        if (value.includes(key)){
            if(idx != null){
                return value.split(key)[idx].trim();
            } else {
                return value.split(key);
            }

        }
    }
    return null;
}

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
            const bus = getValueFromString(lines[1], '/dev/i2c-', 1);
            const description = getValueFromString(lines[2], 'Monitor:', 1);
            const name = getValueFromString(description, ':', 1);
            //const serialNumber = description ? description.split(':')[2] : null;
            
            if (bus && name){
                var  rv = getDisplayBrightness(bus);
                var current = rv.current;
                var max = rv.max;
                
                if (current == null || max == null){
                    Log.Log.log(`getDisplays - ERR ${bus}, ${description}, ${name}, ${current}, ${max}`);
                    current = 0;
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

    var values = getValueFromString(getValueFromString(result, 'VCP ', 1),
                                    ' ', null);

    if (values == null || values.length < 4){
        return {
        current: null,
        max: null
        };
    }
    return {
        current: values[2].trim(),
        max: values[3].trim()
    };
}

function setDisplayBrightness(bus, value) {
    const result = MyShell.execAsync(`ddcutil setvcp 10 ${value} --bus ${bus}`);
    Log.Log.log(`setDisplayBrightness - value: ${value}, bus: ${bus}, result: ${result}`);
}
