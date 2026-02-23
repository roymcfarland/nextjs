import { prisma } from "../db/prisma";
import { hashPassword } from "../auth/passwords";

async function main() {
  const staffPass = await hashPassword("ChangeMeNow_Staff_1234");
  const buyerPass = await hashPassword("ChangeMeNow_Buyer_1234");

  const account = await prisma.account.upsert({
    where: { name: "Demo Dispensary" },
    update: {},
    create: { name: "Demo Dispensary", status: "ACTIVE", paymentTerms: "Net 14" },
  });

  await prisma.user.upsert({
    where: { email: "staff@demo.com" },
    update: {},
    create: {
      email: "staff@demo.com",
      passwordHash: staffPass,
      role: "STAFF",
      active: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "buyer@demo.com" },
    update: { accountId: account.id },
    create: {
      email: "buyer@demo.com",
      passwordHash: buyerPass,
      role: "BUYER",
      accountId: account.id,
      active: true,
    },
  });

  const brand = await prisma.brand.upsert({
    where: { name: "Elevated" },
    update: {},
    create: { name: "Elevated" },
  });

  const products = await Promise.all(
    Array.from({ length: 6 }).map((_, i) =>
      prisma.product.upsert({
        where: { sku: `SKU-${i + 1}` },
        update: {},
        create: {
          sku: `SKU-${i + 1}`,
          name: `Product ${i + 1}`,
          brandId: brand.id,
          category: "Edibles",
          description: "Demo product description.",
          casePackSize: 12,
          active: true,
        },
      })
    )
  );

  for (let i = 0; i < products.length; i++) {
    await prisma.priceOverride.upsert({
      where: { accountId_productId: { accountId: account.id, productId: products[i].id } },
      update: { casePriceCents: 25000 + i * 1000 },
      create: { accountId: account.id, productId: products[i].id, casePriceCents: 25000 + i * 1000 },
    });
  }

  console.log("Seed complete:", {
    staff: "staff@demo.com / ChangeMeNow_Staff_1234",
    buyer: "buyer@demo.com / ChangeMeNow_Buyer_1234",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });