# gnome-shell-display-ddc-brightness-volume

<img src="https://github.com/SaGrLand/gnome-shell-display-ddc-brightness-volume/blob/master/Display_DCC_Brightness_Volume.png">

Simple GNOME extension to control displays' brightness and audio volume via DDC.

## Preparation (Manjaro/ Fedora)

1. Install `ddcutil`: 

```shell
sudo pacman -Syu ddcutil
```
2. Create i2c Group

```shell
sudo groupadd --system i2c
```
3. Add User to i2c Group

```shell
sudo usermod -aG i2c $USER
```
4. Add Permissions

```shell
sudo cp /usr/share/ddcutil/data/45-ddcutil-i2c.rules /etc/udev/rules.d
```
5. Add i2c-dev Module

```shell
sudo /bin/sh -c 'echo i2c-dev >> /etc/modules-load.d/i2c-dev.conf'
```

A reboot is needed.

## Official GNOME Shell Extensions website
[https://github.com/SaGrLand/gnome-shell-display-ddc-brightness-volume/] (https://github.com/SaGrLand/gnome-shell-display-ddc-brightness-volume/)

## Forked from
[https://extensions.gnome.org/extension/4652/adjust-display-brightness/](https://extensions.gnome.org/extension/4652/adjust-display-brightness/)
