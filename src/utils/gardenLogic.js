export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getPlantStage(streak = 0, sunlightBoosts = 0) {
  const growthScore = streak + sunlightBoosts;

  if (growthScore >= 14) {
    return {
      label: "Blooming Flower",
      emoji: "🌺",
      stage: 5,
      message: "Fully blooming and thriving.",
    };
  }

  if (growthScore >= 10) {
    return {
      label: "Flower Bud",
      emoji: "🌷",
      stage: 4,
      message: "Almost blooming.",
    };
  }

  if (growthScore >= 6) {
    return {
      label: "Leafy Plant",
      emoji: "🪴",
      stage: 3,
      message: "Growing beautifully.",
    };
  }

  if (growthScore >= 3) {
    return {
      label: "Tiny Sprout",
      emoji: "🌱",
      stage: 2,
      message: "A sweet little sprout appeared.",
    };
  }

  return {
    label: "Seed",
    emoji: "🌰",
    stage: 1,
    message: "Waiting for daily care.",
  };
}

export function getPlantHealth(habit) {
  const today = getTodayKey();
  const completions = habit.completedDates || [];
  const completedToday = completions.includes(today);

  if (completedToday) {
    return {
      label: "Thriving",
      className: "healthy",
      vibrancy: 1,
      wiltAmount: 0,
    };
  }

  if (habit.streak >= 5) {
    return {
      label: "Needs Water",
      className: "needs-water",
      vibrancy: 0.82,
      wiltAmount: 6,
    };
  }

  return {
    label: "Sleepy",
    className: "sleepy",
    vibrancy: 0.68,
    wiltAmount: 12,
  };
}

export function calculateNewStreak(habit) {
  const today = getTodayKey();
  const completedDates = habit.completedDates || [];

  if (completedDates.includes(today)) {
    return habit.streak || 0;
  }

  return (habit.streak || 0) + 1;
}

export function getRandomEncouragement() {
  const messages = [
    "Your garden is glowing!",
    "Tiny progress is still progress.",
    "One habit watered. One future upgraded.",
    "That plant looks proud of you.",
    "Main character discipline unlocked.",
    "Your digital garden says: slay.",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
