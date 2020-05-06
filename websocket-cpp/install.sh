#download newest db
pacman -Sy --noconfirm

# install all the packages needed to build the program
pacman -S gcc make git cmake --noconfirm

# install the mariadb connecter
pacman -S mariadb-libs --noconfirm
 
# install the boost and other libarys
pacman -S boost boost-libs libffi --noconfirm
