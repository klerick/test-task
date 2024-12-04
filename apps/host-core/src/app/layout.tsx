import './global.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full bg-white light"
      style={{ colorScheme: 'light' }}
    >
      <body>
        <div className="min-h-[100vh] max-w-[1440px] m-auto lg:flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
