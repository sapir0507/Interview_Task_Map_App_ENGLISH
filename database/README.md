# Database: MongoDB in the cloud (Atlas)

The API stores polygons and objects in MongoDB. This folder is everything you need to set up the same database
yourself, for free, without Docker and without installing MongoDB: a hosted MongoDB cluster on
[MongoDB Atlas](https://www.mongodb.com/atlas).

| File | What it is |
| --- | --- |
| `README.md` | This guide. |
| [schema.md](schema.md) | What is stored: the two collections and the shape of each document. |
| [init-indexes.js](init-indexes.js) | Optional `mongosh` script that creates the geo indexes by hand. |
| [seed/polygons.json](seed/polygons.json), [seed/objects.json](seed/objects.json) | Sample documents you can import to see data straight away. |
| [appsettings.example.json](appsettings.example.json) | The settings the API reads, with placeholders. |

Nothing in this folder is a secret. **Your connection string and password never go into the repository.**

## 1. Why a hosted database

Atlas runs MongoDB for you. The free tier (called **M0**) is enough for this app, never expires, and works from any PC
with internet access. The API connects to it with one connection string.

## 2. Create an account, a project and a free cluster

1. Sign up at <https://www.mongodb.com/cloud/atlas/register> and sign in.
2. Create a **project** (any name, for example `task-map`).
3. Click **Create** (or **Build a Database**), choose the **Free / M0** tier, pick a provider and a region close to
   you, and name the cluster (any name). Create it. It takes a minute or two.

Only one free cluster is allowed per project.

## 3. Create a database user

The API signs in with a **database user**, which is not your Atlas login.

1. In the project, open **Security → Database Access** and add a database user.
2. Choose password authentication, pick a username, and use **Autogenerate Secure Password**. **Copy the password
   now**, you cannot read it again later.
3. Give the user the built-in role **Read and write to any database** (or "readWrite" on the `taskmap` database).

## 4. Allow your computer to connect (network access)

Atlas only accepts connections from IP addresses on an allow-list.

1. Open **Security → Network Access** and choose **Add IP Address**.
2. Choose **Add Current IP Address** and confirm.
3. Your IP changes when you change network (home, office, a hotspot), so add it again when the connection stops
   working. `0.0.0.0/0` ("allow from anywhere") works everywhere, but it lets anyone on the internet try to sign in. Use
   it only for a short throwaway test, never with a real password you reuse elsewhere.

## 5. Get the connection string

1. Open your cluster and click **Connect**, then **Drivers**.
2. Choose **C# / .NET** and copy the connection string. It looks like this:

   ```
   mongodb+srv://<username>:<password>@<cluster-name>.<id>.mongodb.net/?retryWrites=true&w=majority
   ```

3. Replace `<username>` and `<password>` with the database user from step 3. If the password has special characters
   (`@ : / ? # %`), encode them: `@` becomes `%40`, `:` becomes `%3A`, `/` becomes `%2F`.

## 6. Give the string to the API (never commit it)

Run this once from `server/src/TaskMap.Api`. It stores the string on your computer, outside the repository
(.NET user-secrets):

```
dotnet user-secrets set "Database:MongoDb:ConnectionString" "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
```

Or set an environment variable instead (use this on a server): `Database__MongoDb__ConnectionString`.

The database name defaults to `taskmap`. To change it: `dotnet user-secrets set "Database:MongoDb:DatabaseName" "my-db"`.
[appsettings.example.json](appsettings.example.json) shows every setting. The real `appsettings.json` keeps the connection
string **empty**, on purpose.

## 7. Start the API and check it works

```
cd server/src/TaskMap.Api
dotnet run
```

- On start the API creates the geo indexes and logs `MongoDB 2dsphere indexes are in place.`
- If the connection string is missing, the API refuses to start and says so. That is expected.

Check it end to end:

1. Open the app (or Swagger at `http://localhost:5080/swagger`) and save a polygon and an object.
2. Stop the API and start it again. The data is still there. That is the database working.
3. In Atlas, open your cluster, click **Browse Collections** and look at the `taskmap` database: you will see the
   `polygons` and `objects` collections with your documents.

## 8. How the app uses the database

- **Two collections**: `polygons` and `objects`. Document shapes are in [schema.md](schema.md).
- **GeoJSON, WGS84, `[longitude, latitude]`**: the `geometry` field is real GeoJSON, never map meters.
- **A `2dsphere` index on `geometry`** in both collections, created by the API at start (or by
  [init-indexes.js](init-indexes.js)).
- **Transactions**: saving several objects at once is all-or-nothing. MongoDB transactions need a replica set, which every
  Atlas cluster is. A plain single local `mongod` without a replica set cannot do this.
- **No stored procedures**: MongoDB has none. The rules live in the API.

## 9. Optional: sample data

To see data without drawing anything, import the seed files. In Atlas, **Browse Collections → `taskmap` →
`polygons` → Add Data → Import JSON or CSV file**, choose [seed/polygons.json](seed/polygons.json), and do the same for
`objects` with [seed/objects.json](seed/objects.json). With the command line instead:

```
mongoimport --uri "<connection string>" --db taskmap --collection polygons --jsonArray --file database/seed/polygons.json
mongoimport --uri "<connection string>" --db taskmap --collection objects  --jsonArray --file database/seed/objects.json
```

The seed documents use ids that start with `seed-`, so they are easy to find and delete.

## 10. Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| The API will not start and mentions the connection string | The string is not set. Repeat step 6. |
| Every request answers `500` after about 5 seconds | The API cannot reach the cluster: your IP is not on the allow-list (step 4), the password is wrong or not URL-encoded (step 5), or you are offline. |
| `Authentication failed` in the log | Wrong username or password. Edit the database user in **Database Access** and set the string again. |
| The log says it could not create the indexes | Same causes as above. The API still starts, and creates them on the next start that can connect. |
| Saving objects answers `500` and the log mentions a transaction | Your cluster tier or settings do not allow multi-document transactions. Use a standard Atlas cluster, or check the cluster's MongoDB version. |
| An import fails on a geometry | The index rejects invalid GeoJSON: the polygon ring must be closed, in `[lng, lat]`, with lng from -180 to 180 and lat from -90 to 90. |

## 11. Clean up

- Delete the data: in **Browse Collections**, drop the `taskmap` database, or remove the `seed-` documents.
- Delete the cluster: **Database → your cluster → ... → Terminate**.
- Delete the user and the IP entry in **Database Access** and **Network Access**.
- Remove the secret from your computer: `dotnet user-secrets remove "Database:MongoDb:ConnectionString"`.
