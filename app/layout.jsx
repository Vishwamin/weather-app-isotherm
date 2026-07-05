import './globals.css';

export const metadata = {
  title: 'Isotherm — Weather Console',
  description:
    'A real-time weather console built by Vishwamin Patha for the PM Accelerator AI Engineer Intern technical assessment.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-body">{children}</body>
    </html>
  );
}
