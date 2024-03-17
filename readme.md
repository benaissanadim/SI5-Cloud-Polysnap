# PolySnap

PolySnap is a social media platform for sharing stories and sending ephemeral messages with attachments.
It is a project for the course "Cloud Computing" at Polytech Nice Sophia.

# Cloud Environment Setup Guide
## Prerequisites

1. **Create a Google Cloud Platform (GCP) account** :  If you don't have an account yet, sign up for [Google Cloud Platform](https://cloud.google.com/?hl=fr).
2. **Create a Clever Cloud account** : If you don't have an account yet, sign up for [Clever Cloud](https://www.clever-cloud.com).  
3. **Install Google Cloud Command Line Tool (gcloud)**: Follow the installation instructions for your operating system [here](https://cloud.google.com/sdk/docs/install?hl=fr).
4. **Authentication**: Log in to your Google Cloud account via the command line using the `gcloud auth login` command.

## Create a Google Cloud Project
1. **Create a new project**: Create a new project by running the following command in the command line :
   ```bash
   gcloud projects create [PROJECT_ID] --name=[PROJECT_NAME]
   ```
   
    Replace `[PROJECT_ID]` with your project ID and `[PROJECT_NAME]` with your project name.
   
2. **Set the project ID**: Set the project ID by running the following command in the command line:
   ```bash
   gcloud config set project [PROJECT_ID]
   ```
   

## Create Google Cloud instances

### App Engine
Create an App Engine instance by specifying the region:

```bash
gcloud app create --region=[REGION]
```
Replace `[REGION]` with your region.

### Cloud SQL

Create a Cloud SQL instance with a specific zone:

```bash
gcloud sql instances create [INSTANCE_NAME] \
    --database-version=POSTGRES_13 \
    --cpu=[CPU] \
    --memory=[MEMORY] \
    --region=[REGION] \
    --zone=[ZONE] \
    --root-password=[PASSWORD]
```
Replace `[INSTANCE_NAME]` with your instance name, `[CPU]` with the number of CPUs, `[MEMORY]` with the memory size, `[REGION]` with the region and `[ZONE]` with the zone. `[PASSWORD]` is the password for the root user.
 
Create the needed databases:

```bash
gcloud sql databases create userDB --instance=[INSTANCE_NAME]
```
```bash
gcloud sql databases create storyDB --instance=[INSTANCE_NAME]
```
```bash
gcloud sql databases create messageDB --instance=[INSTANCE_NAME]
```

### Cloud Storage

Create a Cloud Strage bucket with a specific region:

```bash
gsutil mb -l [REGION] gs://[BUCKET_NAME]
```

Replace `[REGION]` with your region and `[BUCKET_NAME]` with your bucket name.

### Pub/Sub

Create a Pub/Sub topic with a specific region:

```bash
  gcloud pubsub topics create [TOPIC_NAME] --message-storage-policy-allowed-regions=[REGION]
```

Replace `[TOPIC_NAME]` with your topic name and `[REGION]` with your region.

### API Gateway
Replace the links in the file `gateway/openapi2-appengine.yaml` with your application's links.

Create an API Gateway instance with a specific region:

```bash
gcloud endpoints services deploy gateway/openapi2-appengine.yaml --project=[PROJECT_ID]
```

Replace `[PROJECT_ID]` with your project ID.

## Clever Cloud Redis

Proceed to the following link: [Create Addon](https://console.clever-cloud.com/users/me/addons/new) . Once there, select the Redis database service, specify the desired database size, and choose your preferred region. Finally, confirm your selection to complete the process.

## Set Configuration Variables

Copy the `credentials.yaml` file from the root of the project to the repositories `users-service`, `stories-service`, `media-service`, `messaging-service`, `messaging-reader-service` and `messaging-store-service`.
Replace the values with your own.

In the `.env` file of the `frontend` repository, replace `REACT_APP_POLYSNAP_API_URL` with the URL of your API Gateway instance and `REACT_APP_BUCKET_URL` with the URL of your Cloud Storage bucket.

## Deploy backend services

Run the following command in the root of the project to deploy all services:

```bash
./deploy-backend.sh
```

## Deploy the static frontend website

Build the frontend with the command `npm run build` in the `frontend` repository.

Create a new bucket in your Cloud Storage instance and upload the `build` folder to the bucket.
upload the 'app.yaml' file to the bucket.

Go to [Google Cloud Console](https://console.cloud.google.com) and select your project. 
Open the active cloud shell and run the following command to deploy the website:

```bash
  mkdir front-end
  gsutil rsync -r gs://[BUCKET-NAME] ./front-end
  cd front-end
  gcloud app deploy
```
