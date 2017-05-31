killall epiphany-browser
sudo -u pi killall -9 -w  iceweasel
# sleep 15 && sudo -u pi epiphany-browser -a --profile ~/.config  --display=:0 file:///home/pi/repo/index.html >>/home/pi/ep-log.txt 2>&1 &
# sleep 15 && sudo -u pi iceweasel -fullscreen --display=:0 file:///home/pi/repo/index.html?forceFetch=true >>/home/pi/ep-log.txt 2>&1 &
<<<<<<< HEAD

#Sletting av Google Chromium tempfolder hvis denne finnes (tidligere feil)
sudo rm -rf file:///home/pi/repo/client-scripts/file:

#--disable-infobars
sleep 15 && sudo -u pi chromium-browser -kiosk --args --disable-web-security --disable-session-crashed-bubble --test-type --disable-translate --user-data-dir=file:///home/pi/ file:///home/pi/repo/index.html?forceFetch=true >>/home/pi/ep-log.txt 2>&1 &
sleep 20
xte 'mousemove 2000 200' -x:0