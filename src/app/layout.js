
import './globals.css';

export const metadata = {
  title: 'Student Management Dashboard',
  description: 'A Next.js application for managing student records',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}