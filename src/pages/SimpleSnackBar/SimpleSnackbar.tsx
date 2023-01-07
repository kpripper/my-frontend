import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import store from '../../store/store'
import { clearError } from '../../store/modules/errorHandlers/actions'

export default function SimpleSnackbar({ text }: { text: string }) {

  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)    
    store.dispatch(clearError())
  }


  return (
    <div>
      <Snackbar
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {"Simple error "+text}
        </Alert>
      </Snackbar>
    </div>
  )
}
