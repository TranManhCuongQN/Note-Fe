import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import authApi from 'src/api/auth.api'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import { Box } from '@mui/system'
import LoadingButton from '@mui/lab/LoadingButton'
import InputField from 'src/components/common/InputField'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, IconButton, InputAdornment } from '@mui/material'

interface FormData {
  username: string
  password: string
}

const schema = yup.object({
  username: yup.string().required('username is required').min(8, 'username minimum 8 characters'),
  password: yup.string().required('password is required').min(8, 'password minimum 8 characters')
})
const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const { handleSubmit, reset, control } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body),
    onSuccess: (res) => {
      localStorage.setItem('token', res.data.token)
      toast.dismiss()
      toast.success('Login success')
      navigate('/')
      reset()
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data)
  })
  return (
    <>
      <Box component='form' sx={{ mt: 1 }} onSubmit={onSubmit} noValidate>
        <InputField
          type='text'
          placeholder='Username'
          name='username'
          fullWidth
          control={control}
          color='success'
          label='Username'
        />

        <InputField
          name='password'
          label='Password'
          control={control}
          color='success'
          placeholder='Password'
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={() => setShowPassword(!showPassword)}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loginMutation.isLoading}
        >
          Login
        </LoadingButton>
      </Box>
      <Button component={Link} to='/register' sx={{ textTransform: 'none' }}>
        Dont have an account? Register
      </Button>
    </>
  )
}

export default Login
