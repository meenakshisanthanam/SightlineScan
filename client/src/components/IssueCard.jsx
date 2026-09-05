const IMPACT_LABELS = {
  critical: 'Critical',
  serious: 'Serious',
  moderate: 'Moderate',
  minor: 'Minor',
};

export default function IssueCard({ issue }) {
  return (
    <li className={`issue-card issue-card--${issue.impact}`}>
      <div className="issue-card__header">
        <span className={`impact-badge impact-badge--${issue.impact}`}>
          {IMPACT_LABELS[issue.impact] || issue.impact}
        </span>
        <span className="issue-card__criterion">{issue.wcagCriterion}</span>
      </div>
      <p className="issue-card__description">{issue.description}</p>
      {issue.htmlSnippet && (
        <pre className="issue-card__snippet"><code>{issue.htmlSnippet}</code></pre>
      )}
      <p className="issue-card__fix">
        <strong>Suggested fix:</strong> {issue.suggestedFix}
      </p>
      {issue.helpUrl && (
        <a className="issue-card__link" href={issue.helpUrl} target="_blank" rel="noreferrer">
          Learn more →
        </a>
      )}
    </li>
  );
}
