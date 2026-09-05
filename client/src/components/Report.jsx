import ScoreRing from './ScoreRing';
import IssueCard from './IssueCard';

const SEVERITY_ORDER = ['critical', 'serious', 'moderate', 'minor'];
const SEVERITY_LABELS = {
  critical: 'Critical',
  serious: 'Serious',
  moderate: 'Moderate',
  minor: 'Minor',
};

export default function Report({ report, onRescan }) {
  const { url, score, totalIssues, summary, issues } = report;
  const issuesBySeverity = SEVERITY_ORDER.map((severity) => ({
    severity,
    items: issues.filter((issue) => issue.impact === severity),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="report">
      <div className="report__header">
        <div>
          <p className="report__url-label">Scan results for</p>
          <p className="report__url">{url}</p>
        </div>
        <button className="button button--secondary" onClick={onRescan}>
          Scan another URL
        </button>
      </div>

      <div className="report__summary">
        <ScoreRing score={score} />
        <div className="summary-counts">
          <p className="summary-counts__total">
            {totalIssues} issue{totalIssues === 1 ? '' : 's'} found
          </p>
          <div className="summary-counts__grid">
            {SEVERITY_ORDER.map((severity) => (
              <div key={severity} className={`summary-count summary-count--${severity}`}>
                <span className="summary-count__number">{summary[severity] || 0}</span>
                <span className="summary-count__label">{SEVERITY_LABELS[severity]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {totalIssues === 0 ? (
        <p className="report__empty">No automatically detectable WCAG issues found. Nice work — manual review is still recommended.</p>
      ) : (
        issuesBySeverity.map((group) => (
          <section key={group.severity} className="issue-group">
            <h2 className={`issue-group__title issue-group__title--${group.severity}`}>
              {SEVERITY_LABELS[group.severity]} ({group.items.length})
            </h2>
            <ul className="issue-list">
              {group.items.map((issue, idx) => (
                <IssueCard key={`${issue.id}-${idx}`} issue={issue} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
