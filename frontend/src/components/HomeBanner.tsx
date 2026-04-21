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
    link: "/catalog/anime/cyberpunk-edgerunners",
    image: "/banner-cyberpunk.jpg",
  },
  {
    id: 2,
    eyebrow: "РАРИТЕТИ У НАЯВНОСТІ",
    title: "Breaking Bad знову у наявності",
    description:
      "Бажані фігурки 2014 року знову у наявності!",
    buttonText: "Замовляй зараз",
    link: "/catalog/movies/breaking-bad",
    image: "/banner-breakind-bad.jpg",
  },
  {
    id: 3,
    eyebrow: "СВІТОВИЙ БЕСТСЕЛЛЕР ВЖЕ ТУТ",
    title: "Передзамовлення на Folk in the Air вже тут",
    description:
      "Джуд, Кардан та інші герої вже на сайті",
    buttonText: "Передзамовляй першим",
    link: "/catalog/books/folk-of-the-air",
    image: "/banner-folk-of-the-air.jpg",
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

  return (
    <section className="home-banner">
      <div className="home-banner-slides">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`home-banner-slide ${index === activeIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="home-banner-overlay" />

            <div className="home-banner-content">
              <p className="home-banner-eyebrow">{slide.eyebrow}</p>

              <h1 className="home-banner-title">{slide.title}</h1>

              <p className="home-banner-description">{slide.description}</p>

              <Link to={slide.link} className="banner-btn">
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
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