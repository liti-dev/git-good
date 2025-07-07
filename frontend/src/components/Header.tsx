import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header>
      <img src="/capylogo.svg" alt="capybara logo" id="logo" />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/why-it-matters" rel="noopener noreferrer">
          Why it matters
        </Link>
        <Link to="https://github.com/liti-dev/vscarbon" target="_blank" rel="noopener noreferrer">
          Try VS Code extension
        </Link>
      </nav>
    </header>
  )
}
