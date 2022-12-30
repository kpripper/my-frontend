import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface SnackBarState {
  open: boolean
  vertical: 'top' | 'bottom'
  horizontal: 'center' | 'left' | 'right'
}

export const SnackBar = () => {
  const [state, setState] = useState<SnackBarState>({
    open: true,
    vertical: 'bottom',
    horizontal: 'center',
  })

  const { vertical, horizontal, open } = state

  const handleClick =
    ({
      vertical,
      horizontal,
    }: {
      vertical: 'top' | 'bottom',
      horizontal: 'center' | 'left' | 'right'
    }) =>
    () => {
      setState({ open: true, vertical, horizontal })
    }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      {/* <Button
        onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })}
      >
        Bottom-Right
      </Button>
      <Button
        onClick={handleClick({ vertical: 'bottom', horizontal: 'center' })}
      >
        Bottom-Center
      </Button>
      <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'left' })}>
        Bottom-Left
      </Button> */}

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        autoHideDuration={6000}
        open={open}
        onClose={handleClose}
        message="I love snacks"
        action={action}
      />
    </div>
  )
}
