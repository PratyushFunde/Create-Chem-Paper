import { useRoute } from './lib/route'
import Home from './Home'
import Studio from './Studio'

export default function App() {
  const route = useRoute()
  return route === '/paper' ? <Studio /> : <Home />
}
