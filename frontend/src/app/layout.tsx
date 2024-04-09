'use client'
import { SessionProvider } from 'next-auth/react'
import Box from '@mui/material/Box'

export default function RootLayout({
  children,
  session,
}: {
  children: any
  session: any
}) {
  return (
    <html lang='pt' >
      <body style={{
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: '#f0f0f0',
      
      }}>
        <SessionProvider session={session}>
         
                <Box
                  sx={{
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {children}
                </Box>
              
        </SessionProvider>
      </body>
    </html>
  )
}
