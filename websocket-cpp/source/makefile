release: objects/main.o objects/WebSocketServer.o objects/sessionHandler.o objects/commandWrapper.o objects/getSetupRequired.o objects/checkSetupToken.o objects/checkTokenLogin.o objects/createTenant.o objects/createUser.o objects/finishSetup.o objects/checkCredLogin.o objects/generateMFASecret.o
	g++ -lpthread -lcryptopp -lboost_thread -lmariadb -std=c++14 -o glassline-websocket objects/* ./src/commandHandler/commandHandler.h -O2
debug: objects-d/main.o objects-d/WebSocketServer.o objects-d/sessionHandler.o objects-d/commandWrapper.o objects-d/getSetupRequired.o objects-d/checkSetupToken.o objects-d/checkTokenLogin.o objects-d/createTenant.o objects-d/createUser.o objects-d/finishSetup.o objects-d/checkCredLogin.o objects-d/generateMFASecret.o
	g++ -ggdb -lpthread -lcryptopp -lboost_thread -lmariadb -std=c++14 -o glassline-websocket-d objects-d/* ./src/commandHandler/commandHandler.h -DDEBUG

findFiles:
	find ./ -name '*.cpp'

objects/main.o: main.cpp
	g++ -c ./main.cpp -o objects/main.o -O2

objects/WebSocketServer.o: ./src/WebSocketServer/WebSocketServer.cpp
	g++ -c ./src/WebSocketServer/WebSocketServer.cpp -o objects/WebSocketServer.o -O2

objects/sessionHandler.o: ./src/sessionHandler/sessionHandler.cpp objects/sessionHandler.o
	g++ -c ./src/sessionHandler/sessionHandler.cpp -o objects/sessionHandler.o -O2

objects/commandWrapper.o: ./src/commandWrapper/commandWrapper.cpp
	g++ -c ./src/commandWrapper/commandWrapper.cpp -o objects/commandWrapper.o -O2

objects/getSetupRequired.o: ./src/commandWrapper/commands/getSetupRequired/getSetupRequired.cpp
	g++ -c ./src/commandWrapper/commands/getSetupRequired/getSetupRequired.cpp -o objects/getSetupRequired.o -O2

objects/checkSetupToken.o: ./src/commandWrapper/commands/checkSetupToken/checkSetupToken.cpp
	g++ -c ./src/commandWrapper/commands/checkSetupToken/checkSetupToken.cpp -o objects/checkSetupToken.o -O2

objects/checkTokenLogin.o: ./src/commandWrapper/commands/checkTokenLogin/checkTokenLogin.cpp
	g++ -c ./src/commandWrapper/commands/checkTokenLogin/checkTokenLogin.cpp -o objects/checkTokenLogin.o -O2

objects/createTenant.o: ./src/commandWrapper/commands/createTenant/createTenant.cpp
	g++ -c ./src/commandWrapper/commands/createTenant/createTenant.cpp -o objects/createTenant.o -O2

objects/createUser.o: ./src/commandWrapper/commands/createUser/createUser.cpp
	g++ -c ./src/commandWrapper/commands/createUser/createUser.cpp -o objects/createUser.o -O2

objects/finishSetup.o: ./src/commandWrapper/commands/finishSetup/finishSetup.cpp
	g++ -c ./src/commandWrapper/commands/finishSetup/finishSetup.cpp -o objects/finishSetup.o -O2

objects/checkCredLogin.o: ./src/commandWrapper/commands/checkCredLogin/checkCredLogin.cpp
	g++ -c ./src/commandWrapper/commands/checkCredLogin/checkCredLogin.cpp -o objects/checkCredLogin.o -O2

objects/generateMFASecret.o: ./src/commandWrapper/commands/checkCredLogin/generateMFASecret.cpp
	g++ -c ./src/commandWrapper/commands/checkCredLogin/generateMFASecret.cpp -o objects/generateMFASecret.o -O2

objects-d/main.o: main.cpp
	g++ -ggdb -c ./main.cpp -o objects-d/main-d.o -DDEBUG

objects-d/WebSocketServer.o: ./src/WebSocketServer/WebSocketServer.cpp
	g++ -ggdb -c ./src/WebSocketServer/WebSocketServer.cpp -o objects-d/WebSocketServer.o -DDEBUG

objects-d/sessionHandler.o: ./src/sessionHandler/sessionHandler.cpp objects-d/commandWrapper.o
	g++ -ggdb -c ./src/sessionHandler/sessionHandler.cpp -o objects-d/sessionHandler.o -DDEBUG

objects-d/commandWrapper.o: ./src/commandWrapper/commandWrapper.cpp  
	g++ -ggdb -c ./src/commandWrapper/commandWrapper.cpp -o objects-d/commandWrapper.o -DDEBUG

objects-d/getSetupRequired.o: ./src/commandWrapper/commands/getSetupRequired/getSetupRequired.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/getSetupRequired/getSetupRequired.cpp -o objects-d/getSetupRequired.o -DDEBUG

objects-d/checkSetupToken.o: ./src/commandWrapper/commands/checkSetupToken/checkSetupToken.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/checkSetupToken/checkSetupToken.cpp -o objects-d/checkSetupToken.o -DDEBUG
	
objects-d/checkTokenLogin.o: ./src/commandWrapper/commands/checkTokenLogin/checkTokenLogin.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/checkTokenLogin/checkTokenLogin.cpp -o objects-d/checkTokenLogin.o -DDEBUG

objects-d/createTenant.o: ./src/commandWrapper/commands/createTenant/createTenant.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/createTenant/createTenant.cpp -o objects-d/createTenant.o -DDEBUG

objects-d/createUser.o: ./src/commandWrapper/commands/createUser/createUser.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/createUser/createUser.cpp -o objects-d/createUser.o -DDEBUG

objects-d/finishSetup.o: ./src/commandWrapper/commands/finishSetup/finishSetup.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/finishSetup/finishSetup.cpp -o objects-d/finishSetup.o -DDEBUG

objects-d/checkCredLogin.o: ./src/commandWrapper/commands/checkCredLogin/checkCredLogin.cpp
	g++ -ggdb -c  ./src/commandWrapper/commands/checkCredLogin/checkCredLogin.cpp -o objects-d/checkCredLogin.o -DDEBUG

objects-d/generateMFASecret.o: ./src/commandWrapper/commands/generateMFASecret/generateMFASecret.cpp
	g++ -ggdb -c  ./src/commandWrapper/commands/generateMFASecret/generateMFASecret.cpp -o objects-d/generateMFASecret.o -DDEBUG


clean:
	rm objects-d/* || true
	rm objects/* || true
	rm glassline-websocket || true
	rm glassline-websocket-d || true