# Steps to setup the environment
1. Clone the Git repository
`git clone https://bitbucket-eng-sjc1.cisco.com/bitbucket/scm/cite/sails_workshop.git`

2. Go in newly cloned directory
`cd sails_workshop`

3. Docker build command, Change `latest` to desired tag
`docker build -t sails_workshop:latest .`

4. Run a container with the application and it's exposed ports
`docker run -it -d -p 1337:1337 -p 8000:8000 sails_workshop`
The above command gives you the container id which will be used on later commands.

5. Open one execution connection to the newly created container
`docker exec -it <container_id_obtained_above> bash`

In this one we'll start the backend application doing the following:
`cd backend && sails lift`

6. Open another execution connection to the newly created container
`docker exec -it <container_id_obtained_above> bash`

Where we're starting the UI application while executing `cd frontend && gulp watch`

You're application should be now accessible at `http://localhost:8000` and using Visual Studio, a plugin
is available [here](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) which allows you to develop and test the code remotely using the newly deployed
container. This can be done by attaching to the existing container and openning the folder `/var/sails_workshop`,
folder which contains the code of the application.
