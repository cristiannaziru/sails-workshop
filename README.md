# Steps to setup the environment
1. Clone the Git repository
`git clone https://bitbucket-eng-sjc1.cisco.com/bitbucket/scm/cite/sails_workshop.git`

2. Go in newly cloned directory
`cd sails_workshop`

3. Docker build command, Change `latest` to desired tag
`docker build -t sails_workshop:latest .`

4. Run a container with the application and it's exposed ports

If you want to mount to local folder in the container use -v and <local_path>:/var/sails_workshop/ where local_path is the path you've cloned the repository. This commaing will give you the conainter id which
will be used on later commands.
`docker run -it -d -p 1337:1337 -p 8000:8000 -v <local_path>:/var/sails_workshop/ sails_workshop`

5. Open one execution connection to the newly created container
`docker exec -it <container_id_obtained_above> bash`

In this one we'll start the backend application doing the following:
`cd backend && sails lift`

6. Open another execution connection to the newly created container
`docker exec -it <container_id_obtained_above> bash`

Where we're starting the UI application while executing `cd frontend && gulp watch`

You're application should be now accessible at `http://localhost:8000` and if you've used the `-v`
while running the container it means that your local folder is now mounted in the container and all
your changes will be seen on the container also.
