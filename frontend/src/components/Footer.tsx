import { WebsiteCarbonBadge } from "react-websitecarbon-badge"

export default function Footer() {
  return (
    <footer className="footer">
      <WebsiteCarbonBadge url="https://git-good-pi.vercel.app/" />© {new Date().getFullYear()} Tia
      Nguyen{" "}
    </footer>
  )
}
