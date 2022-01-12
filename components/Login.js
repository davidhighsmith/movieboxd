import { signIn, useSession } from 'next-auth/react';

const Login = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <></>;

  if (status !== 'authenticated') {
    return (
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    )
  }

  if (status === 'authenticated') {
    return (
      <>
        <button onClick={() => signOut()}>Sign Out</button>
        <div>
          {JSON.stringify(session, null, 2)}
        </div>
      </>
    )
  }
}

export default Login;