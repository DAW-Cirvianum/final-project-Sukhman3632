import { Link } from 'react-router-dom';
import './Home.css';

//Home Page 

function Home() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-left">
          <img 
            src="/images/logo.jpg" 
            alt="AutoWorkshop" 
            className="logo-img"
          />
          <span className="logo-text">AutoWorkshop</span>
        </div>
        <div className="header-right">
          <Link to="/login" className="btn-login">Sign in</Link>
          <Link to="/register" className="btn-register">Get Started</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <div className="content-center">
          <h1>Manage your workshop<br />efficiently</h1>
          <p>Organize clients, vehicles and repairs from one place. Simple, fast and professional.</p>
        </div>
      </main>
    </div>
  );
}

export default Home;
