import { useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    setSuccess(false)

    const data = {
      email: email,
      subject: subject,
      text: text 
    }

    const response = await fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      setError(true)
      setLoading(false)
      return
    }

    const result = await response.text();
    if(result === 'Email sent successfully!') {
      setEmail('')
      setSubject('')
      setText('')
      setLoading(false)
      setSuccess(true)
    }

    setTimeout(() => {
      setSuccess(false)
      setError(false) 
    }, 5000)
  };

  return (
    <div className='app'>
      <h1>Quick Email Form</h1>
      <form encType='application/x-www-form-urlencoded' method='POST' onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required onInput={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" name="subject" required onInput={(e) => setSubject(e.target.value)} value={subject} />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="text" rows={5} required onInput={(e) => setText(e.target.value)} value={text}></textarea>
        </div>
        {loading ? <button disabled>Loading...</button> : <button>Submit</button>}
        {success && <div className='popup success'>Email Sent Successfully</div>}
        {error && <div className='popup error'>Error sending Mail</div>}
      </form>
    </div>
  )
}

export default App
