# Backend

## Backend services and APIs
This is a Javascript code built using Node.js, so make sure you have Node.js installed on your system.
This service is using MySQL as the database, so you also have to run MySQL on your system.

1. Clone the repository then open it using your code editor.
2. Supposedly you have done the steps from the __predict-api__ repository, you can continue these steps. If not, check the __predict-api__ repository and finish the steps there first (otherwise you can't complete these steps).
3. In the root directory of this project, make a new file named __.env__ to provide the configurations needed.
4. Provide these details in the __.env__ file:\
```
\# Fill "" with the url of the predict api ex: http://localhost:5000\
__API_PREDICT_HOST=""__\
\# Fill "" with your database username ex: root\
__DB_USERNAME=""__\
\# Fill "" with your database password\
__DB_PASSWORD=""__\
\# Fill "" with your database host name ex: localhost\
__DB_HOSTNAME=""__\
\# This is the database name, no need to change it\
__DB_NAME="db_salindungi"__\
\# No need to change this\
__ACCESS_TOKEN_SECRET="asdhj81dasdjh21fghagsfc93rfgbajfjkghw48iot"__\
\# No need to change this\
__REFRESH_TOKEN_SECRET="adh19hbhg81gh823reh1980grh19fgh1f1fhasfja"__\
\# Fill "" with the bucket name you created in the previous step\
__GCS_BUCKET=""__\
\# Fill "" with the project_id value from the __sa-lindungi-credentials.json__ file\
__GCLOUD_PROJECT=""__\
\# Fill "" with the client_email value from the __sa-lindungi-credentials.json__ file\
__GCLOUD_CLIENT_EMAIL=""__\
\# Fill "" with the private_key value from the __sa-lindungi-credentials.json__ file\
__GCLOUD_PRIVATE_KEY=""__\
```
4. Open terminal in the project root directory, then run `node ./bin/www` run the app.
5. The server will run in the localhost with the port 8080, open [http://localhost:8080](http://localhost:8080) to view it in your browser.
7. If it doesn't show any errors then you have successfully run the services.
8. The next step is to configure the frontend API, you can find it in the frontend repository.

