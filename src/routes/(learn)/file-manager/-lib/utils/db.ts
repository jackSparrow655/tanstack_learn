import { createRxDatabase, addRxPlugin } from 'rxdb'

import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'

addRxPlugin(RxDBDevModePlugin)

const storage = wrappedValidateAjvStorage({
  storage: getRxStorageDexie(),
})

let dbPromise: any

export const createDB = async () => {
  if (dbPromise) return dbPromise

  dbPromise = createRxDatabase({
    name: 'filedb',
    storage,
    ignoreDuplicate: true,
    multiInstance: false,
  })

  const db = await dbPromise

  if (!db.collections.paths) {
    await db.addCollections({
      paths: {
        schema: {
          title: 'paths schema',
          version: 0,
          primaryKey: 'id',
          type: 'object',

          properties: {
            id: {
              type: 'string',
              maxLength: 300,
            },

            path: {
              type: 'string',
              maxLength: 1000,
            },
          },

          required: ['id', 'path'],
        },
      },
    })
  }

  return db
}
