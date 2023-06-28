"""script to deploy the tablet application to the robot
USAGE: python deploy.py <robot_ip>
"""

import sys
import socket
import shutil
import glob

def is_ip(ip):
    """check if the given string is an ip address"""
    try:
        socket.inet_aton(ip)
        return True
    except socket.error:
        return False

def replace_ip(ip):
    """replace the id address of all files in the parent directory with the given ip address

    Args:
        ip (_type_): _description_
    """
    file_list = glob.glob('../**/*', recursive=True)
    for file_path in file_list:
        with open(file_path, 'r') as f:
            file_data = f.read()
        file_data = file_data.replace('192.168.50.44', ip)
    
        with open(file_path, 'w') as f:
            f.write(file_data)

def move_files():
    """move all the files in ../* to ~/.local/share/PackageManager/apps/tablet/html
    """

    source_directory = '../*'
    destination_directory = '~/.local/share/PackageManager/apps/tablet/html'

    # Get a list of all files in the source directory
    file_list = glob.glob(source_directory)

    # Move each file to the destination directory
    for file_path in file_list:
        shutil.move(file_path, destination_directory)

    
def main():
    try:
        ip = sys.argv[1]
    except IndexError:
        raise IndexError("USAGE: python deploy.py <robot_ip>")
    
    if not is_ip(ip):
        raise ValueError("invalid ip address")
    
    print("deploying to robot at {}".format(ip))
    replace_ip(ip)
    move_files()
    
if __name__ == "__main__":
    main()
    
