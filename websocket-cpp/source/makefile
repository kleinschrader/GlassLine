release: objects/main.o objects/WebSocketServer.o objects/sessionHandler.o objects/commandWrapper.o objects/getSetupRequired.o objects/checkSetupToken.o objects/checkTokenLogin.o objects/createTenant.o objects/createUser.o objects/finishSetup.o objects/checkCredLogin.o objects/generateMFASecret.o objects/verifyOTP.o objects/mysqlWrapper.o objects/getTenants.o objects/getTenantServer.o objects/getAllServers.o object/commandHandler.o objects/createServer.o
	g++ -lpthread -lcryptopp -lboost_thread -lboost_regex -lmariadb -loath -std=c++14 -o glassline-websocket objects/* -O2 
debug: objects-d/main.o objects-d/WebSocketServer.o objects-d/sessionHandler.o objects-d/commandWrapper.o objects-d/getSetupRequired.o objects-d/checkSetupToken.o objects-d/checkTokenLogin.o objects-d/createTenant.o objects-d/createUser.o objects-d/finishSetup.o objects-d/checkCredLogin.o objects-d/generateMFASecret.o objects-d/verifyOTP.o objects-d/mysqlWrapper.o objects-d/getTenants.o objects-d/getTenantServer.o objects-d/getTenantServer.o objects-d/getAllServers.o object-d/commandHandler.o objects-d/createServer.o
	g++ -ggdb -lpthread -lcryptopp -lboost_thread -lboost_regex -lmariadb -loath -std=c++14 -o glassline-websocket-d objects-d/* -DDEBUG

findFiles:
	find ./ -name '*.cpp'

objects/main.o: main.cpp
	g++ -c ./main.cpp -o objects/main.o -O2

objects/WebSocketServer.o: ./src/WebSocketServer/WebSocketServer.cpp
	g++ -c ./src/WebSocketServer/WebSocketServer.cpp -o objects/WebSocketServer.o -O2

objects/sessionHandler.o: ./src/sessionHandler/sessionHandler.cpp
	g++ -c ./src/sessionHandler/sessionHandler.cpp -o objects/sessionHandler.o -O2

object/commandHandler.o: ./src/commandHandler/commandHandler.cpp
	g++ -c ./src/commandHandler/commandHandler.cpp -o objects/commandHandler.o -O2

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

objects/generateMFASecret.o: ./src/commandWrapper/commands/generateMFASecret/generateMFASecret.cpp
	g++ -c ./src/commandWrapper/commands/generateMFASecret/generateMFASecret.cpp -o objects/generateMFASecret.o -O2

objects/verifyOTP.o: ./src/commandWrapper/commands/verifyOTP/verifyOTP.cpp
	g++ -c ./src/commandWrapper/commands/verifyOTP/verifyOTP.cpp -o objects/verifyOTP.o -O2

objects/mysqlWrapper.o: ./src/mysqlWrapper/mysqlWrapper.cpp
	g++ -c ./src/mysqlWrapper/mysqlWrapper.cpp -o objects/mysqlWrapper.o -O2

objects/getTenants.o: ./src/commandWrapper/commands/getTenants/getTenants.cpp
	g++ -c ./src/commandWrapper/commands/getTenants/getTenants.cpp -o objects/getTenants.o -O2

objects/getTenantServer.o: ./src/commandWrapper/commands/getTenantServer/getTenantServer.cpp
	g++ -c ./src/commandWrapper/commands/getTenantServer/getTenantServer.cpp -o objects/getTenantServer.o -O2

objects/getAllServers.o: ./src/commandWrapper/commands/getAllServers/getAllServers.cpp
	g++ -c ./src/commandWrapper/commands/getAllServers/getAllServers.cpp -o objects/getAllServers.o -O2

objects/createServer.o: ./src/commandWrapper/commands/createServer/createServer.cpp
	g++ -c ./src/commandWrapper/commands/createServer/createServer.cpp -o objects/createServer.o -O2

objects-d/main.o: main.cpp
	g++ -ggdb -c ./main.cpp -o objects-d/main-d.o -DDEBUG

objects-d/WebSocketServer.o: ./src/WebSocketServer/WebSocketServer.cpp
	g++ -ggdb -c ./src/WebSocketServer/WebSocketServer.cpp -o objects-d/WebSocketServer.o -DDEBUG

objects-d/sessionHandler.o: ./src/sessionHandler/sessionHandler.cpp objects-d/commandWrapper.o
	g++ -ggdb -c ./src/sessionHandler/sessionHandler.cpp -o objects-d/sessionHandler.o -DDEBUG

object-d/commandHandler.o: ./src/commandHandler/commandHandler.cpp
	g++ -ggdb -c ./src/commandHandler/commandHandler.cpp -o objects-d/commandHandler.o -DDEBUG

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

objects-d/verifyOTP.o: ./src/commandWrapper/commands/verifyOTP/verifyOTP.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/verifyOTP/verifyOTP.cpp -o objects-d/verifyOTP.o -DDEBUG

objects-d/mysqlWrapper.o: ./src/mysqlWrapper/mysqlWrapper.cpp
	g++ -ggdb -c ./src/mysqlWrapper/mysqlWrapper.cpp -o objects-d/mysqlWrapper.o -DDEBUG

objects-d/getTenants.o: ./src/commandWrapper/commands/getTenants/getTenants.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/getTenants/getTenants.cpp -o objects-d/getTenants.o -DDEBUG

objects-d/getTenantServer.o: ./src/commandWrapper/commands/getTenantServer/getTenantServer.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/getTenantServer/getTenantServer.cpp -o objects-d/getTenantServer.o -DDEBUG

objects-d/getAllServers.o: ./src/commandWrapper/commands/getAllServers/getAllServers.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/getAllServers/getAllServers.cpp -o objects-d/getAllServers.o -DDEBUG

objects-d/createServer.o: ./src/commandWrapper/commands/createServer/createServer.cpp
	g++ -ggdb -c ./src/commandWrapper/commands/createServer/createServer.cpp -o objects-d/createServer.o -DDEBUG

clean:
	rm objects-d/* || true
	rm objects/* || true
	rm glassline-websocket || true
	rm glassline-websocket-d || true