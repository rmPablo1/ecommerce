import {useContext, useState} from 'react'
import { productContext } from '../context/productsContext'

function SearchInput() {
  const [value, setValue] = useState('')
  const {setSearchQuery} = useContext(productContext)

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // ADD FETCHING ITEMS FROM SERVER
    setSearchQuery(value)
  }
  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Search Product" className="navbar-input"onChange={handleChange} type="text" value={value}/>
    </form>
  )
}

export default SearchInput
