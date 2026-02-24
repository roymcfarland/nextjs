import { requireBuyer } from "../../../auth/rbac";
import { listMenuForAccount } from "../../../services/pricing.service";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function MenuPage() {
  const buyer = await requireBuyer();
  const menu = await listMenuForAccount(buyer.accountId!);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Wholesale Menu</h1>
        <form action="/api/logout" method="post">
          <button className="text-sm underline">Logout</button>
        </form>
      </header>

      <div className="mt-6 grid gap-3">
        {menu.map((p) => (
          <div key={p.id} className="rounded border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-gray-600">{p.brandName}</div>
                <div className="text-lg font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">SKU: {p.sku}</div>
                <div className="text-sm text-gray-600">Case pack: {p.casePackSize}</div>
                {p.category && <div className="text-sm text-gray-600">Category: {p.category}</div>}
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">Case price</div>
                <div className="text-lg font-semibold">
                  {p.casePriceCents == null ? "—" : formatMoney(p.casePriceCents)}
                </div>
              </div>
            </div>

            {p.description && <p className="mt-3 text-sm">{p.description}</p>}

            <div className="mt-4 text-sm text-gray-600">
              Cart + ordering will be added next.
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}