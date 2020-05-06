release: objects/main.o objects/WebSocketServer.o objects/sessionHandler.o objects/commandWrapper.o objects/getSetupRequired.o objects/checkSetupToken.o
	g++ -lpthread -lboost_thread -lmariadb -std=c++14 -o glassline-websocket objects/* ./src/commandHandler/commandHandler.hpp
debug: objects-d/main.o objects-d/WebSocketServer.o objects-d/sessionHandler.o objects-d/commandWrapper.o objects-d/getSetupRequired.o objects-d/checkSetupToken.o
	g++ -ggdb -lpthread -lboost_thread -lmariadb -std=c++14 -o glassline-websocket-d objects-d/* ./src/commandHandler/commandHandler.hpp -DDEBUG

findFiles:
	find ./ -name '*.cpp'

objects/main.o: main.cpp
	g++ -c ./main.cpp -o objects/main.o

objects/WebSocketServer.o: ./src/WebSocketServer/WebSocketServer.cpp
	g++ -c ./src/WebSocketServer/WebSocketServer.cpp -o objects/WebSocketServer.o

objects/sessionHandler.o: ./src/sessionHandler/sessionHandler.cpp
	g++ -c ./src/sessionHandler/sessionHandler.cpp -o objects/sessionHandler.o

objects/commandWrapper.o: ./src/commandWrapper/commandWrapper.cpp
	g++ -c ./src/commandWrapper/commandWrapper.cpp -o objects/commandWrapper.o

objects/getSetupRequired.o: ./src/commandWrapper/commands/getSetupRequired/getSetupRequired.cpp
	g++ -c ./src/commandWrapper/commands/getSetupRequired/getSetupRequired.cpp -o objects/getSetupRequired.o

objects/checkSetupToken.o: ./src/commandWrapper/commands/checkSetupToken/checkSetupToken.cpp
	g++ -c ./src/commandWrapper/commands/checkSetupToken/checkSetupToken.cpp -o objects/checkSetupToken.o

objects-d/main.o: main.cpp
	g++ -ggdb -c ./main.cpp -o objects-d/main-d.o -DDEBUG

objects-d/WebSocketServer.o: ./src/WebSocketServer/WebSocketServer.cpp
	g++ -ggdb -c ./src/WebSocketServer/WebSocketServer.cpp -o objects-d/WebSocketServer.o -DDEBUG

objects-d/sessionHandler.o: ./src/sessionHandler/sessionHandler.cpp
	g++ -ggdb -c ./src/sessionHandler/sessionHandler.cpp -o objects-d/sessionHandler.o -DDEBUG

objects-d/commandWrapper.o: ./src/commandWrapper/commandWrapper.cpp
	g++ -ggdb -c ./src/commandWrapper/commandWrapper.cpp -o objects-d/commandWrapper.o -DDEBUG

objects-d/getSetupRequired.o: ./src/commandWrapper/commands/getSetupRequired/getSetupRequired.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/getSetupRequired/getSetupRequired.cpp -o objects-d/getSetupRequired.o -DDEBUG

objects-d/checkSetupToken.o: ./src/commandWrapper/commands/checkSetupToken/checkSetupToken.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/checkSetupToken/checkSetupToken.cpp -o objects-d/checkSetupToken.o -DDEBUG
	

clean:
	rm objects-d/*
	rm objects/*