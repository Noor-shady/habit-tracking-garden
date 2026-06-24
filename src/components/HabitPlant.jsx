import { Check, Trash2, Sparkles } from "lucide-react";
import { getPlantHealth, getPlantStage, getTodayKey } from "../utils/gardenLogic";

export default function HabitPlant({ habit, onComplete, onDelete, readOnly = false }) {
  const today = getTodayKey();
  const completedToday = (habit.completedDates || []).includes(today);
  const stage = getPlantStage(habit.streak, habit.sunlightBoosts);
  const health = getPlantHealth(habit);

  const plantSize = 52 + stage.stage * 13 + (habit.sunlightBoosts || 0) * 2;
  const saturation = Math.round(health.vibrancy * 120);

  return (
    <article className={`plant-card ${health.className}`}>
      <div className="plant-topline">
        <span className="plant-health">{health.label}</span>
        <span className="plant-stage">{stage.label}</span>
      </div>

      <div className="plant-visual">
        <div className="sparkle sparkle-one">✦</div>
        <div className="sparkle sparkle-two">✧</div>
        <div
          className="plant-emoji"
          style={{
            fontSize: `${plantSize}px`,
            filter: `saturate(${saturation}%)`,
            transform: `rotate(${health.wiltAmount}deg)`,
          }}
        >
          {stage.stage === 1 ? "🌰" : habit.plantEmoji}
        </div>
        <div className="soil"></div>
      </div>

      <h3>{habit.title}</h3>
      <p>{stage.message}</p>

      <div className="plant-stats">
        <span>🔥 {habit.streak || 0} day streak</span>
        <span>☀️ {habit.sunlightBoosts || 0} boosts</span>
      </div>

      {!readOnly && (
        <div className="plant-actions">
          <button
            className="complete-button"
            onClick={() => onComplete(habit)}
            disabled={completedToday}
          >
            {completedToday ? (
              <>
                <Sparkles size={17} />
                Watered today
              </>
            ) : (
              <>
                <Check size={17} />
                Water habit
              </>
            )}
          </button>

          <button
            className="delete-button"
            onClick={() => onDelete(habit.id)}
            aria-label={`Delete ${habit.title}`}
          >
            <Trash2 size={17} />
          </button>
        </div>
      )}
    </article>
  );
}
