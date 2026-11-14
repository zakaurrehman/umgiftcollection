import { getProduct, products } from "@/lib/catalog";

// Pre-rendered JSON for each product, used by the Quick View dialog so the
// customizer can open anywhere without shipping the whole catalog to the client.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const p = getProduct(slug);
  if (!p) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images,
    imageAlts: p.imageAlts,
    options: p.options,
    bulkTiers: p.bulkTiers,
    bulkUnit: p.bulkUnit,
    qualityTiers: p.qualityTiers,
    inStock: p.inStock,
    description: p.description,
  });
}
