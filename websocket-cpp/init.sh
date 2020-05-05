#download newest db
pacman -Sy --noconfirm

# install all the packages needed to build the program
pacman -S gcc make git cmake --noconfirm

# install the mariadb connecter
pacman -S mariadb-libs --noconfirm
 
# install the boost and other libarys
pacman -S boost boost-libs libffi --noconfirm

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