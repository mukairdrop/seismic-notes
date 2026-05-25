export const metadata = {

  title: "Seismic Notes",

  description:
    "Web3 Notes App",
};

export default function RootLayout({

  children,

}) {

  return (

    <html lang="en">

      <body>

        {children}

      </body>

    </html>
  );
}
