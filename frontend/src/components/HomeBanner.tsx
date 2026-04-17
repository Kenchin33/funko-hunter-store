import bannerImage from "../assets/banner.jpg";

export default function HomeBanner() {
  return (
    <section className="home-banner">
      <div
        className="home-banner-overlay"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(76, 29, 149, 0.82), rgba(124, 58, 237, 0.7)), url(${bannerImage})`,
        }}
      >
        <div className="home-banner-content">
          <p className="home-banner-subtitle">Довгоочікуване Передзамовлення</p>
          <h1>Funko Pop по Cybeprunk: Edgerunners вже тут</h1>
          <p>
            Девід, Люсі та Ребека. Передзамовляй та отримуй одним з перших улюблених героїв!
          </p>
          <button className="home-banner-btn">Переглянути новинки</button>
        </div>
      </div>
    </section>
  );
}