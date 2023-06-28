# Check if the argument is provided
if [ $# -eq 0 ]; then
  echo "Error: Argument required."
  echo "Usage: $0 robot_ip"
  exit 1
fi

# Access the argument passed
ip=$1

python deploy.py $ip
cp -r ~/robobreizh_pepper_ws/src/tablet_pepper/src/dom-robocup-manager/* ~/.local/share/PackageManager/apps/tablet/html