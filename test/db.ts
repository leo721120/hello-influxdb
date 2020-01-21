import * as influx from 'influx'

interface Data {
    time: Date
    f1: number
    f2: string
    f3: number
}
describe('mqtt', function () {
    let db: influx.InfluxDB;

    beforeAll(async function () {
        db = new influx.InfluxDB({
            database: 'mydb',
            schema: [
                {
                    measurement: 'privatekey',
                    fields: {
                        f1: influx.FieldType.FLOAT,
                        f2: influx.FieldType.STRING,
                        f3: influx.FieldType.INTEGER,
                    },
                    tags: [
                    ],
                },
            ],
        });
    });
    afterAll(async function () {
    });
    it('put/get', async function () {
        await db.dropDatabase('mydb');
        await db.createDatabase('mydb');
        await db.writePoints([
            {
                measurement: 'privatekey',
                fields: {
                    f1: 0.1,
                    f2: 'str',
                    f3: 99,
                },
            },
        ]);
        const data = await db.query<Data>('select * from privatekey');
        expect(data).toHaveLength(1);
        expect(data[0]).toHaveProperty('f1', 0.1);
        expect(data[0]).toHaveProperty('f2', 'str');
        expect(data[0]).toHaveProperty('f3', 99);
        expect(data[0]).toHaveProperty('time');
    });
});