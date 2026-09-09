import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHead } from "@/components/site/SiteLayout";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useECommerce } from "@/lib/ecommerce-context";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — Saved Natural Remedies | Kiana" },
      { name: "description", content: "Your saved products at Kiana Naturopathy." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, setIsCartDrawerOpen } = useECommerce();
  const { add } = useCart();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.slug));

  const addAllToCart = () => {
    wishlistedProducts.forEach((p) => {
      add({ slug: p.slug, name: p.name, price: p.price, image: p.image });
    });
    setIsCartDrawerOpen(true);
  };

  return (
    <>
      <PageHead
        eyebrow="Saved Items"
        title="My Wishlist"
        lead="Your personal collection of herbal supplements, detox kits, essential oils, and natural health remedies."
      />

      <section style={{ padding: "40px 0 80px" }}>
        <div className="wrap">
          {wishlistedProducts.length === 0 ? (
            <div className="center" style={{ padding: "60px 0" }}>
              <span style={{ fontSize: "3rem" }}>🤍</span>
              <h2 style={{ marginTop: 16 }}>Your Wishlist is Empty</h2>
              <p className="lead" style={{ maxWidth: 460, margin: "10px auto 24px" }}>
                Explore our wellness shop and click the heart icon on any product to save it here for later!
              </p>
              <Link className="btn btn-primary" to="/shop">
                Explore Wellness Shop
              </Link>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <span className="muted">
                  Showing {wishlistedProducts.length} saved item{wishlistedProducts.length === 1 ? "" : "s"}
                </span>
                <button className="btn btn-primary" onClick={addAllToCart}>
                  Add All to Cart 🛒
                </button>
              </div>

              <div className="grid g4">
                {wishlistedProducts.map((product) => (
                  <ProductCard product={product} key={product.slug} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
