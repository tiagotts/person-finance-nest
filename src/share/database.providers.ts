import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'person_finance_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
  schema: 'personfinance',
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return AppDataSource.initialize()
        .then(() => {
          console.log("Data Source has been initialized!")
          return AppDataSource;
        })
        .catch((err) => {
          console.error("Error during Data Source initialization", err)
        });
    },
  },
];