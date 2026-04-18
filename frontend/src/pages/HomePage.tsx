import { useEffect, useState } from "react";
import { getAllProducts, getNewProducts } from "../api/productApi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HomeBanner from "../components/HomeBanner";
import ProductSection from "../components/ProductSection";
import type { ProductCardItem } from "../types/productCard";
import { mapProductsToCardItems } from "../utils/productCards";

export default function HomePage() {
  const [products, setProducts] = useState<ProductCardItem[]>([]);
  const [newProducts, setNewProducts] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allData, newData] = await Promise.all([
          getAllProducts(),
          getNewProducts(),
        ]);

        const allItems = mapProductsToCardItems(allData);
        const newItems = mapProductsToCardItems(newData);

        setProducts(allItems.slice(0, 4));
        setNewProducts(newItems.slice(0, 4));
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="store-page">
      <Header />
      <HomeBanner />

      <main className="store-main">
        {loading ? (
          <div className="store-loading">Завантаження товарів...</div>
        ) : (
          <>
            <ProductSection title="Популярні фігурки" items={products} />
            <ProductSection title="Новинки" items={newProducts} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}