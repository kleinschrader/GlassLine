### BEGIN websocketpp ###

# create a temprary directory for websocketpp
mkdir /tmp/websocketpp

# get the newest version of websocket++
git clone https://github.com/zaphoyd/websocketpp /tmp/websocketpp

# create a build directory for websocket++
mkdir /tmp/websocketpp/build
cd /tmp/websocketpp/build

# adjust the repo for the container
cmake ..

# install the libary
make install

# delete the build directory
rm -rf /tmp/websocketpp

### END websocketpp ###


# go into the build directory of websocket-cpp
cd /tmp/glassline-websocket

# compile it
make

#create the final directory
mkdir /usr/app

#move the compiled programm into the final directory
cp glassline-websocket /usr/app/glassline-websocket

# cleaning up the packages used to build the program
pacman -R gcc make git cmake --noconfirm