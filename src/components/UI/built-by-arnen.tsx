import React from 'react'
import '../../App.scss'

const handleClick = () => {
  window.open('https://arnen.xyz/', '_blank')
}

const PoweredByArnen = () => {
  return (
    <div className="built__by__arnen" onClick={handleClick}>
      Built by Arnen
    </div>
  )
}

export default PoweredByArnen
