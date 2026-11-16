import { useShowMore } from '../hooks/useShowMore.js'

/**
 * Показує перші `step` елементів з `items` і кнопку, що показує наступні.
 *
 * Використання:
 *   <ShowMore items={reviews} step={3}>
 *     {(visibleItems) => <ul>…</ul>}
 *   </ShowMore>
 *
 * Вимоги — у тестах tests/ShowMore.test.jsx.
 */
export default function ShowMore({ items, step, children }) {
  const { visibleItems, hiddenCount, showMore, collapse } = useShowMore(
    items,
    step,
  )
  const hasMore = hiddenCount > 0

  return (
    <>
      {children(visibleItems)}
      {items.length > step && (
        <button
          type="button"
          className="show-more"
          onClick={hasMore ? showMore : collapse}
        >
          {hasMore ? `Показати ще ${Math.min(step, hiddenCount)}` : 'Згорнути'}
        </button>
      )}
    </>
  )
}
