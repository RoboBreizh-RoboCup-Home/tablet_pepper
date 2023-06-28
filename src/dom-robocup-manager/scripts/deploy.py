"""script to deploy the tablet application to the robot
USAGE: python deploy.py <robot_ip>
"""

import sys
import socket
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
    file_list = glob.glob('./*')
    for file_path in file_list:
        with open(file_path, 'r') as f:
            file_data = f.read()
        file_data = file_data.replace('192.168.50.44', ip)
    
        with open(file_path, 'w') as f:
            f.write(file_data)

def main():
    try:
        ip = sys.argv[1]
    except IndexError:
        raise IndexError("USAGE: python deploy.py <robot_ip>")
    
    if not is_ip(ip):
        raise ValueError("invalid ip address")
    
    print("deploying to robot at {}".format(ip))
    replace_ip(ip)
    
if __name__ == "__main__":
    main()
    
