import ProfileCard from './components/ProfileCard.jsx'
import './App.css'

function App() {
  const technologies = ['React', 'Rust']

  return (
    <main>
      <ProfileCard name="Ілля" group="КН-312" technologies={technologies} />
    </main>
  )
}

export default App
