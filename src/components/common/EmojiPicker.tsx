import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

const EmojiPicker = ({ icon, onChange }: { icon: string; onChange: (emoji: string) => void }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>('')
  const [isShowPicker, setIsShowPicker] = useState<boolean>(false)

  useEffect(() => {
    setSelectedEmoji(icon)
  }, [icon])

  const showPicker = () => setIsShowPicker(!isShowPicker)

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography variant='h3' fontWeight='700' sx={{ cursor: 'pointer' }} onClick={showPicker}>
        {selectedEmoji}
      </Typography>
      <Box
        sx={{
          display: isShowPicker ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          zIndex: '9999'
        }}
      >
        <Picker
          theme='dark'
          data={data}
          onEmojiSelect={(emoji: any) => {
            onChange(emoji.native)
          }}
          onClickOutSide={() => setIsShowPicker(false)}
        />
      </Box>
    </Box>
  )
}

export default EmojiPicker
