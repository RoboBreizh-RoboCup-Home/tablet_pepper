cmake_minimum_required(VERSION 2.8.3)
project(tablet_pepper)

find_package(catkin REQUIRED COMPONENTS
	message_generation
)

catkin_python_setup()

generate_messages(
  DEPENDENCIES
)

catkin_package(
  CATKIN_DEPENDS
)
