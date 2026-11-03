import styles from './ComingSoon.module.scss'

interface ComingSoonProps {
  task: string
  when: string
}

/** Placeholder for screens the plan schedules for a later day. */
export function ComingSoon({ task, when }: ComingSoonProps) {
  return (
    <div className={styles.card}>
      <h2>Not built yet</h2>
      <p>
        {task} is scheduled for {when}.
      </p>
    </div>
  )
}
