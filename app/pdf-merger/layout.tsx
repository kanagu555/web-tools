import { Metadata } from "next"

export const metadata: Metadata = {
  title: "PDF Merger | KodeKit",
  description: "Combine multiple PDF files into a single document with custom ordering using our free online PDF merger tool.",
  keywords: ["PDF merger", "combine PDF", "merge PDF files", "PDF joiner", "free PDF merger", "KodeKit PDF tools"],
  openGraph: {
    title: "Free Online PDF Merger | KodeKit",
    description: "Combine multiple PDF files into a single document with our free online PDF merger tool.",
  }
}

export default function PdfMergerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}