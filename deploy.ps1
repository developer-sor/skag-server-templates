echo "Zipping"
& 'C:\Program Files (x86)\GnuWin32\bin\zip' templates.war * -9 -q -r -x templates.war *~
echo "Copying"

rem 'C:\Program Files (x86)\PuTTY\pscp' .\templates.war 56a601040c1e66f738000132@skagerak-dpnmn.rhcloud.com:wildfly/standalone/deployments
& 'C:\Program Files (x86)\PuTTY\pscp' .\templates.war ubuntu@ec2-52-58-27-236.eu-central-1.compute.amazonaws.com:wildfly/standalone/deployments
