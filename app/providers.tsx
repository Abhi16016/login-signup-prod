"use client"

import { SessionProvider } from "next-auth/react"

const Providers = ({children}: {
    children: React.ReactNode
}) => {
   return (
     <SessionProvider 
       refetchInterval={0} 
       refetchOnWindowFocus={true}
     >
        {children}
    </SessionProvider>
   )
}
export default Providers