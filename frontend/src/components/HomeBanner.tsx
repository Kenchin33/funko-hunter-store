import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    eyebrow: "ДОВГООЧІКУВАНЕ ПЕРЕДЗАМОВЛЕННЯ",
    title: "Funko Pop по Cyberpunk: Edgerunners вже тут",
    description:
      "Девід, Люсі та Ребека. Передзамовляй та отримуй одним з перших улюблених героїв!",
    buttonText: "Переглянути фігурки",
    link: "/search?q=cyberpunk-edgerunners",
    image: "/banner-cyberpunk.jpg",
  },
  {
    id: 2,
    eyebrow: "НОВИНКИ ANIME",
    title: "Нові фігурки Naruto уже в Funko Hunter",
    description:
      "Ітачі, Орочімару, Мінато та інші герої вже доступні для замовлення.",
    buttonText: "Переглянути Naruto",
    link: "/catalog/anime/naruto",
    image: "/banner-naruto.jpg",
  },
  {
    id: 3,
    eyebrow: "ЕКСКЛЮЗИВНІ ФІГУРКИ",
    title: "One Piece поповнює твою колекцію",
    description:
      "Ексклюзивні та лімітовані Funko Pop по One Piece вже на сайті.",
    buttonText: "Переглянути One Piece",
    link: "/catalog/anime/one-piece",
    image: "/banner-one-piece.jpg",
  },
];

export default function HomeBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  function goToSlide(index: number) {
    setActiveIndex(index);
  }

  function goPrev() {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }

  function goNext() {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }

  const activeSlide = slides[activeIndex];

  return (
    <section
      className="home-banner"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${activeSlide.image})`,
      }}
    >
      <div className="home-banner-content">
        <p className="home-banner-eyebrow">{activeSlide.eyebrow}</p>

        <h1 className="home-banner-title">{activeSlide.title}</h1>

        <p className="home-banner-description">{activeSlide.description}</p>

        <Link to={activeSlide.link} className="banner-btn">
          {activeSlide.buttonText}
        </Link>
      </div>

      <button
        className="home-banner-arrow home-banner-arrow-left"
        onClick={goPrev}
        aria-label="Попередній банер"
        type="button"
      >
        ‹
      </button>

      <button
        className="home-banner-arrow home-banner-arrow-right"
        onClick={goNext}
        aria-label="Наступний банер"
        type="button"
      >
        ›
      </button>

      <div className="home-banner-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`home-banner-dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Перейти до банера ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}