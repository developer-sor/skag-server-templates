killall epiphany-browser
sudo -u pi killall -9 -w  iceweasel
# sleep 15 && sudo -u pi epiphany-browser -a --profile ~/.config  --display=:0 file:///home/pi/repo/index.html >>/home/pi/ep-log.txt 2>&1 &
sleep 15 && sudo -u pi iceweasel --display=:0 file:///home/pi/repo/index.html?forceFetch=true -fullscreen >>/home/pi/ep-log.txt 2>&1 &
sleep 20
xte -x :0 'sleep 9' 'key F11'&
xte 'mousemove 2000 200' -x:0