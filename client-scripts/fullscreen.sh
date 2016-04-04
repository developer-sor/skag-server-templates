killall epiphany-browser
sudo -u pi killall -9 -w  iceweasel
# sleep 15 && sudo -u pi epiphany-browser -a --profile ~/.config  --display=:0 file:///home/pi/repo/index.html >>/home/pi/ep-log.txt 2>&1 &
sleep 15 && sudo -u pi iceweasel -fullscreen --display=:0 file:///home/pi/repo/index.html?forceFetch=true >>/home/pi/ep-log.txt 2>&1 &
sleep 20