import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <>
      <h1>Not found</h1>
      <p>
        That page doesn't exist. <Link to="/">Go to the dashboard</Link>
      </p>
    </>
  )
}
