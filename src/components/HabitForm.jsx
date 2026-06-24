import { useState } from "react";
import { Plus } from "lucide-react";

const plantOptions = [
  { value: "rose", label: "Rose", emoji: "🌹" },
  { value: "tulip", label: "Tulip", emoji: "🌷" },
  { value: "sunflower", label: "Sunflower", emoji: "🌻" },
  { value: "mushroom", label: "Mushroom", emoji: "🍄" },
  { value: "herb", label: "Herb", emoji: "🌿" },
];

export default function HabitForm({ onAddHabit }) {
  const [title, setTitle] = useState("");
  const [plantType, setPlantType] = useState("rose");

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const chosenPlant = plantOptions.find((plant) => plant.value === plantType);

    onAddHabit({
      title: title.trim(),
      plantType,
      plantEmoji: chosenPlant.emoji,
      streak: 0,
      sunlightBoosts: 0,
      completedDates: [],
      createdAt: Date.now(),
    });

    setTitle("");
    setPlantType("rose");
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="habit-title">New habit</label>
        <input
          id="habit-title"
          type="text"
          placeholder="Read 10 pages, drink water, study security..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="plant-type">Plant style</label>
        <select
          id="plant-type"
          value={plantType}
          onChange={(event) => setPlantType(event.target.value)}
        >
          {plantOptions.map((plant) => (
            <option key={plant.value} value={plant.value}>
              {plant.emoji} {plant.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">
        <Plus size={18} />
        Plant habit
      </button>
    </form>
  );
}
