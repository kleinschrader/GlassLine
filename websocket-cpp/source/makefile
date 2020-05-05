SOURCES = $(shell find ./ -name '*.cpp' -or -name '*.hpp' | grep -e '\.\(hpp\)\|\(cpp\)' | tr '\n' ' ');
LIBARYS=pthread boost_system boost_thread boost_thread-mt

LLIBS=$(shell echo "$(LIBARYS)" | sed -e "s/\(\w\+\)/\-l\1/g")

release:
	g++ -lpthread -lboost_system -lboost_thread -std=c++14 -o glassline-websocket $(SOURCES)
debug:
	g++ $(LLIBS) -ggdb -o glassline-websocket $(SOURCES)