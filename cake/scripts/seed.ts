import { getDb } from "@/lib/db";
import {
  CREAM_OPTIONS,
  DECOR_OPTIONS,
  FILLING_OPTIONS,
  PORTFOLIO_ITEMS,
  READY_CAKES,
} from "@/lib/data/catalog";

function seed() {
  const db = getDb();

  db.exec("DELETE FROM portfolio; DELETE FROM ready_cakes;");

  const insertPortfolio = db.prepare(`
    INSERT INTO portfolio (
      title, image_url, cake_type, occasion, weight_kg,
      filling, cream, approximate_price, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of PORTFOLIO_ITEMS) {
    insertPortfolio.run(
      item.title,
      item.imageUrl,
      item.cakeType,
      item.occasion,
      item.weightKg,
      item.filling,
      item.cream,
      item.approximatePrice,
      item.description,
    );
  }

  const insertReady = db.prepare(`
    INSERT INTO ready_cakes (title, image_url, description, price)
    VALUES (?, ?, ?, ?)
  `);

  for (const cake of READY_CAKES) {
    insertReady.run(cake.title, cake.imageUrl, cake.description, cake.price);
  }

  console.log(
    `Seeded ${PORTFOLIO_ITEMS.length} portfolio items and ${READY_CAKES.length} ready cakes.`,
  );
  console.log(
    `Options: ${FILLING_OPTIONS.length} fillings, ${CREAM_OPTIONS.length} creams, ${DECOR_OPTIONS.length} decors.`,
  );
}

seed();
