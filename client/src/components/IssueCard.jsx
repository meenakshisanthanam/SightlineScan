const IMPACT_LABELS = {
  critical: 'Critical',
  serious: 'Serious',
  moderate: 'Moderate',
  minor: 'Minor',
};

export default function IssueCard({ issue, index }) {
  return (
    <li className={`issue-card issue-card--${issue.impact}`}>
      <span className="issue-card__index">{String(index).padStart(2, '0')}</span>
      <div className="issue-card__body">
        <div className="issue-card__header">
          <span className={`issue-card__impact issue-card__impact--${issue.impact}`}>
            {IMPACT_LABELS[issue.impact] || issue.impact}
          </span>
          <span className="issue-card__criterion">{issue.wcagCriterion}</span>
        </div>
        <p className="issue-card__description">{issue.description}</p>
        {issue.htmlSnippet && (
          <pre className="issue-card__snippet"><code>{issue.htmlSnippet}</code></pre>
        )}
        <p className="issue-card__fix">
          <span className="label-tag">Fix</span> {issue.suggestedFix}
        </p>
        {issue.helpUrl && (
          <a className="issue-card__link" href={issue.helpUrl} target="_blank" rel="noreferrer">
            Rule reference ↗
          </a>
        )}
      </div>
    </li>
  );
}
