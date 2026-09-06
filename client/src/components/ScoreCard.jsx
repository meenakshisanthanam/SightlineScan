function letterGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function gradeClass(grade) {
  if (grade === 'A' || grade === 'B') return 'score-card--good';
  if (grade === 'C') return 'score-card--fair';
  return 'score-card--poor';
}

export default function ScoreCard({ score }) {
  const grade = letterGrade(score);

  return (
    <div
      className={`score-card ${gradeClass(grade)}`}
      role="img"
      aria-label={`Accessibility score: ${score} out of 100, grade ${grade}`}
    >
      <span className="score-card__grade">{grade}</span>
      <div className="score-card__rule" />
      <div className="score-card__figure">
        <span className="score-card__number">{score}</span>
        <span className="score-card__of">out of 100</span>
      </div>
    </div>
  );
}
