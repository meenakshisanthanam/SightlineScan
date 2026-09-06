import ScoreCard from './ScoreCard';
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
          <p className="kicker">Inspected page</p>
          <p className="report__url">{url}</p>
        </div>
        <button className="button button--ghost" onClick={onRescan}>
          New scan
        </button>
      </div>

      <div className="report__summary">
        <ScoreCard score={score} />
        <dl className="tally">
          {SEVERITY_ORDER.map((severity) => (
            <div key={severity} className="tally__row">
              <dt className={`tally__label tally__label--${severity}`}>{SEVERITY_LABELS[severity]}</dt>
              <dd className="tally__value">{summary[severity] || 0}</dd>
            </div>
          ))}
        </dl>
      </div>

      {totalIssues === 0 ? (
        <p className="report__empty">
          Automated checks didn't turn up anything. That's not proof the page is fully accessible.
          Some problems only a person can catch.
        </p>
      ) : (
        issuesBySeverity.map((group) => (
          <section key={group.severity} className="issue-group">
            <h2 className={`issue-group__title issue-group__title--${group.severity}`}>
              {SEVERITY_LABELS[group.severity]}
              <span className="issue-group__count">{group.items.length}</span>
            </h2>
            <ul className="issue-list">
              {group.items.map((issue, idx) => (
                <IssueCard key={`${issue.id}-${idx}`} issue={issue} index={idx + 1} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
