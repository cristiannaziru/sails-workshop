# Steps to setup the environment (Dockerized)
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

Start-up the mongoDB: `mongod --dbpath="{PATH_TO_YOUR_REPO}/sails_workshop/backend/data/db"`

In this one we'll start the backend application doing the following:
`cd backend && sails lift`

6. Open another execution connection to the newly created container
`docker exec -it <container_id_obtained_above> bash`

Where we're starting the UI application while executing `cd frontend && gulp watch`

You're application should be now accessible at `http://localhost:8000` and using Visual Studio, a plugin
is available [here](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) which allows you to develop and test the code remotely using the newly deployed
container. This can be done by attaching to the existing container and openning the folder `/var/sails_workshop`,
folder which contains the code of the application.


# Steps to setup the environment (Local Computer)

1. Clone the Git repository
`git clone https://bitbucket-eng-sjc1.cisco.com/bitbucket/scm/cite/sails_workshop.git`

2. Go in newly cloned directory
`cd sails_workshop`

3. Optional: If you don't have node version 8.15 you can install NVM in order to have multiple virtual environments: Here's a cool tutorial under 'Best way to install NVM' https://medium.com/@isaacjoe/best-way-to-install-and-use-nvm-on-mac-e3a3f6bc494d

Afterwards you must do an `nvm install 8.15.1` - `nvm use 8.15.1`

4. Install MongoDB locally; follow the official documentation: https://docs.mongodb.com/manual/installation/

5. Go to your backend folder
`cd backend`

6. Create a `data` folder in it and a `db` folder in that data folder.

7. Open your mongo instance: `sudo mongod --dbpath="/{PATH_TO_YOUR_REPO}/sails-workshop/sails_workshop/backend/data/db"`

8. Open a new terminal and go to the `backend` folder of your repo
`cd backend`

9. Run `npm install`

10. Run the backend server: `sails console`

11. Open a new terminal and go to the `frontend` folder of your repo
`cd frontend`

12. Run `npm install` and afterwards `bower install`

13. Run your frontend server: `gulp`