import Head from 'next/head'

interface HearderProps {
  title: string
  description: string
}

export default function Header({title, description}: HearderProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  )
}
