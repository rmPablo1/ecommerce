import {createContext, useState, useEffect} from "react"

const productContext = createContext()

function Provider({children}) {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if(query !== ""){
      fetch(`http://localhost:8080/categories/${query}/?search=${searchQuery}`)
      .then(res => res.json())
      .then(data => {
        const productsFetched = data.products
        setProducts([...productsFetched])
      })
      } else {
        fetch(`http://localhost:8080/?page=${page}&search=${searchQuery}`)
      .then(res => res.json())
      .then(data => {
        const productsFetched = data.products
        setProducts([...productsFetched])

      })

    }
  }, [query, page, searchQuery])
  const toShare={
    products,
    setProducts,
    query,
    setQuery,
    page,
    setPage,
    searchQuery,
    setSearchQuery
  }
  return <productContext.Provider value={toShare}>
    {children}
  </productContext.Provider>
}

export {Provider, productContext}
