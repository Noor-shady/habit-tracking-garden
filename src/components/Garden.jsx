import HabitPlant from "./HabitPlant";

export default function Garden({ habits, onComplete, onDelete, readOnly = false }) {
  if (habits.length === 0) {
    return (
      <section className="empty-garden">
        <div className="empty-emoji">🧺</div>
        <h2>Your garden is waiting.</h2>
        <p>Add your first habit and grow something cute from your routine.</p>
      </section>
    );
  }

  return (
    <section className="garden-grid">
      {habits.map((habit) => (
        <HabitPlant
          key={habit.id}
          habit={habit}
          onComplete={onComplete}
          onDelete={onDelete}
          readOnly={readOnly}
        />
      ))}
    </section>
  );
}
