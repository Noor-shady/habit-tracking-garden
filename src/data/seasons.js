export function getSeasonTheme() {
  const month = new Date().getMonth() + 1;

  if ([3, 4, 5].includes(month)) {
    return {
      name: "Spring Blossom",
      emoji: "🌸",
      className: "spring",
      description: "Soft petals, pink skies, and fresh growth.",
    };
  }

  if ([6, 7, 8].includes(month)) {
    return {
      name: "Summer Glow",
      emoji: "☀️",
      className: "summer",
      description: "Golden sunshine, warm air, and happy blooms.",
    };
  }

  if ([9, 10, 11].includes(month)) {
    return {
      name: "Autumn Leaves",
      emoji: "🍂",
      className: "autumn",
      description: "Cozy leaves, cinnamon tones, and gentle wind.",
    };
  }

  return {
    name: "Winter Snow",
    emoji: "❄️",
    className: "winter",
    description: "Snowflakes, frosty plants, and quiet magic.",
  };
}
