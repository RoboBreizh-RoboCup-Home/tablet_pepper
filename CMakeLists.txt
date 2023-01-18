cmake_minimum_required(VERSION 2.8.3)
project(tablet_pepper)

find_package(catkin REQUIRED COMPONENTS
	message_generation
)

catkin_python_setup()

add_message_files(
  DIRECTORY msg
  FILES
)
generate_messages(
  DEPENDENCIES
)

catkin_package(
  CATKIN_DEPENDS
    message_runtime
)