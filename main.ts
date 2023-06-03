import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { eq } from 'npm:drizzle-orm';
import { drizzle } from 'npm:drizzle-orm/libsql';
import { createClient } from 'npm:@libsql/client';
import zipCodes from './schema/zipCodeSchema.ts';

const DATABASE_AUTH_TOKEN = Deno.env.get('DATABASE_AUTH_TOKEN');
const DATABASE_URL = Deno.env.get('DATABASE_URL') as string;

const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

const router = new Router();
router
  .get('/api/:zipCode', async (context) => {
    if (context?.params?.zipCode) {
      const zipCode = context.params.zipCode as string;
      const found = await db.select().from(zipCodes).where(
        eq(zipCodes.zipCode, zipCode),
      ).run();
      if (found) {
        const [first] = found.rows;
        console.log(first);
        context.response.body = {
          ...first,
          geoShape: JSON.parse(first.geoShape as string),
        };
        context.response.type = 'json';
      } else {
        context.response.body = 'No zips found.';
      }
    }
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
