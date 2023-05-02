import os
import sys

def extract_exec(file_name):
    exec_list = []
    try :
        f = open(file_name, 'r', encoding="utf-8")
    except FileNotFoundError:
        return
    output = f.read()
    output = output.split("\n")
    for line in output:
        if ".exec" in line:
            line = line.replace("<value>", '"')
            line = line.replace("</value>", '"')
            exec_list.append(line)

    
    w_f = open(f"{file_name}_exec.txt", 'w', encoding="utf-8")
    for line in exec_list:
        w_f.write(line + "\n")
    
    f.close()
    w_f.close()
    
reference_files = os.listdir(sys.argv[1])
    
for file_names in reference_files:
    extract_exec(file_names)