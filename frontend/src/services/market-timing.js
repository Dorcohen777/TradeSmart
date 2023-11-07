const axios = require('axios')

export const marketTiming = {
   fetchVIXData,
}

async function fetchVIXData(date) {
   const apiKey = 'gfdWnHyxY9wvUDUSUcgKUKWhPpRvBD02'
   const endpoint = `https://api.polygon.io/v1/open-close/VIX9D/${date}?adjusted=true&apiKey=${apiKey}`

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
   } catch (error) {
      console.error('Error fetching VIX data:', error)
   }
}
