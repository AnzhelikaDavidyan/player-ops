import { Link } from 'react-router'
import { StatusBadge } from '../components/StatusBadge'
import { players } from '../data/players'

export function PlayersPage() {
  return (
    <>
      <h1>Players</h1>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Position</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.number}</td>
              <td>
                <Link to={`/players/${player.id}`}>{player.name}</Link>
              </td>
              <td>{player.position}</td>
              <td>
                <StatusBadge status={player.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
