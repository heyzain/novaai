export function ConversationListSkeleton({ loading }: { loading: boolean }) {
  return (
    <div className="chat-recents-placeholder" aria-busy={loading}>
      {loading ? (
        <>
          <span className="chat-sr-only" role="status">
            Loading conversations
          </span>
          <div aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((id) => (
              <span className="chat-skeleton chat-skeleton-line" key={id} />
            ))}
          </div>
        </>
      ) : (
        <p>Your conversations will appear here.</p>
      )}
    </div>
  );
}
