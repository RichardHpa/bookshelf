/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import * as colors from 'colors'
import {FullPageSpinner} from 'components/lib'
import {useAsync} from './utils/hooks'

async function getUser() {
  let user = null
  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }
  return user
}

function App() {
  // const [user, setUser] = React.useState(null)
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    // getUser().then(user => getUser(user))
    run(getUser())
  }, [run])

  // const login = form => auth.login(form).then(u => setUser(u))
  // const register = form => auth.register(form).then(u => setUser(u))
  // const logout = () => auth.logout().then(() => setUser(null))
  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => auth.logout().then(() => setData(null))

  if (isLoading || isIdle) return <FullPageSpinner />
  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }
  if (isSuccess) {
    return user ? (
      <AuthenticatedApp user={user} logout={logout} />
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    )
  }
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
