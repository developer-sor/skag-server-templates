
## dette er /home/pi/.config/lxsession/LXDE-pi/autostart

@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
# @xscreensaver -no-splash

@xset s off
@xset -dpms
@xset s noblank

/home/pi/repo/client-scripts/fullscreen.sh
