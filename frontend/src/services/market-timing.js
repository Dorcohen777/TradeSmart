const API_KEY_POLY = 'gfdWnHyxY9wvUDUSUcgKUKWhPpRvBD02'

async function marketTiming() {
   try {
   } catch {}
}

async function fetchVIXData() {
   const apiKey = 'gfdWnHyxY9wvUDUSUcgKUKWhPpRvBD02'
   const endpoint =
      'https://api.polygon.io/v1/open-close/AAPL/2023-01-09?adjusted=true&apiKey=gfdWnHyxY9wvUDUSUcgKUKWhPpRvBD02'

   try {
      const response = await axios.get(endpoint, {
         headers: {
            Authorization: `Bearer ${apiKey}`,
         },
      })

      // Check if the response status is not OK (e.g., not in the 200-299 range)
      if (response.status !== 200) {
         throw new Error(`Error fetching VIX data. Status: ${response.status}`)
      }

      const data = response.data
      // Process and use the VIX data here
      console.log(data)
   } catch (error) {
      console.error('Error fetching VIX data:', error)
   }
}

// Call the async function
fetchVIXData()