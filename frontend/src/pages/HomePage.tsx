import { useEffect, useState } from "react";
import { getAllProducts, getNewProducts } from "../api/productApi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HomeBanner from "../components/HomeBanner";
import ProductSection from "../components/ProductSection";
import type { Product } from "../types/product";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allData, newData] = await Promise.all([
          getAllProducts(),
          getNewProducts(),
        ]);

        setProducts(allData.slice(0, 4));
        setNewProducts(newData.slice(0, 4));
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
            <ProductSection title="Популярні фігурки" products={products} />
            <ProductSection title="Новинки" products={newProducts} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}