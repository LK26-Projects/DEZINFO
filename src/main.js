import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

document.querySelector('#app').innerHTML = `
  <main>
    <h1>DEZINFO</h1>
    <p>Test integracji API</p>

    <button id="loadData">Pobierz analizy z Supabase</button>
    <button id="testApi">Testuj zewnętrzne API</button>

    <pre id="result">Wybierz akcję.</pre>
  </main>
`

document.querySelector('#loadData').addEventListener('click', async () => {
  const result = document.querySelector('#result')
  result.textContent = 'Pobieranie danych...'

  const { data, error } = await supabase
    .from('analizy')
    .select('*')

  if (error) {
    console.error('Błąd Supabase:', error)
    result.textContent = `Błąd: ${error.message}`
    return
  }

  console.log('Odpowiedź Supabase:', data)
  result.textContent = JSON.stringify(data, null, 2)
})

document.querySelector('#testApi').addEventListener('click', async () => {
  const result = document.querySelector('#result')
  result.textContent = 'Wysyłanie danych do zewnętrznego API...'

  const payload = {
    title: 'DEZINFO - test analizy',
    body: 'Syntetyczna informacja testowa do analizy wiarygodności.',
    userId: 1
  }

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    console.log('Odpowiedź zewnętrznego API:', data)
    result.textContent = JSON.stringify(data, null, 2)
  } catch (error) {
    console.error('Błąd zewnętrznego API:', error)
    result.textContent = `Błąd: ${error.message}`
  }
})