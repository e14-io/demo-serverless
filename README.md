# Demo Serverless

## Get started

### Install dependencies

- Nodejs v6.5.0 or later
- Serverless CLI v1.9.0 or later (`npm i -g serverless`)
- Choose your computer provider (AWS on my case)
  Give serverless access to our cloud provider account so that it can create and manage resources on our behalf. For this we need to create a policy with the appropriate permissions and a user to assign those.

### Create Policy

- AWS Services -> IAM -> Policies -> Create Policy -> JSON -> Copy & Paste the following gist: https://gist.github.com/ServerlessBot/7618156b8671840a539f405dea2704c8 (apply changes needed)
- Add name and description.

### Create User

- AWS Services -> IAM -> Users -> Create User
- Add name and enable programmatic access
- Link permissions to the previously created policy
- Download the credentials csv
- Edit credentials file (`vim .aws/credentials`)

### Create config.yml

```yml
dev:
  PROFILE: user-name
  DYNAMODB_LOCAL_PORT: 9200
```

### Deploy

```bash
sls deploy
```

### Remove

```bash
sls remove
```

### Logs

```bash
  sls logs --function functionName
```

Note: when using `DeletionPolicy: Retain` on the db tables as on this case, after remove, we need to clean up tables also. Otherwise we would see an error when trying to deploy again.
