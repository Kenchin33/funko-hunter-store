import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../api/productApi";
import type { Product } from "../types/product";
import Footer from "../components/Footer";
import Header from "../components/Header";

function getRarityLabel(rarity: string) {
  if (rarity === "exclusive") return "Ексклюзив";
  if (rarity === "limited") return "Лімітка";
  return null;
}

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;

      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (e) {
        console.error("Failed to load product", e);
      }
    }

    loadProduct();
  }, [slug]);

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

  const rarityLabel = getRarityLabel(product.rarity);

  return (
    <div className="store-page">
      <Header />

      <main className="product-page">
        <div className="product-page-container">
          <div className="product-images">
            <div className="product-main-image-wrap">
              {rarityLabel && (
                <div className={`product-badge product-badge-rarity rarity-${product.rarity}`}>
                  {rarityLabel}
                </div>
              )}

              {!product.is_new && (
                <div className="product-badge product-badge-damaged">
                  Пошкоджена коробка
                </div>
              )}

              <img
                src={product.images[activeImage]?.image_url}
                alt={product.name}
                className="product-main-image"
              />
            </div>

            <div className="product-thumbnails">
              {product.images.map((img, index) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  alt={`${product.name} ${index + 1}`}
                  className={`product-thumb ${index === activeImage ? "active" : ""}`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <p className="product-series">{product.series}</p>

            <h1>{product.name}</h1>

            <p className="product-price">{product.price} грн</p>

            <div
              className={`product-status ${
                product.availability_status === "in_stock"
                  ? "status-in-stock"
                  : "status-preorder"
              }`}
            >
              {product.availability_status === "in_stock"
                ? "В наявності"
                : "Передзамовлення"}
            </div>

            {product.delivery_eta && (
              <p className="product-delivery">
                Доставка: {product.delivery_eta}
              </p>
            )}

            <p className="product-description">{product.short_description}</p>

            <button className="add-to-cart-btn">Додати в кошик</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}