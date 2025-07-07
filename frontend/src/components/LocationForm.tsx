interface LocationFormProps {
  location: string
  setLocation: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: (e: React.FormEvent) => void
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
}

export default function LocationForm({
  location,
  setLocation,
  handleSubmit,
  email,
  setEmail,
}: LocationFormProps) {
  return (
    <form onSubmit={handleSubmit} className="form">
      <label htmlFor="postcode">Enter your regional postcode</label>
      <input
        type="text"
        id="postcode"
        placeholder="RG41, SW1, etc."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <label htmlFor="email">Enter your email if you want a reminder</label>
      <input
        type="email"
        id="email"
        placeholder="janedoe@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Get carbon intensity</button>
    </form>
  )
}
