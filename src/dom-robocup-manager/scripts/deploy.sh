# Check if the argument is provided
if [ $# -eq 0 ]; then
  echo "Error: Argument required."
  echo "Usage: sh $0 robot_ip"
  exit 1
fi

# Access the argument passed
ip=$1

is_ip() {
  # Check if the given string is an IP address
  if [[ $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    return 0
  else
    return 1
  fi
}

replace_ip() {
  # Replace the IP address of all files in the parent directory with the given IP address
  file_list=$(ls ./*)
  for file_path in $file_list; do
    file_data=$(cat "$file_path")
    file_data="${file_data//192.168.50.44/$1}"
    echo "$file_data" >"$file_path"
  done
}

if [[ $# -eq 0 ]]; then
  echo "Usage: ./deploy.sh <robot_ip>"
  exit 1
fi

ip=$1

if ! is_ip "$ip"; then
  echo "Invalid IP address"
  exit 1
fi

replace_ip "$ip"
cp -r ~/robobreizh_pepper_ws/src/tablet_pepper/src/dom-robocup-manager/* ~/.local/share/PackageManager/apps/tablet/html