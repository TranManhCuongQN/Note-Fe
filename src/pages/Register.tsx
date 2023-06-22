import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import authApi from 'src/api/auth.api'
import { toast } from 'react-toastify'
import { Box, Button, IconButton, InputAdornment } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import InputField from 'src/components/common/InputField'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface FormData {
  username: string
  password: string
  confirmPassword: string
}

const schema = yup.object({
  username: yup.string().required('username is required').min(8, 'username minimum 8 characters'),
  password: yup.string().required('password is required').min(8, 'password minimum 8 characters'),
  confirmPassword: yup
    .string()
    .required('confirm password is required')
    .min(8, 'confirm password minimum 8 characters')
    .oneOf([yup.ref('password')], 'Confirm password not match')
})

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false)

  const { handleSubmit, reset, control } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: ''
    }
  })

  const registerMutation = useMutation({
    mutationFn: (body: { username: string; password: string }) => authApi.register(body),
    onSuccess: (res) => {
      localStorage.setItem('token', res.data.token)
      toast.dismiss()
      toast.success('Register success')
      navigate('/')
      reset()
    },
    onError: (error: any) => {
      toast.dismiss()
      toast.error(error.message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    const formData = {
      username: data.username,
      password: data.password
    }
    registerMutation.mutate(formData)
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

        <InputField
          name='confirmPassword'
          label='Confirm password'
          control={control}
          placeholder='Confirm password'
          color='success'
          type={showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge='end'
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          loading={registerMutation.isLoading}
        >
          Register
        </LoadingButton>
      </Box>
      <Button component={Link} to='/login' sx={{ textTransform: 'none' }}>
        Already have an account? Login
      </Button>
    </>
  )
}

export default Register
