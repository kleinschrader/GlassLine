SOURCES = $(shell find ./ -name '*.cpp' -print0 | sed "s/\x0/\ /g");
LIBARYS=pthread

LLIBS=$(shell echo "$(LIBARYS)" | sed -e "s/\(\w\+\)/\-l\1/g")

release:
	g++ $(LLIBS) -o glassline-websocket $(SOURCES)
debug:
	g++ $(LLIBS) -ggdb -o glassline-websocket $(SOURCES)