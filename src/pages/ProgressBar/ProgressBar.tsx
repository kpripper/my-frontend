import React, { useState, useEffect } from 'react'
import { useNavigation } from 'react-router-dom'

import './progressbar.scss'

export const ProgressBar = () => {
  return (
    <div className="progress-bar-container">
      <p className="progress-bar-name">Loading...</p>
    </div>
  )
}
