import './globals.css';
import { Providers } from './providers';
import FloatingUI from './components/FloatingUI';
import AppShell from './components/AppShell';

export const metadata = {
   title: 'Sokudo Electric Scooters',
   description: 'High Speed EV Scooters in India',
};

export default function RootLayout({ children }) {
   return (
      <html lang='en'>
         <body suppressHydrationWarning={true}>
            <Providers>
               <AppShell>{children}</AppShell>
            </Providers>
            <FloatingUI />
         </body>
      </html>
   );
}
