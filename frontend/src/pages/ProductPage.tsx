import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../api/productApi";
import { useCart } from "../hooks/useCart";
import Footer from "../components/Footer";
import Header from "../components/Header";
import type { Product } from "../types/product";

function getRarityLabel(rarity: string) {
  if (rarity === "exclusive") return "Ексклюзив";
  if (rarity === "limited") return "Лімітка";
  return null;
}

function calculateDiscount(price: number, compareAtPrice: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;

      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product", error);
      }
    }

    loadProduct();
  }, [slug]);

  const foundVariant = useMemo(() => {
    if (!product || !slug) return undefined;
    return product.variants.find((variant) => variant.slug === slug);
  }, [product, slug]);

  if (!product) {
    return (
      <div className="store-page">
        <Header />
        <main className="product-page">
          <div className="store-loading">Завантаження...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentProduct = product;

  if (!foundVariant) {
    return (
      <div className="store-page">
        <Header />
        <main className="product-page">
          <div className="admin-error-box">Варіант товару не знайдено.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const activeVariant = foundVariant;
  const rarityLabel = getRarityLabel(currentProduct.rarity);
  const price = Number(activeVariant.price);
  const compareAtPrice = activeVariant.compare_at_price
    ? Number(activeVariant.compare_at_price)
    : null;
  const discount = calculateDiscount(price, compareAtPrice);
  const image = currentProduct.images[0]?.image_url ?? null;

  function handleAddToCart() {
    addToCart({
      variantId: activeVariant.id,
      variantSlug: activeVariant.slug,
      productId: currentProduct.id,
      productName: currentProduct.name,
      variantName: activeVariant.variant_name,
      imageUrl: image,
      price,
      compareAtPrice,
      availabilityStatus: activeVariant.availability_status,
      isBoxDamaged: activeVariant.is_box_damaged,
      stockQuantity: activeVariant.stock_quantity,
    });
  
    window.dispatchEvent(new Event("cart:open"));
  }

  return (
    <div className="store-page">
      <Header />

      <main className="product-page">
        <div className="product-page-container">
          <div className="product-images">
            <div className="product-main-image-wrap">
              {rarityLabel && (
                <div className={`product-badge product-badge-rarity rarity-${currentProduct.rarity}`}>
                  {rarityLabel}
                </div>
              )}

              {activeVariant.is_box_damaged && (
                <div className="product-badge product-page-badge-damaged">
                  Пошкоджена коробка
                </div>
              )}

              {discount && (
                <div className="product-badge product-page-badge-discount">
                  -{discount}%
                </div>
              )}

              <img
                src={currentProduct.images[activeImage]?.image_url}
                alt={currentProduct.name}
                className="product-main-image"
              />
            </div>

            <div className="product-thumbnails">
              {currentProduct.images.map((img, index) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  alt={`${currentProduct.name} ${index + 1}`}
                  className={`product-thumb ${index === activeImage ? "active" : ""}`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <p className="product-series">{currentProduct.series}</p>

            <h1>{currentProduct.name}</h1>

            <p className="product-variant-name">{activeVariant.variant_name}</p>

            <div className="product-price-wrap">
              {compareAtPrice && (
                <span className="old-price">{compareAtPrice} грн</span>
              )}
              <span className="product-price">{price} грн</span>
            </div>

            <div className="product-meta-row">
              {discount && <div className="product-discount">Знижка {discount}%</div>}

              <div
                className={`product-status ${
                  activeVariant.availability_status === "in_stock"
                    ? "status-in-stock"
                    : "status-preorder"
                }`}
              >
                {activeVariant.availability_status === "in_stock"
                  ? "В наявності"
                  : "Передзамовлення"}
              </div>
            </div>

            {activeVariant.delivery_eta && (
              <p className="product-delivery">
                Доставка: {activeVariant.delivery_eta}
              </p>
            )}

            {activeVariant.availability_status === "in_stock" && (
              <p className="product-stock">
                Кількість в наявності: {activeVariant.stock_quantity}
              </p>
            )}

            <p className="product-description">{currentProduct.short_description}</p>

            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              data-cart-action="add"
            >
              Додати в кошик
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}