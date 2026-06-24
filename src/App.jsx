import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import HabitForm from "./components/HabitForm";
import Garden from "./components/Garden";
import SharePanel from "./components/SharePanel";
import MusicToggle from "./components/MusicToggle";
import { getRandomEncouragement, getTodayKey } from "./utils/gardenLogic";
import { getSeasonTheme } from "./data/seasons";

function getOrCreateGardenId() {
  const existingId = localStorage.getItem("habitGardenId");

  if (existingId) {
    return existingId;
  }

  const newId = crypto.randomUUID();
  localStorage.setItem("habitGardenId", newId);
  return newId;
}

function getShareIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("garden");
}

export default function App() {
  const sharedGardenId = getShareIdFromUrl();
  const localGardenId = useMemo(() => getOrCreateGardenId(), []);
  const gardenId = sharedGardenId || localGardenId;
  const readOnly = Boolean(sharedGardenId);
  const [habits, setHabits] = useState([]);
  const [toast, setToast] = useState("");
  const [gardenName, setGardenName] = useState("Noor's Habit Garden");
  const theme = getSeasonTheme();

  const shareUrl = `${window.location.origin}${window.location.pathname}?garden=${localGardenId}`;

  useEffect(() => {
    async function createGardenIfNeeded() {
      const gardenRef = doc(db, "gardens", localGardenId);
      const gardenSnapshot = await getDoc(gardenRef);

      if (!gardenSnapshot.exists()) {
        await setDoc(gardenRef, {
          name: "Noor's Habit Garden",
          createdAt: serverTimestamp(),
          totalSunlightBoosts: 0,
        });
      }
    }

    if (!readOnly) {
      createGardenIfNeeded();
    }
  }, [localGardenId, readOnly]);

  useEffect(() => {
    async function loadGardenName() {
      const gardenRef = doc(db, "gardens", gardenId);
      const gardenSnapshot = await getDoc(gardenRef);

      if (gardenSnapshot.exists()) {
        setGardenName(gardenSnapshot.data().name || "Habit Garden");
      }
    }

    loadGardenName();

    const habitsQuery = query(
      collection(db, "gardens", gardenId, "habits"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(habitsQuery, (snapshot) => {
      const nextHabits = snapshot.docs.map((habitDoc) => ({
        id: habitDoc.id,
        ...habitDoc.data(),
      }));

      setHabits(nextHabits);
    });

    return unsubscribe;
  }, [gardenId]);

  async function addHabit(habit) {
    await addDoc(collection(db, "gardens", localGardenId, "habits"), habit);
    showToast("A new habit seed was planted 🌱");
  }

  async function completeHabit(habit) {
    const today = getTodayKey();

    if ((habit.completedDates || []).includes(today)) {
      showToast("This plant is already watered today ✨");
      return;
    }

    const nextCompletedDates = [...(habit.completedDates || []), today];

    await updateDoc(doc(db, "gardens", localGardenId, "habits", habit.id), {
      completedDates: nextCompletedDates,
      streak: (habit.streak || 0) + 1,
      lastCompletedAt: Date.now(),
    });

    showToast(getRandomEncouragement());
    createCompletionParticles();
  }

  async function deleteHabit(habitId) {
    await deleteDoc(doc(db, "gardens", localGardenId, "habits", habitId));
    showToast("Habit removed from your garden 🧺");
  }

  async function sendSunlightBoost() {
    if (!habits.length) {
      showToast("This garden needs a habit before it can receive sunlight.");
      return;
    }

    const randomHabit = habits[Math.floor(Math.random() * habits.length)];

    await updateDoc(doc(db, "gardens", gardenId, "habits", randomHabit.id), {
      sunlightBoosts: (randomHabit.sunlightBoosts || 0) + 1,
    });

    showToast(`You sent sunlight to "${randomHabit.title}" ☀️`);
  }

  async function copyShareLink() {
    await navigator.clipboard.writeText(shareUrl);
    showToast("Garden link copied. Send it to someone cute 🌷");
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2600);
  }

  function createCompletionParticles() {
    const particleContainer = document.querySelector(".particle-layer");

    if (!particleContainer) {
      return;
    }

    for (let i = 0; i < 18; i += 1) {
      const particle = document.createElement("span");
      particle.className = "completion-particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 0.4}s`;
      particle.textContent = ["✨", "🌸", "💫", "☀️"][Math.floor(Math.random() * 4)];

      particleContainer.appendChild(particle);

      setTimeout(() => particle.remove(), 1800);
    }
  }

  const totalStreaks = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0);
  const totalBoosts = habits.reduce((sum, habit) => sum + (habit.sunlightBoosts || 0), 0);

  return (
    <main className={`app-shell ${theme.className}`}>
      <div className="particle-layer"></div>

      {toast && <div className="toast">{toast}</div>}

      <header className="hero">
        <nav className="nav">
          <div className="logo">🌷 Habit Garden</div>
          <MusicToggle />
        </nav>

        <section className="hero-card">
          <p className="eyebrow">
            {theme.emoji} {theme.name}
          </p>

          <h1>{readOnly ? gardenName : "Grow your habits into a magical garden."}</h1>

          <p className="hero-text">
            A cozy productivity web app where every habit becomes a plant.
            Complete habits to water them, grow streaks, unlock blooms, and let
            friends send sunlight boosts.
          </p>

          <div className="stat-row">
            <div>
              <strong>{habits.length}</strong>
              <span>habits planted</span>
            </div>
            <div>
              <strong>{totalStreaks}</strong>
              <span>total streak days</span>
            </div>
            <div>
              <strong>{totalBoosts}</strong>
              <span>sunlight boosts</span>
            </div>
          </div>
        </section>
      </header>

      {!readOnly && <HabitForm onAddHabit={addHabit} />}

      <SharePanel
        shareUrl={shareUrl}
        onCopy={copyShareLink}
        onSunlightBoost={sendSunlightBoost}
        readOnly={readOnly}
      />

      <Garden
        habits={habits}
        onComplete={completeHabit}
        onDelete={deleteHabit}
        readOnly={readOnly}
      />

      <footer>
        Built with React, Firebase, gamification logic, seasonal UI, and cozy CSS animations.
      </footer>
    </main>
  );
}
