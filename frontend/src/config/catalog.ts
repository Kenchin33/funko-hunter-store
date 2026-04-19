export const CATEGORY_CONFIG = {
    anime: {
      label: "Anime",
      subcategories: [
        { slug: "one-piece", label: "One Piece" },
        { slug: "naruto", label: "Naruto" },
        { slug: "jujutsu-kaisen", label: "Jujutsu Kaisen" },
        { slug: "demon-slayer", label: "Demon Slayer" },
        { slug: "my-hero-academia", label: "My Hero Academia" },
        { slug: "chainsaw-man", label: "Chainsaw Man" },
        { slug: "other", label: "Інші" },
      ],
      knownSubcategories: [
        "one-piece",
        "naruto",
        "jujutsu-kaisen",
        "demon-slayer",
        "my-hero-academia",
        "chainsaw-man",
      ],
    },
    heroes: {
      label: "Heroes",
      subcategories: [
        { slug: "marvel", label: "Marvel" },
        { slug: "dc", label: "DC" },
      ],
      knownSubcategories: ["marvel", "dc"],
    },
    movies: {
      label: "Movies",
      subcategories: [
        { slug: "harry-potter", label: "Harry Potter" },
        { slug: "star-wars", label: "Star Wars" },
        { slug: "lord-of-the-rings", label: "Lord of the Rings" },
        { slug: "stranger-things", label: "Stranger Things" },
        { slug: "other", label: "Інші" },
      ],
      knownSubcategories: [
        "harry-potter",
        "star-wars",
        "lord-of-the-rings",
        "sopranos",
      ],
    },
    games: {
      label: "Games",
      subcategories: [
        { slug: "playstation", label: "PlayStation" },
        { slug: "dota-2", label: "Dota 2" },
        { slug: "fnaf", label: "FNAF" },
        { slug: "league-of-legends", label: "League of Legends" },
        { slug: "world-of-warcraft", label: "World of Warcraft" },
        { slug: "other", label: "Інші" },
      ],
      knownSubcategories: [
        "playstation",
        "dota-2",
        "fnaf",
        "league-of-legends",
        "world-of-warcraft",
      ],
    },
    cartoons: {
      label: "Cartoons",
      subcategories: [
        { slug: "disney", label: "Disney" },
        { slug: "pixar", label: "Pixar" },
        { slug: "avatar-the-last-airbender", label: "Avatar the Last Airbender" },
        { slug: "arcane", label: "Arcane" },
        { slug: "sponge-bob", label: "Sponge Bob" },
        { slug: "other", label: "Інші" },
      ],
      knownSubcategories: [
        "disney",
        "pixar",
        "avatar-the-last-airbender",
        "arcane",
        "sponge-bob",
      ],
    },
  } as const;