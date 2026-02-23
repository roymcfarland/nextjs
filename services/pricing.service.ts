import { prisma } from "../db/prisma";

export async function listMenuForAccount(accountId: string) {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: { select: { id: true, name: true } },
      priceOverrides: {
        where: { accountId },
        select: { casePriceCents: true },
      },
    },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
  });

  return products.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    brandName: p.brand.name,
    category: p.category,
    description: p.description,
    casePackSize: p.casePackSize,
    casePriceCents: p.priceOverrides[0]?.casePriceCents ?? null,
  }));
}