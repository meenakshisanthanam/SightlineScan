function scoreColor(score) {
  if (score >= 90) return '#15803d';
  if (score >= 70) return '#b45309';
  return '#b91c1c';
}

export default function ScoreRing({ score }) {
  const color = scoreColor(score);
  const ringStyle = {
    background: `conic-gradient(${color} ${score * 3.6}deg, var(--ring-track) 0deg)`,
  };

  return (
    <div className="score-ring" style={ringStyle} role="img" aria-label={`Accessibility score: ${score} out of 100`}>
      <div className="score-ring__inner">
        <span className="score-ring__number" style={{ color }}>{score}</span>
        <span className="score-ring__label">/ 100</span>
      </div>
    </div>
  );
}
