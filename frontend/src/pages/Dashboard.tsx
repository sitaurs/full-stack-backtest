import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/backtest">Run Backtest</Link></li>
          <li><Link to="/reports">View Reports</Link></li>
        </ul>
      </nav>
    </div>
  );
}
