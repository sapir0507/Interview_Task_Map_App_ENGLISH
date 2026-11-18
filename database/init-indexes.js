// Creates the geo indexes by hand. Optional: the API does the same every time it starts.
// Running it twice is harmless, because creating an index that already exists does nothing.
//
// Run it with mongosh (https://www.mongodb.com/docs/mongodb-shell/), using your connection string:
//   mongosh "<connection string>" --file database/init-indexes.js

const taskMap = db.getSiblingDB('taskmap')

// 2dsphere indexes need GeoJSON with positions written [longitude, latitude].
taskMap.polygons.createIndex({ geometry: '2dsphere' })
taskMap.objects.createIndex({ geometry: '2dsphere' })

print('polygons indexes:', JSON.stringify(taskMap.polygons.getIndexes().map((index) => index.name)))
print('objects indexes: ', JSON.stringify(taskMap.objects.getIndexes().map((index) => index.name)))
