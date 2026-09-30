// Matches admin ViewProgress "Needs Improvement" when accuracy is below 60%.
export const WEAK_TOPIC_THRESHOLD = 60;

const isCorrectRow = (row) =>
  Number(row?.is_correct ?? row?.sq_is_correct) === 1;

export const percentOf = (correct, attempted) => {
  if (!attempted || attempted <= 0) return null;
  return Math.round((correct / attempted) * 100);
};

export const analyzeTopics = (rows = []) => {
  const grouped = new Map();

  rows.forEach((row) => {
    const topicId = row?.topic_id;
    const topicName = (row?.topic_name || "").trim();
    if (topicId == null && !topicName) return;

    const key = topicId != null ? String(topicId) : topicName;
    if (!grouped.has(key)) {
      grouped.set(key, {
        topicId: topicId ?? null,
        name: topicName || `Topic ${topicId}`,
        attempted: 0,
        correct: 0,
      });
    }

    const topic = grouped.get(key);
    topic.attempted += 1;
    if (isCorrectRow(row)) topic.correct += 1;
  });

  const all = Array.from(grouped.values())
    .map((topic) => ({
      ...topic,
      percent: percentOf(topic.correct, topic.attempted),
    }))
    .filter((topic) => topic.percent != null)
    .sort((a, b) => a.percent - b.percent);

  return {
    all,
    weak: all.filter((topic) => topic.percent < WEAK_TOPIC_THRESHOLD),
    strong: all.filter((topic) => topic.percent >= WEAK_TOPIC_THRESHOLD),
  };
};
