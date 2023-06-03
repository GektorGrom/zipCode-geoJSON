import { sqliteTable, text } from 'npm:drizzle-orm/sqlite-core';
import { InferModel } from 'npm:drizzle-orm';

const zipCodes = sqliteTable('zipCodes', {
  zipCode: text('zipCode').primaryKey(),
  geoPoint: text('geoPoint'),
  geoShape: text('geoShape'),
  countyCode: text('countyCode'),
  countyName: text('countyName'),
});

export type ZipCode = InferModel<typeof zipCodes, 'insert'>;

export default zipCodes;
