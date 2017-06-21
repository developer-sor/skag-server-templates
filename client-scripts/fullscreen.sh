killall epiphany-browser
sudo -u pi killall -9 -w  iceweasel
# sleep 15 && sudo -u pi epiphany-browser -a --profile ~/.config  --display=:0 file:///home/pi/repo/index.html >>/home/pi/ep-log.txt 2>&1 &
# sleep 15 && sudo -u pi iceweasel -fullscreen --display=:0 file:///home/pi/repo/index.html?forceFetch=true >>/home/pi/ep-log.txt 2>&1 &

#Sletting av Google Chromium tempfolder hvis denne finnes (tidligere feil)
sudo rm -rf file:///home/pi/repo/client-scripts/file:

#Kopiere preferencefilen til Chromium for å få bukt med restore-last-session popup (denne lar seg ikke toggle fra terminal)
cp Preferences /home/pi/file:/home/pi/Default

#Kjør Chromium med infobars, cors-sikkerhet og popups skrudd av
sleep 15 && sudo -u pi chromium-browser -kiosk --disable-web-security --disable-infobars --disable-translate --user-data-dir=file:///home/pi/ file:///home/pi/repo/index.html?forceFetch=true >>/home/pi/ep-log.txt 2>&1 &
sleep 20
xte 'mousemove 2000 200' -x:0