export function HistoryPanelSkeleton({ loading }: { loading: boolean }) {
  return (
    <div className="chat-history-placeholder" aria-busy={loading}>
      {loading ? (
        <>
          <span className="chat-sr-only" role="status">
            Loading profile and history
          </span>
          <div aria-hidden="true">
            <div className="chat-skeleton-profile">
              <span className="chat-skeleton" />
              <span className="chat-skeleton chat-skeleton-line" />
            </div>
            <h3>History</h3>
            {[0, 1, 2, 3, 4, 5].map((id) => (
              <div className="chat-skeleton-history-card" key={id}>
                <span className="chat-skeleton" />
                <span className="chat-skeleton chat-skeleton-line" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>History will appear once your conversations load.</p>
      )}
    </div>
  );
}
