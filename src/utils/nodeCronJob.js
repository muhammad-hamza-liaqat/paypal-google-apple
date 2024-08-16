const { MongoClient } = require('mongodb')
const cron = require('node-cron')

let encryptedClient
if (!encryptedClient) {
    encryptedClient = new MongoClient(`${process.env.MONGODB_URL}`)
}

async function deleteOldRecords() {
    console.warn("inside cron job functionality!")
    try {
        await encryptedClient.connect()
        const DB = encryptedClient.db(process.env.DB_NAME)
        const weeklyStatsCollection = DB.collection('weeklyTrans')

        const today = new Date()
        const endOfDay = new Date(
            Date.UTC(
                today.getUTCFullYear(),
                today.getUTCMonth(),
                today.getUTCDate(),
                23,
                59,
                59,
                999
            )
        )
        const startOfWeek = new Date(
            Date.UTC(
                today.getUTCFullYear(),
                today.getUTCMonth(),
                today.getUTCDate() - 6,
                0,
                0,
                0,
                0
            )
        )

        console.warn({ FROM: startOfWeek, TO: endOfDay })

        const result = await weeklyStatsCollection.deleteMany({
            $or: [{ createdAt: { $lt: startOfWeek } }, { createdAt: { $gt: endOfDay } }]
        })

        console.log(`Deleted ${result.deletedCount} records.`)
    } catch (error) {
        console.error('Error deleting old records:', error)
    } finally {
        await encryptedClient.close()
    }
}

cron.schedule('* * * * *', () => {
    console.log('Running cron job...')
    deleteOldRecords().catch(err => console.error('Error in cron job:', err))
})

module.exports = deleteOldRecords
