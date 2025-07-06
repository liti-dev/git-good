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
    <div className="container">
      <h2>💡Coding-related activities consume electricity.</h2>
      <h2>Save the capybaras by choosing the ideal time to push your code!</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postcode">Enter your regional postcode (e.g., RG41 or SW1)</label>
        <input
          type="text"
          id="postcode"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label htmlFor="email">And email if you want a reminder</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Get Carbon Intensity</button>
      </form>
    </div>
  )
}
