import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export default function SimpleSnackbar({ text }: { text: string }) {

  console.log("SimpleSnackbar({ text", text);
  
  const [open, setOpen] = useState(true)

  // const handleClick = () => {
  //   setOpen(true)
  // }

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  // const action = (
  //   <React.Fragment>
  //     <Button color="secondary" size="small" onClick={handleClose}>
  //       UNDO
  //     </Button>
  //     <IconButton
  //       size="small"
  //       aria-label="close"
  //       color="inherit"
  //       onClick={handleClose}
  //     >
  //       <CloseIcon fontSize="small" />
  //     </IconButton>
  //   </React.Fragment>
  // )

  return (
    <div>
      {/* <Button onClick={handleClick}>Open simple snackbar</Button> */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
       // message="Note archived"
        // action={action}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {text}
        </Alert>
      </Snackbar>
    </div>
  )
}
