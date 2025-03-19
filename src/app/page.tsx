"use client"; // Required for useSession()

import Link from 'next/link';
import { FaChartLine, FaHandshake, FaThumbsDown, FaUserFriends } from 'react-icons/fa';
import { signIn, signOut, useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";


export default function Home() {
  const { data: session } = useSession(); // Use session from the client

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar/>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-400 to-blue-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              સ્માર્ટ ક્રેડિટ નિર્ણયો લો
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              વાસ્તવિક ક્રેડિટ અનુભવ શેર કરો અને શોધો. તમારા આગામી નાણાકીય પગલાં પહેલાં શું યોગ્ય છે અને શું નહીં તે જાણો.
            </p>
            {!session ? (
              <button onClick={() => signIn("google")} className="bg-white text-blue-900 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-100 transition duration-300">
                શરૂ કરો
              </button>
            ) : (
              <Link href="/dashboard" className="bg-white text-blue-900 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-100 transition duration-300">
                ડેશબોર્ડ પર જાઓ
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-black text-3xl md:text-4xl font-bold text-center mb-12">ક્રેડિટ ટ્રેકર શા માટે વાપરો?</h2>
          <div className="text-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaHandshake />, title: 'ન્યાયસંગત ડીલ', desc: 'સમુદાય સાથે ન્યાયસંગત ક્રેડિટ તક શોધો અને શેર કરો.' },
              { icon: <FaThumbsDown />, title: 'ઠગાઈથી બચો', desc: 'અન્ય લોકોના ખરાબ અનુભવમાંથી શીખો અને અનૈતિક સોદાઓથી દૂર રહો.' },
              { icon: <FaChartLine />, title: 'પ્રગતિની મોનિટરિંગ કરો', desc: 'તમારા નાણાકીય પ્રવાસને ટ્રેક કરો અને સમુદાયમાંથી શીખો.' },
              { icon: <FaUserFriends />, title: 'સમુદાય સહાય', desc: 'જેમણે પહેલા એ અનુભવી છે તેમની પાસેથી સલાહ અને સહાય મેળવાવો.' }
            ].map(({ icon, title, desc }, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl text-blue-700 flex justify-center mb-4">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">સારા નાણાકીય નિર્ણયો લેવા માટે તૈયાર છો?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ક્રેડિટ ટ્રેકર સાથે તમારું નાણાકીય ભવિષ્ય નિયંત્રિત કરતા હજારો પુરુષોમાં જોડાઓ.
          </p>
          {!session ? (
            <button onClick={() => signIn("google")} className="bg-white text-blue-700 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-300">
              હમણાં જ જોડાઓ
            </button>
          ) : (
            <Link href="/dashboard" className="bg-white text-blue-700 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-300">
              ડેશબોર્ડ જુઓ
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
